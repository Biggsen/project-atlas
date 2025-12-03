import type { ParsedProject, ProjectSummary } from '../types';

const DATA_BASE = '/projects';

/**
 * Load the project index
 */
export async function loadProjectIndex(): Promise<ProjectSummary[]> {
  const response = await fetch(`${DATA_BASE}/index.json`);
  if (!response.ok) {
    throw new Error(`Failed to load project index: ${response.statusText}`);
  }
  return response.json();
}

/**
 * Load a specific project by ID
 */
export async function loadProject(projectId: string): Promise<ParsedProject> {
  const response = await fetch(`${DATA_BASE}/${projectId}.json`);
  if (!response.ok) {
    throw new Error(`Failed to load project ${projectId}: ${response.statusText}`);
  }
  return response.json();
}

/**
 * Check if a project is stale (lastUpdated older than 20 days)
 */
export function isStale(lastUpdated: string): boolean {
  const updated = new Date(lastUpdated);
  const now = new Date();
  const daysSinceUpdate = (now.getTime() - updated.getTime()) / (1000 * 60 * 60 * 24);
  return daysSinceUpdate > 20;
}

