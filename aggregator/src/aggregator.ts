import * as fs from 'fs';
import * as path from 'path';
import { parseProjectFile } from './parser';
import type { ParsedProject } from './parser';
import type { WorkItem } from './types';
import { fetchProjectFile } from './fetcher';

export interface ProjectConfig {
  projectId: string;
  repo: string;
  path: string;
}

export interface AggregationResult {
  success: boolean;
  projects: ParsedProject[];
  errors: Array<{ projectId: string; error: string }>;
}

/**
 * Load project configuration from config file
 */
export function loadConfig(configPath: string): ProjectConfig[] {
  try {
    const content = fs.readFileSync(configPath, 'utf-8');
    const config = JSON.parse(content) as ProjectConfig[];
    return config;
  } catch (error) {
    throw new Error(
      `Failed to load config: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}

/**
 * Read project file from local filesystem (for testing/fallback)
 */
export async function readProjectFile(filePath: string): Promise<string> {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    return content;
  } catch (error) {
    throw new Error(
      `Failed to read file ${filePath}: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}

/**
 * Aggregate all projects from config
 */
export async function aggregateProjects(
  config: ProjectConfig[],
  basePath: string = process.cwd()
): Promise<AggregationResult> {
  const projects: ParsedProject[] = [];
  const errors: Array<{ projectId: string; error: string }> = [];

  for (const projectConfig of config) {
    try {
      console.log(`  Fetching ${projectConfig.projectId} from ${projectConfig.repo}...`);
      
      // Fetch from GitHub
      const fetchResult = await fetchProjectFile(projectConfig.repo, projectConfig.path);
      
      if (!fetchResult.success || !fetchResult.content) {
        errors.push({
          projectId: projectConfig.projectId,
          error: fetchResult.error || 'Failed to fetch file',
        });
        console.log(`    ❌ ${fetchResult.error}`);
        continue;
      }

      console.log(`    ✅ Fetched successfully`);
      
      // Parse the content
      const result = await parseProjectFile(fetchResult.content);

      if (result.success && result.project) {
        projects.push(result.project);
        console.log(`    ✅ Parsed successfully`);
      } else {
        errors.push({
          projectId: projectConfig.projectId,
          error: result.error || 'Unknown parsing error',
        });
        console.log(`    ❌ Parse error: ${result.error}`);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      errors.push({
        projectId: projectConfig.projectId,
        error: errorMessage,
      });
      console.log(`    ❌ Error: ${errorMessage}`);
    }
  }

  return {
    success: errors.length === 0 || projects.length > 0,
    projects,
    errors,
  };
}

/**
 * Write aggregated data to JSON files
 */
export function writeAggregatedData(
  projects: ParsedProject[],
  outputDir: string
): void {
  // Ensure output directory exists
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // Write index.json - array of all projects
  const indexData = projects.map((project) => ({
    manifest: project.manifest,
    workItemsSummary: {
      total: project.workItems.length,
      byType: {
        features: project.workItems.filter((w: WorkItem) => w.type === 'features').length,
        enhancements: project.workItems.filter((w: WorkItem) => w.type === 'enhancements').length,
        bugs: project.workItems.filter((w: WorkItem) => w.type === 'bugs').length,
        tasks: project.workItems.filter((w: WorkItem) => w.type === 'tasks').length,
      },
    },
  }));

  const indexPath = path.join(outputDir, 'index.json');
  fs.writeFileSync(indexPath, JSON.stringify(indexData, null, 2), 'utf-8');

  // Write individual project files
  for (const project of projects) {
    const projectPath = path.join(outputDir, `${project.manifest.projectId}.json`);
    fs.writeFileSync(projectPath, JSON.stringify(project, null, 2), 'utf-8');
  }
}

/**
 * Main aggregation function
 */
export async function runAggregation(
  configPath: string,
  outputDir: string,
  basePath: string = process.cwd()
): Promise<void> {
  console.log('Starting aggregation...\n');

  // Load config
  console.log(`Loading config from: ${configPath}`);
  const config = loadConfig(configPath);
  console.log(`Found ${config.length} project(s) in config\n`);

  // Aggregate projects
  console.log('Parsing projects...');
  const result = await aggregateProjects(config, basePath);

  // Log results
  console.log(`\n✅ Successfully parsed: ${result.projects.length} project(s)`);
  if (result.errors.length > 0) {
    console.log(`\n❌ Errors: ${result.errors.length} project(s) failed`);
    for (const error of result.errors) {
      console.log(`   - ${error.projectId}: ${error.error}`);
    }
  }

  // Write output files
  if (result.projects.length > 0) {
    console.log(`\nWriting output files to: ${outputDir}`);
    writeAggregatedData(result.projects, outputDir);
    console.log(`✅ Wrote ${result.projects.length} project file(s) + index.json`);
  } else {
    console.log('\n⚠️  No projects to write');
  }
}

