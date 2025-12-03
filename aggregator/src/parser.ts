import { remark } from 'remark';
import { visit } from 'unist-util-visit';
import type { Root, Heading, ListItem, Text, Paragraph } from 'mdast';
import { Manifest, ParsedSection, WorkItem, WorkItemType, ParsedProject } from './types';
import { validateManifest } from './validator';

const MANIFEST_START = '<!-- PROJECT-MANIFEST:START -->';
const MANIFEST_END = '<!-- PROJECT-MANIFEST:END -->';

// Section heading patterns that map to work item types
const WORK_ITEM_PATTERNS: { pattern: RegExp; type: WorkItemType }[] = [
  { pattern: /^features?\s*(done|completed|in progress|in-progress)?/i, type: 'features' },
  { pattern: /^enhancements?/i, type: 'enhancements' },
  { pattern: /^(known\s+)?issues?|(active\s+)?bugs?|open\s+issues?/i, type: 'bugs' },
  { pattern: /^(outstanding\s+)?tasks?|todo/i, type: 'tasks' },
];

/**
 * Extract manifest block from markdown content
 */
export function extractManifest(content: string): {
  manifest: string | null;
  contentWithoutManifest: string;
} {
  const startIndex = content.indexOf(MANIFEST_START);
  const endIndex = content.indexOf(MANIFEST_END);

  if (startIndex === -1 || endIndex === -1 || endIndex <= startIndex) {
    return { manifest: null, contentWithoutManifest: content };
  }

  const manifestStart = startIndex + MANIFEST_START.length;
  const manifestEnd = endIndex;
  const manifestBlock = content.substring(manifestStart, manifestEnd).trim();

  // Extract JSON from code block if present
  const jsonMatch = manifestBlock.match(/```json\s*([\s\S]*?)\s*```/);
  const manifestJson = jsonMatch ? jsonMatch[1].trim() : manifestBlock;

  // Remove manifest block from content
  const beforeManifest = content.substring(0, startIndex);
  const afterManifest = content.substring(endIndex + MANIFEST_END.length);
  const contentWithoutManifest = (beforeManifest + afterManifest).trim();

  return { manifest: manifestJson, contentWithoutManifest };
}

/**
 * Parse manifest JSON and validate against schema
 */
export function parseManifest(manifestJson: string): {
  success: boolean;
  manifest?: Manifest;
  error?: string;
} {
  try {
    const parsed = JSON.parse(manifestJson);
    const validation = validateManifest(parsed);

    if (validation.valid && validation.manifest) {
      return { success: true, manifest: validation.manifest };
    }

    return {
      success: false,
      error: `Validation failed: ${validation.errors?.join(', ')}`,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown JSON parse error',
    };
  }
}

/**
 * Determine work item type from section heading
 */
function getWorkItemType(heading: string): WorkItemType | null {
  const normalized = heading.toLowerCase().trim();
  for (const { pattern, type } of WORK_ITEM_PATTERNS) {
    if (pattern.test(normalized)) {
      return type;
    }
  }
  return null;
}

/**
 * Extract TODO items from list item content
 */
function extractTodoItems(
  content: string,
  sectionHeading: string,
  workItemType: WorkItemType | null
): WorkItem[] {
  const items: WorkItem[] = [];
  const todoRegex = /^-\s*\[([ x])\]\s*(.+)$/gm;
  let match;

  while ((match = todoRegex.exec(content)) !== null) {
    const completed = match[1].trim() === 'x';
    const text = match[2].trim();

    if (workItemType) {
      items.push({
        type: workItemType,
        content: text,
        completed,
        section: sectionHeading,
      });
    }
  }

  return items;
}

/**
 * Parse markdown sections and extract work items
 */
