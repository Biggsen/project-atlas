import type { ProjectSummary, ParsedProject } from '../types';
import { isStale } from './api';

export interface DriftProject {
  projectId: string;
  name: string;
  status: string;
  daysSinceUpdate: number;
}

export interface QuickWin {
  projectId: string;
  name: string;
  incompleteCount: number;
  completionPercentage: number;
}

export interface HighRiskProject {
  projectId: string;
  name: string;
  bugCount: number;
  completionPercentage: number;
  totalWorkItems: number;
}

export interface ReleaseReadyProject {
  projectId: string;
  name: string;
  completionPercentage: number;
  bugCount: number;
  totalWorkItems: number;
}

export interface CrossProjectAggregation {
  totalProjects: number;
  totalWorkItems: number;
  completedWorkItems: number;
  incompleteWorkItems: number;
  byType: {
    features: number;
    enhancements: number;
    bugs: number;
    tasks: number;
  };
  byStatus: {
    active: number;
    mvp: number;
    paused: number;
    archived: number;
  };
}

export interface Insights {
  drift: DriftProject[];
  quickWins: QuickWin[];
  highRisk: HighRiskProject[];
  releaseReady: ReleaseReadyProject[];
  aggregation: CrossProjectAggregation;
}

/**
 * Calculate days since last update
 */
function getDaysSinceUpdate(lastUpdated: string): number {
  const updated = new Date(lastUpdated);
  const now = new Date();
  return Math.floor((now.getTime() - updated.getTime()) / (1000 * 60 * 60 * 24));
}

/**
 * Calculate drift detection - active projects that are stale (>20 days)
 */
export function calculateDrift(projects: ProjectSummary[]): DriftProject[] {
  return projects
    .filter((p) => p.manifest.status === 'active' && isStale(p.manifest.lastUpdated))
    .map((p) => ({
      projectId: p.manifest.projectId,
      name: p.manifest.name,
      status: p.manifest.status,
      daysSinceUpdate: getDaysSinceUpdate(p.manifest.lastUpdated),
    }))
    .sort((a, b) => b.daysSinceUpdate - a.daysSinceUpdate);
}

/**
 * Calculate quick wins - projects with few incomplete items and decent completion
 */
export function calculateQuickWins(projects: ProjectSummary[]): QuickWin[] {
  return projects
    .filter((p) => {
      const incomplete = p.workItemsSummary.incomplete;
      const completion = p.workItemsSummary.completionPercentage;
      // Quick wins: < 5 incomplete items and > 50% complete
      return incomplete > 0 && incomplete <= 5 && completion >= 50;
    })
    .map((p) => ({
      projectId: p.manifest.projectId,
      name: p.manifest.name,
      incompleteCount: p.workItemsSummary.incomplete,
      completionPercentage: p.workItemsSummary.completionPercentage,
    }))
    .sort((a, b) => a.incompleteCount - b.incompleteCount);
}

/**
 * Calculate high-risk zones - projects with many bugs and low progress
 */
export function calculateHighRisk(projects: ProjectSummary[]): HighRiskProject[] {
  return projects
    .filter((p) => {
      const bugCount = p.workItemsSummary.byType.bugs;
      const completion = p.workItemsSummary.completionPercentage;
      // High risk: > 3 bugs and < 70% complete
      return bugCount >= 3 && completion < 70;
    })
    .map((p) => ({
      projectId: p.manifest.projectId,
      name: p.manifest.name,
      bugCount: p.workItemsSummary.byType.bugs,
      completionPercentage: p.workItemsSummary.completionPercentage,
      totalWorkItems: p.workItemsSummary.total,
    }))
    .sort((a, b) => {
      // Sort by bug count (descending), then by completion (ascending)
      if (b.bugCount !== a.bugCount) return b.bugCount - a.bugCount;
      return a.completionPercentage - b.completionPercentage;
    });
}

/**
 * Calculate release readiness - projects with high completion and few bugs
 */
export function calculateReleaseReady(projects: ProjectSummary[]): ReleaseReadyProject[] {
  return projects
    .filter((p) => {
      const completion = p.workItemsSummary.completionPercentage;
      const bugCount = p.workItemsSummary.byType.bugs;
      // Release ready: > 80% complete and < 3 bugs
      return completion >= 80 && bugCount < 3 && p.manifest.status !== 'archived';
    })
    .map((p) => ({
      projectId: p.manifest.projectId,
      name: p.manifest.name,
      completionPercentage: p.workItemsSummary.completionPercentage,
      bugCount: p.workItemsSummary.byType.bugs,
      totalWorkItems: p.workItemsSummary.total,
    }))
    .sort((a, b) => {
      // Sort by completion (descending), then by bug count (ascending)
      if (b.completionPercentage !== a.completionPercentage) {
        return b.completionPercentage - a.completionPercentage;
      }
      return a.bugCount - b.bugCount;
    });
}

/**
 * Calculate cross-project aggregation
 */
export function calculateAggregation(projects: ProjectSummary[]): CrossProjectAggregation {
  const aggregation: CrossProjectAggregation = {
    totalProjects: projects.length,
    totalWorkItems: 0,
    completedWorkItems: 0,
    incompleteWorkItems: 0,
    byType: {
      features: 0,
      enhancements: 0,
      bugs: 0,
      tasks: 0,
    },
    byStatus: {
      active: 0,
      mvp: 0,
      paused: 0,
      archived: 0,
    },
  };

  for (const project of projects) {
    aggregation.totalWorkItems += project.workItemsSummary.total;
    aggregation.completedWorkItems += project.workItemsSummary.completed || 0;
    aggregation.incompleteWorkItems += project.workItemsSummary.incomplete || 0;
    aggregation.byType.features += project.workItemsSummary.byType.features;
    aggregation.byType.enhancements += project.workItemsSummary.byType.enhancements;
    aggregation.byType.bugs += project.workItemsSummary.byType.bugs;
    aggregation.byType.tasks += project.workItemsSummary.byType.tasks;
    aggregation.byStatus[project.manifest.status as keyof typeof aggregation.byStatus]++;
  }

  return aggregation;
}

/**
 * Calculate all insights from projects
 */
export function calculateInsights(projects: ProjectSummary[]): Insights {
  return {
    drift: calculateDrift(projects),
    quickWins: calculateQuickWins(projects),
    highRisk: calculateHighRisk(projects),
    releaseReady: calculateReleaseReady(projects),
    aggregation: calculateAggregation(projects),
  };
}

