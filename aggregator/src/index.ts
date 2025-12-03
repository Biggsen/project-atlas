import * as fs from 'fs';
import * as path from 'path';
import { parseProjectFile } from './parser';

/**
 * Test the parser with converted reference files
 */
async function testParser() {
  const referenceDir = path.join(__dirname, '../../spec/reference');
  const convertedFiles = [
    'mc-map-generator-project-summary-converted.md',
    'musicaid-project-summary-converted.md',
    'region-forge-project-summary-converted.md',
  ];

  console.log('Testing parser with converted reference files...\n');

  for (const file of convertedFiles) {
    const filePath = path.join(referenceDir, file);
    console.log(`\n=== Testing: ${file} ===`);

    try {
      const content = fs.readFileSync(filePath, 'utf-8');
      const result = await parseProjectFile(content);

      if (result.success && result.project) {
        const { manifest, sections, workItems } = result.project;
        console.log(`✅ Successfully parsed`);
        console.log(`   Project: ${manifest.name}`);
        console.log(`   Sections: ${sections.length}`);
        console.log(`   Work Items: ${workItems.length}`);
        console.log(`   Features: ${workItems.filter((w) => w.type === 'features').length}`);
        console.log(`   Enhancements: ${workItems.filter((w) => w.type === 'enhancements').length}`);
        console.log(`   Bugs: ${workItems.filter((w) => w.type === 'bugs').length}`);
        console.log(`   Tasks: ${workItems.filter((w) => w.type === 'tasks').length}`);
      } else {
        console.log(`❌ Failed: ${result.error}`);
      }
    } catch (error) {
      console.log(`❌ Error reading file: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}

// Run tests if this file is executed directly
if (require.main === module) {
  testParser().catch(console.error);
}

export { testParser };