export async function parseMarkdownSections(
  content: string
): Promise<{ sections: ParsedSection[]; workItems: WorkItem[] }> {
  const tree = await remark().parse(content);
  const sections: ParsedSection[] = [];
  const allWorkItems: WorkItem[] = [];

  let currentSection: ParsedSection | null = null;

  visit(tree, (node: any) => {
    if (node.type === 'heading') {
      const heading = node as Heading;
      const headingText = extractHeadingText(heading);

      // Only create new sections for top-level headings (##)
      // Subheadings (###, ####) are part of the current section's content
      if (heading.depth === 2) {
        // Save previous section if exists
        if (currentSection) {
          sections.push(currentSection);
        }

        // Determine work item type
        const workItemType = getWorkItemType(headingText);

        // Start new section
        currentSection = {
          heading: headingText,
          level: heading.depth,
          content: '',
          workItems: [],
        };
      } else if (currentSection) {
        // Subheading - add to current section content
        currentSection.content += '#'.repeat(heading.depth) + ' ' + headingText + '\n\n';
      }
    } else if (currentSection && node.type === 'paragraph') {
      const paragraph = node as Paragraph;
      const text = extractTextFromNode(paragraph);
      if (text) {
        currentSection.content += text + '\n\n';
      }
    } else if (currentSection && node.type === 'list') {
      // Extract list items and check for TODOs
      const listContent = extractListContent(node);
      currentSection.content += listContent + '\n\n';

      // Extract TODO items from this list
      const workItemType = getWorkItemType(currentSection.heading);
      if (workItemType) {
        const todos = extractTodoItems(listContent, currentSection.heading, workItemType);
        currentSection.workItems.push(...todos);
        allWorkItems.push(...todos);
      }
    } else if (currentSection) {
      // Collect other content (but not headings)
      const text = extractTextFromNode(node);
      if (text) {
        currentSection.content += text + '\n\n';
      }
    }
  });

  // Don't forget the last section
  if (currentSection) {
    sections.push(currentSection);
  }

  return { sections, workItems: allWorkItems };
}

/**
 * Extract text content from a heading node
 */
function extractHeadingText(heading: Heading): string {
  let text = '';
  visit(heading, (node) => {
    if (node.type === 'text') {
      text += (node as Text).value;
    }
  });
  return text;
}

/**
 * Extract text content from any node
 */
function extractTextFromNode(node: any): string {
  let text = '';
  if (node.type === 'text') {
    return (node as Text).value;
  }
  if (node.children) {
    for (const child of node.children) {
      text += extractTextFromNode(child);
    }
  }
  return text;
}

/**
 * Extract list content as markdown
 */
function extractListContent(node: any): string {
  let content = '';
  if (node.children) {
    for (const item of node.children) {
      if (item.type === 'listItem') {
        const listItem = item as ListItem;
        let itemText = '- ';
        
        // Check if it's a TODO item
        if (listItem.children[0]?.type === 'paragraph') {
          const para = listItem.children[0];
          if (para.children[0]?.type === 'text') {
            const text = (para.children[0] as Text).value;
            if (text.match(/^\[([ x])\]/)) {
              itemText += text;
            } else {
              itemText += extractTextFromNode(para);
            }
          }
        }
        
        content += itemText + '\n';
      }
    }
  }
  return content;
}

/**
 * Main parser function - extracts manifest and parses markdown
 */
export async function parseProjectFile(
  content: string
): Promise<{
  success: boolean;
  project?: ParsedProject;
  error?: string;
}> {
  try {
    // Extract manifest
    const { manifest: manifestJson, contentWithoutManifest } = extractManifest(content);

    if (!manifestJson) {
      return { success: false, error: 'Manifest block not found' };
    }

    // Parse and validate manifest
    const manifestResult = parseManifest(manifestJson);
    if (!manifestResult.success || !manifestResult.manifest) {
      return {
        success: false,
        error: manifestResult.error || 'Failed to parse manifest',
      };
    }

    // Parse markdown sections
    const { sections, workItems } = await parseMarkdownSections(contentWithoutManifest);

    return {
      success: true,
      project: {
        manifest: manifestResult.manifest,
        sections,
        workItems,
      },
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown parsing error',
    };
  }
}
