<script lang="ts">
  import type { ProjectSummary } from '../types';
  import { isStale } from './api';

  export let projects: ProjectSummary[] = [];
  export let onSelect: (projectId: string) => void;

  let filterDomain: string = 'all';
  let filterType: string = 'all';
  let filterStatus: string = 'all';
  let filterVisibility: string = 'all';
  let sortBy: string = 'name';

  $: filteredProjects = projects
    .filter((p) => {
      if (filterDomain !== 'all' && p.manifest.domain !== filterDomain) return false;
      if (filterType !== 'all' && p.manifest.type !== filterType) return false;
      if (filterStatus !== 'all' && p.manifest.status !== filterStatus) return false;
      if (filterVisibility !== 'all' && p.manifest.visibility !== filterVisibility) return false;
      return true;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.manifest.name.localeCompare(b.manifest.name);
        case 'lastUpdated':
          return new Date(b.manifest.lastUpdated).getTime() - new Date(a.manifest.lastUpdated).getTime();
        case 'totalWorkItems':
          return b.workItemsSummary.total - a.workItemsSummary.total;
        case 'completionPercentage':
          return b.workItemsSummary.completionPercentage - a.workItemsSummary.completionPercentage;
        default:
          return 0;
      }
    });

  $: domains = [...new Set(projects.map((p) => p.manifest.domain))].sort();
  $: types = [...new Set(projects.map((p) => p.manifest.type))].sort();
  $: statuses = [...new Set(projects.map((p) => p.manifest.status))].sort();
  $: visibilities = [...new Set(projects.map((p) => p.manifest.visibility))].sort();

  // Helper function to get completion percentage (with fallback for old data)
  function getCompletionPercentage(project: ProjectSummary): number {
    if (project.workItemsSummary.completionPercentage !== undefined) {
      return project.workItemsSummary.completionPercentage;
    }
    // Fallback: calculate from completed/incomplete if available
    if (project.workItemsSummary.completed !== undefined && project.workItemsSummary.total > 0) {
      return Math.round((project.workItemsSummary.completed / project.workItemsSummary.total) * 100);
    }
    return 0;
  }
</script>

