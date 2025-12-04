import 'dotenv/config';
import * as path from 'path';
import { runAggregation } from './aggregator';
import { exportAllProjects } from './exporter';

/**
 * Main entry point for the aggregator
 */
async function main() {
  const args = process.argv.slice(2);
  const command = args[0];

  if (command === 'export') {
    const dataDir = path.join(__dirname, '../../data/projects');
    const outputPath = path.join(__dirname, '../../data/all-projects-summary.md');
    exportAllProjects(dataDir, outputPath);
    return;
  }

  const configPath = path.join(__dirname, '../../config/projects.json');
  const outputDir = path.join(__dirname, '../../data/projects');
  const basePath = path.join(__dirname, '../..');

  await runAggregation(configPath, outputDir, basePath);
}

// Run aggregation if this file is executed directly
if (require.main === module) {
  main().catch((error) => {
    console.error('Aggregation failed:', error);
    process.exit(1);
  });
}

export { main };
