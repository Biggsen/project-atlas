import * as fs from 'fs';
import * as path from 'path';
import { ParsedProject } from './types';

interface ProjectSummary {
  manifest: any;
  workItemsSummary: {
    total: number;
    completed: number;
    incomplete: number;
    completionPercentage: number;
    byType: {
      features: number;
      enhancements: number;
      bugs: number;
      tasks: number;
    };
  };
}

/**
 * Export all project data to a single markdown file
 */
export function exportAllProjects(
  dataDir: string,
  outputPath: string
): void {
  const indexPath = path.join(dataDir, 'index.json');
  
  if (!fs.existsSync(indexPath)) {
    throw new Error(`Index file not found: ${indexPath}`);
  }

  const indexData: ProjectSummary[] = JSON.parse(
    fs.readFileSync(indexPath, 'utf-8')
  );

  const markdown: string[] = [];
  
  markdown.push('# Project Atlas - All Projects Export');
  markdown.push('');
  markdown.push(`**Generated**: ${new Date().toISOString()}`);
  markdown.push(`**Total Projects**: ${indexData.length}`);
  markdown.push('');
  markdown.push('---');
  markdown.push('');

  // Summary statistics
  const totalWorkItems = indexData.reduce((sum, p) => sum + p.workItemsSummary.total, 0);
  const completedWorkItems = indexData.reduce((sum, p) => sum + p.workItemsSummary.completed, 0);
  const totalFeatures = indexData.reduce((sum, p) => sum + p.workItemsSummary.byType.features, 0);
  const totalEnhancements = indexData.reduce((sum, p) => sum + p.workItemsSummary.byType.enhancements, 0);
  const totalBugs = indexData.reduce((sum, p) => sum + p.workItemsSummary.byType.bugs, 0);
  const totalTasks = indexData.reduce((sum, p) => sum + p.workItemsSummary.byType.tasks, 0);

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
  for (const projectSummary of indexData) {
    const projectPath = path.join(dataDir, `${projectSummary.manifest.projectId}.json`);
    
    if (!fs.existsSync(projectPath)) {
      console.warn(`Warning: Project file not found: ${projectPath}`);
      continue;
    }

    const project: ParsedProject = JSON.parse(
      fs.readFileSync(projectPath, 'utf-8')
    );

    markdown.push(`## ${project.manifest.name}`);
    markdown.push('');
    markdown.push('### Manifest');
    markdown.push('');
    markdown.push('```json');
    markdown.push(JSON.stringify(project.manifest, null, 2));
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
      features: project.workItems.filter(w => w.type === 'features'),
      enhancements: project.workItems.filter(w => w.type === 'enhancements'),
      bugs: project.workItems.filter(w => w.type === 'bugs'),
      tasks: project.workItems.filter(w => w.type === 'tasks'),
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
    if (project.sections.length > 0) {
      markdown.push('### Project Sections');
      markdown.push('');
      for (const section of project.sections) {
        markdown.push(`#### ${section.heading}`);
        markdown.push('');
        markdown.push(section.content);
        markdown.push('');
      }
    }

    markdown.push('---');
    markdown.push('');
  }

  // Write output file
  const outputDir = path.dirname(outputPath);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  fs.writeFileSync(outputPath, markdown.join('\n'), 'utf-8');
  console.log(`✅ Exported ${indexData.length} project(s) to: ${outputPath}`);
}