<div class="project-list">
  <div class="filters">
    <div class="filter-group">
      <label for="domain">Domain:</label>
      <select id="domain" bind:value={filterDomain}>
        <option value="all">All</option>
        {#each domains as domain}
          <option value={domain}>{domain}</option>
        {/each}
      </select>
    </div>

    <div class="filter-group">
      <label for="type">Type:</label>
      <select id="type" bind:value={filterType}>
        <option value="all">All</option>
        {#each types as type}
          <option value={type}>{type}</option>
        {/each}
      </select>
    </div>

    <div class="filter-group">
      <label for="status">Status:</label>
      <select id="status" bind:value={filterStatus}>
        <option value="all">All</option>
        {#each statuses as status}
          <option value={status}>{status}</option>
        {/each}
      </select>
    </div>

    <div class="filter-group">
      <label for="visibility">Visibility:</label>
      <select id="visibility" bind:value={filterVisibility}>
        <option value="all">All</option>
        {#each visibilities as visibility}
          <option value={visibility}>{visibility}</option>
        {/each}
      </select>
    </div>

    <div class="filter-group">
      <label for="sort">Sort by:</label>
      <select id="sort" bind:value={sortBy}>
        <option value="name">Name</option>
        <option value="lastUpdated">Last Updated</option>
        <option value="totalWorkItems">Work Items</option>
        <option value="completionPercentage">Completion %</option>
      </select>
    </div>
  </div>

  <div class="projects-grid">
    {#each filteredProjects as project (project.manifest.projectId)}
      <div
        class="project-card"
        class:stale={isStale(project.manifest.lastUpdated)}
        on:click={() => onSelect(project.manifest.projectId)}
        role="button"
        tabindex="0"
        on:keydown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            onSelect(project.manifest.projectId);
          }
        }}
      >
        <div class="project-header">
          <h2>{project.manifest.name}</h2>
          <span class="status-badge" class:status-active={project.manifest.status === 'active'} class:status-mvp={project.manifest.status === 'mvp'} class:status-paused={project.manifest.status === 'paused'} class:status-archived={project.manifest.status === 'archived'}>
            {project.manifest.status}
          </span>
        </div>

        <div class="project-meta">
          <span class="domain">{project.manifest.domain}</span>
          <span class="type">{project.manifest.type}</span>
          {#if isStale(project.manifest.lastUpdated)}
            <span class="stale-indicator">⚠️ Stale</span>
          {/if}
        </div>

        <div class="work-items-summary">
          <div class="work-item-count">
            <strong>{project.workItemsSummary.total}</strong> total
            {#if project.workItemsSummary.total > 0}
              <span class="completion-percentage">
                {project.workItemsSummary.completionPercentage}% complete
              </span>
            {/if}
          </div>
          <div class="work-item-breakdown">
            <span>Features: {project.workItemsSummary.byType.features}</span>
            <span>Enhancements: {project.workItemsSummary.byType.enhancements}</span>
            <span>Bugs: {project.workItemsSummary.byType.bugs}</span>
            <span>Tasks: {project.workItemsSummary.byType.tasks}</span>
          </div>
        </div>

        <div class="project-footer">
          <span class="last-updated">Updated: {new Date(project.manifest.lastUpdated).toLocaleDateString()}</span>
        </div>
      </div>
    {/each}
  </div>

  {#if filteredProjects.length === 0}
    <div class="no-results">No projects match the selected filters.</div>
  {/if}
</div>

<style>
  .project-list {
    width: 100%;
  }

  .filters {
    display: flex;
    gap: 1rem;
    margin-bottom: 2rem;
    flex-wrap: wrap;
  }

  .filter-group {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  .filter-group label {
    font-size: 0.875rem;
    font-weight: 500;
    color: #666;
  }

  .filter-group select {
    padding: 0.5rem;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 0.875rem;
  }

  .projects-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 1.5rem;
  }

  .project-card {
    background: white;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    padding: 1.5rem;
    cursor: pointer;
    transition: all 0.2s;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  .project-card:hover {
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
    transform: translateY(-2px);
  }

  .project-card:focus {
    outline: 2px solid #646cff;
    outline-offset: 2px;
  }

  .project-card.stale {
    border-left: 4px solid #ff9800;
  }

  .project-header {
    display: flex;
    justify-content: space-between;
    align-items: start;
    margin-bottom: 1rem;
  }

  .project-header h2 {
    margin: 0;
    font-size: 1.25rem;
    color: #1a1a1a;
  }

  .status-badge {
    padding: 0.25rem 0.75rem;
    border-radius: 12px;
    font-size: 0.75rem;
    font-weight: 500;
    text-transform: uppercase;
  }

  .status-badge.status-active {
    background: #4caf50;
    color: white;
  }

  .status-badge.status-mvp {
    background: #2196f3;
    color: white;
  }

  .status-badge.status-paused {
    background: #ff9800;
    color: white;
  }

  .status-badge.status-archived {
    background: #9e9e9e;
    color: white;
  }

  .project-meta {
    display: flex;
    gap: 0.5rem;
    margin-bottom: 1rem;
    flex-wrap: wrap;
  }

  .project-meta span {
    padding: 0.25rem 0.5rem;
    background: #f5f5f5;
    border-radius: 4px;
    font-size: 0.75rem;
    color: #666;
  }

  .stale-indicator {
    background: #fff3cd !important;
    color: #856404 !important;
  }

  .work-items-summary {
    margin-bottom: 1rem;
  }

  .work-item-count {
    margin-bottom: 0.5rem;
    font-size: 0.875rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    flex-wrap: wrap;
  }

  .completion-percentage {
    padding: 0.25rem 0.5rem;
    background: #e3f2fd;
    border-radius: 4px;
    font-size: 0.75rem;
    color: #1976d2;
    font-weight: 500;
  }

  .work-item-breakdown {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    font-size: 0.75rem;
    color: #666;
  }

  .work-item-breakdown span {
    padding: 0.125rem 0.5rem;
    background: #f0f0f0;
    border-radius: 4px;
  }

  .project-footer {
    font-size: 0.75rem;
    color: #999;
  }

  .no-results {
    text-align: center;
    padding: 3rem;
    color: #666;
  }
</style>

