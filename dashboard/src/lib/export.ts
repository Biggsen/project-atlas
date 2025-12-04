import type { ProjectSummary, ParsedProject } from '../types';
import { loadAllProjects } from './api';

/**
 * Generate markdown export from project data
 */
export function generateExportMarkdown(
  projects: ProjectSummary[],
  fullProjects: ParsedProject[]
): string {
  const markdown: string[] = [];
  
  markdown.push('# Project Atlas - All Projects Export');
  markdown.push('');
  markdown.push(`**Generated**: ${new Date().toISOString()}`);
  markdown.push(`**Total Projects**: ${projects.length}`);
  markdown.push('');
  markdown.push('---');
  markdown.push('');

  // Summary statistics
  const totalWorkItems = projects.reduce((sum, p) => sum + p.workItemsSummary.total, 0);
  const completedWorkItems = projects.reduce((sum, p) => sum + p.workItemsSummary.completed, 0);
  const totalFeatures = projects.reduce((sum, p) => sum + p.workItemsSummary.byType.features, 0);
  const totalEnhancements = projects.reduce((sum, p) => sum + p.workItemsSummary.byType.enhancements, 0);
  const totalBugs = projects.reduce((sum, p) => sum + p.workItemsSummary.byType.bugs, 0);
  const totalTasks = projects.reduce((sum, p) => sum + p.workItemsSummary.byType.tasks, 0);

  markdown.push('## Summary Statistics');
  markdown.push('');
  markdown.push(`- **Total Work Items**: ${totalWorkItems}`);
  if (totalWorkItems > 0) {
    markdown.push(`- **Completed**: ${completedWorkItems} (${Math.round((completedWorkItems / totalWorkItems) * 100)}%)`);
    markdown.push(`- **Incomplete**: ${totalWorkItems - completedWorkItems}`);
  }
  markdown.push(`- **By Type**:`);
  markdown.push(`  - Features: ${totalFeatures}`);
  markdown.push(`  - Enhancements: ${totalEnhancements}`);
  markdown.push(`  - Bugs: ${totalBugs}`);
  markdown.push(`  - Tasks: ${totalTasks}`);
  markdown.push('');
  markdown.push('---');
  markdown.push('');

  // Process each project
  for (const projectSummary of projects) {
    const fullProject = fullProjects.find(p => p.manifest.projectId === projectSummary.manifest.projectId);
    
    if (!fullProject) {
      console.warn(`Warning: Full project data not found for: ${projectSummary.manifest.projectId}`);
      continue;
    }

    markdown.push(`## ${fullProject.manifest.name}`);
    markdown.push('');
    markdown.push('### Manifest');
    markdown.push('');
    markdown.push('```json');
    markdown.push(JSON.stringify(fullProject.manifest, null, 2));
    markdown.push('```');
    markdown.push('');

    // Work Items Summary
    markdown.push('### Work Items Summary');
    markdown.push('');
    markdown.push(`- **Total**: ${projectSummary.workItemsSummary.total}`);
    markdown.push(`- **Completed**: ${projectSummary.workItemsSummary.completed} (${projectSummary.workItemsSummary.completionPercentage}%)`);
    markdown.push(`- **Incomplete**: ${projectSummary.workItemsSummary.incomplete}`);
    markdown.push(`- **By Type**:`);
    markdown.push(`  - Features: ${projectSummary.workItemsSummary.byType.features}`);
    markdown.push(`  - Enhancements: ${projectSummary.workItemsSummary.byType.enhancements}`);
    markdown.push(`  - Bugs: ${projectSummary.workItemsSummary.byType.bugs}`);
    markdown.push(`  - Tasks: ${projectSummary.workItemsSummary.byType.tasks}`);
    markdown.push('');

    // Work Items by Type
    const workItemsByType = {
      features: fullProject.workItems.filter(w => w.type === 'features'),
      enhancements: fullProject.workItems.filter(w => w.type === 'enhancements'),
      bugs: fullProject.workItems.filter(w => w.type === 'bugs'),
      tasks: fullProject.workItems.filter(w => w.type === 'tasks'),
    };

    if (workItemsByType.features.length > 0) {
      markdown.push('### Features');
      markdown.push('');
      for (const item of workItemsByType.features) {
        const checkbox = item.completed ? '[x]' : '[ ]';
        markdown.push(`- ${checkbox} ${item.content}`);
      }
      markdown.push('');
    }

    if (workItemsByType.enhancements.length > 0) {
      markdown.push('### Enhancements');
      markdown.push('');
      for (const item of workItemsByType.enhancements) {
        const checkbox = item.completed ? '[x]' : '[ ]';
        markdown.push(`- ${checkbox} ${item.content}`);
      }
      markdown.push('');
    }

    if (workItemsByType.bugs.length > 0) {
      markdown.push('### Bugs');
      markdown.push('');
      for (const item of workItemsByType.bugs) {
        const checkbox = item.completed ? '[x]' : '[ ]';
        markdown.push(`- ${checkbox} ${item.content}`);
      }
      markdown.push('');
    }

    if (workItemsByType.tasks.length > 0) {
      markdown.push('### Tasks');
      markdown.push('');
      for (const item of workItemsByType.tasks) {
        const checkbox = item.completed ? '[x]' : '[ ]';
        markdown.push(`- ${checkbox} ${item.content}`);
      }
      markdown.push('');
    }

    // Sections Content
    if (fullProject.sections.length > 0) {
      markdown.push('### Project Sections');
      markdown.push('');
      for (const section of fullProject.sections) {
        markdown.push(`#### ${section.heading}`);
        markdown.push('');
        markdown.push(section.content);
        markdown.push('');
      }
    }

    markdown.push('---');
    markdown.push('');
  }

  return markdown.join('\n');
}

/**
 * Download markdown content as a file
 */
export function downloadMarkdown(content: string, filename: string = 'all-projects-summary.md'): void {
  const blob = new Blob([content], { type: 'text/markdown' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Export all projects to markdown file
 */
export async function exportAllProjects(projects: ProjectSummary[]): Promise<void> {
  const projectIds = projects.map(p => p.manifest.projectId);
  const fullProjects = await loadAllProjects(projectIds);
  const markdown = generateExportMarkdown(projects, fullProjects);
  const timestamp = new Date().toISOString().split('T')[0];
  downloadMarkdown(markdown, `all-projects-summary-${timestamp}.md`);
}

