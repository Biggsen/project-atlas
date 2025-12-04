// Manifest types
export interface Manifest {
  schemaVersion: number;
  projectId: string;
  name: string;
  repo: string;
  visibility: 'public' | 'staging' | 'private';
  status: 'active' | 'mvp' | 'paused' | 'archived';
  domain: 'music' | 'minecraft' | 'management' | 'other';
  type: 'webapp' | 'microservice' | 'tool' | 'cli' | 'library' | 'other';
  lastUpdated: string;
  links: {
    prod: string | null;
    staging: string | null;
  };
  tags: string[];
}

// Work item types
export type WorkItemType = 'features' | 'enhancements' | 'bugs' | 'tasks';

export interface WorkItem {
  type: WorkItemType;
  content: string;
  completed: boolean;
  section: string;
}

export interface ParsedSection {
  heading: string;
  level: number;
  content: string;
  workItems: WorkItem[];
}

export interface ParsedProject {
  manifest: Manifest;
  sections: ParsedSection[];
  workItems: WorkItem[];
}

export interface ProjectSummary {
  manifest: Manifest;
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

