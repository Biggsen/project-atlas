<script lang="ts">
  import { onMount } from 'svelte';
  import { marked } from 'marked';
  import type { ParsedProject, WorkItem } from '../types';
  import { loadProject, isStale } from './api';

  export let projectId: string;
  export let onBack: () => void;

  let project: ParsedProject | null = null;
  let loading = true;
  let error: string | null = null;
  let filterWorkItemType: string = 'all';

  onMount(async () => {
    try {
      project = await loadProject(projectId);
      loading = false;
    } catch (e) {
      error = e instanceof Error ? e.message : 'Failed to load project';
      loading = false;
    }
  });

  $: filteredWorkItems = project
    ? project.workItems.filter((w) => filterWorkItemType === 'all' || w.type === filterWorkItemType)
    : [];

  $: completedWorkItems = filteredWorkItems.filter((w) => w.completed);
  $: incompleteWorkItems = filteredWorkItems.filter((w) => !w.completed);

  $: workItemsByType = project
    ? {
        features: project.workItems.filter((w) => w.type === 'features'),
        enhancements: project.workItems.filter((w) => w.type === 'enhancements'),
        bugs: project.workItems.filter((w) => w.type === 'bugs'),
        tasks: project.workItems.filter((w) => w.type === 'tasks'),
      }
    : { features: [], enhancements: [], bugs: [], tasks: [] };
</script>

<div class="project-view">
  {#if loading}
    <div class="loading">Loading project...</div>
  {:else if error}
    <div class="error">Error: {error}</div>
  {:else if project}
    <div class="project-header">
      <button class="back-button" on:click={onBack}>← Back</button>
      <div class="header-content">
        <h1>{project.manifest.name}</h1>
        <div class="header-meta">
          <span class="status-badge" class:status-active={project.manifest.status === 'active'} class:status-mvp={project.manifest.status === 'mvp'} class:status-paused={project.manifest.status === 'paused'} class:status-archived={project.manifest.status === 'archived'}>
            {project.manifest.status}
          </span>
          <span class="domain">{project.manifest.domain}</span>
          <span class="type">{project.manifest.type}</span>
          {#if isStale(project.manifest.lastUpdated)}
            <span class="stale-indicator">⚠️ Stale (updated {new Date(project.manifest.lastUpdated).toLocaleDateString()})</span>
          {/if}
        </div>
      </div>
    </div>

    <div class="project-info">
      <div class="info-section">
        <h2>Repository</h2>
        <p>
          <a href={`https://github.com/${project.manifest.repo}`} target="_blank" rel="noopener noreferrer">
            {project.manifest.repo}
          </a>
        </p>
      </div>

      {#if project.manifest.links.prod || project.manifest.links.staging}
        <div class="info-section">
          <h2>Links</h2>
          <div class="links">
            {#if project.manifest.links.prod}
              <a href={project.manifest.links.prod} target="_blank" rel="noopener noreferrer">
                Production
              </a>
            {/if}
            {#if project.manifest.links.staging}
              <a href={project.manifest.links.staging} target="_blank" rel="noopener noreferrer">
                Staging
              </a>
            {/if}
          </div>
        </div>
      {/if}

      {#if project.manifest.tags.length > 0}
        <div class="info-section">
          <h2>Tags</h2>
          <div class="tags">
            {#each project.manifest.tags as tag}
              <span class="tag">{tag}</span>
            {/each}
          </div>
        </div>
      {/if}
    </div>

    <div class="work-items-section">
      <div class="work-items-header">
        <h2>Work Items</h2>
        <select bind:value={filterWorkItemType}>
          <option value="all">All Types</option>
          <option value="features">Features</option>
          <option value="enhancements">Enhancements</option>
          <option value="bugs">Bugs</option>
          <option value="tasks">Tasks</option>
        </select>
      </div>

      <div class="work-items-stats">
        <div class="stat">
          <strong>{workItemsByType.features.length}</strong>
          <span>Features</span>
        </div>
        <div class="stat">
          <strong>{workItemsByType.enhancements.length}</strong>
          <span>Enhancements</span>
        </div>
        <div class="stat">
          <strong>{workItemsByType.bugs.length}</strong>
          <span>Bugs</span>
        </div>
        <div class="stat">
          <strong>{workItemsByType.tasks.length}</strong>
          <span>Tasks</span>
        </div>
      </div>

      <div class="work-items-list">
        {#if incompleteWorkItems.length > 0}
          <div class="work-items-group">
            <h3 class="group-header">Incomplete ({incompleteWorkItems.length})</h3>
            {#each incompleteWorkItems as item (item.content + item.section)}
              <div class="work-item">
                <div class="work-item-header">
                  <span class="work-item-type" class:type-features={item.type === 'features'} class:type-enhancements={item.type === 'enhancements'} class:type-bugs={item.type === 'bugs'} class:type-tasks={item.type === 'tasks'}>
                    {item.type}
                  </span>
                  <span class="work-item-status">⏳</span>
                </div>
                <div class="work-item-content">{item.content}</div>
                <div class="work-item-section">{item.section}</div>
              </div>
            {/each}
          </div>
        {/if}

        {#if completedWorkItems.length > 0}
          <div class="work-items-group">
            <h3 class="group-header">Completed ({completedWorkItems.length})</h3>
            {#each completedWorkItems as item (item.content + item.section)}
              <div class="work-item completed">
                <div class="work-item-header">
                  <span class="work-item-type" class:type-features={item.type === 'features'} class:type-enhancements={item.type === 'enhancements'} class:type-bugs={item.type === 'bugs'} class:type-tasks={item.type === 'tasks'}>
                    {item.type}
                  </span>
                  <span class="work-item-status">✅</span>
                </div>
                <div class="work-item-content">{item.content}</div>
                <div class="work-item-section">{item.section}</div>
              </div>
            {/each}
          </div>
        {/if}
      </div>

      {#if filteredWorkItems.length === 0}
        <div class="no-items">No work items match the selected filter.</div>
      {/if}
    </div>

    <div class="sections">
      <h2>Sections</h2>
      {#each project.sections as section}
        <div class="section">
          <h3>{section.heading}</h3>
          <div class="section-content">
            {#if section.content.trim()}
              {@html marked.parse(section.content)}
            {/if}
          </div>
        </div>
      {/each}
    </div>
  {/if}
</div>

<style>
  .project-view {
    width: 100%;
  }

  .project-header {
    margin-bottom: 2rem;
  }

  .back-button {
    background: #f5f5f5;
    border: 1px solid #ddd;
    border-radius: 4px;
    padding: 0.5rem 1rem;
    cursor: pointer;
    margin-bottom: 1rem;
    font-size: 0.875rem;
  }

  .back-button:hover {
    background: #e0e0e0;
  }

  .header-content h1 {
    margin: 0 0 0.5rem 0;
    font-size: 2rem;
  }

  .header-meta {
    display: flex;
    gap: 0.5rem;
    flex-wrap: wrap;
    align-items: center;
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

  .domain,
  .type {
    padding: 0.25rem 0.5rem;
    background: #f5f5f5;
    border-radius: 4px;
    font-size: 0.75rem;
    color: #666;
  }

  .stale-indicator {
    padding: 0.25rem 0.5rem;
    background: #fff3cd;
    color: #856404;
    border-radius: 4px;
    font-size: 0.75rem;
  }

  .project-info {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1.5rem;
    margin-bottom: 2rem;
  }

  .info-section h2 {
    font-size: 1rem;
    margin: 0 0 0.5rem 0;
    color: #666;
  }

  .links {
    display: flex;
    gap: 1rem;
  }

  .links a {
    color: #646cff;
    text-decoration: none;
  }

  .links a:hover {
    text-decoration: underline;
  }

  .tags {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
  }

  .tag {
    padding: 0.25rem 0.5rem;
    background: #e3f2fd;
    border-radius: 4px;
    font-size: 0.75rem;
    color: #1976d2;
  }

  .work-items-section {
    margin-bottom: 2rem;
  }

  .work-items-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
  }

  .work-items-header h2 {
    margin: 0;
  }

  .work-items-header select {
    padding: 0.5rem;
    border: 1px solid #ddd;
    border-radius: 4px;
  }

  .work-items-stats {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
    gap: 1rem;
    margin-bottom: 1.5rem;
  }

  .stat {
    text-align: center;
    padding: 1rem;
    background: #f5f5f5;
    border-radius: 8px;
  }

  .stat strong {
    display: block;
    font-size: 2rem;
    color: #1a1a1a;
  }

  .stat span {
    display: block;
    font-size: 0.875rem;
    color: #666;
    margin-top: 0.25rem;
  }

  .work-items-list {
    display: flex;
    flex-direction: column;
    gap: 2rem;
  }

  .work-items-group {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .group-header {
    font-size: 1.125rem;
    font-weight: 600;
    color: #1a1a1a;
    margin: 0 0 0.5rem 0;
    padding-bottom: 0.5rem;
    border-bottom: 2px solid #e0e0e0;
  }

  .work-item {
    background: white;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    padding: 1rem;
  }

  .work-item.completed {
    opacity: 0.7;
  }

  .work-item-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.5rem;
  }

  .work-item-type {
    padding: 0.25rem 0.75rem;
    border-radius: 12px;
    font-size: 0.75rem;
    font-weight: 500;
    text-transform: capitalize;
  }

  .work-item-type.type-features {
    background: #4caf50;
    color: white;
  }

  .work-item-type.type-enhancements {
    background: #2196f3;
    color: white;
  }

  .work-item-type.type-bugs {
    background: #f44336;
    color: white;
  }

  .work-item-type.type-tasks {
    background: #ff9800;
    color: white;
  }

  .work-item-content {
    margin-bottom: 0.5rem;
    color: #1a1a1a;
  }

  .work-item-section {
    font-size: 0.75rem;
    color: #999;
  }

  .sections {
    margin-top: 2rem;
  }

  .sections h2 {
    margin-bottom: 1rem;
  }

  .section {
    margin-bottom: 2rem;
    padding-bottom: 2rem;
    border-bottom: 1px solid #e0e0e0;
  }

  .section:last-child {
    border-bottom: none;
  }

  .section h3 {
    margin: 0 0 1rem 0;
    font-size: 1.25rem;
  }

  .section-content {
    color: #666;
    line-height: 1.6;
  }

  .section-content :global(p) {
    margin: 0.5rem 0;
  }

  .section-content :global(ul),
  .section-content :global(ol) {
    margin: 0.5rem 0;
    padding-left: 1.5rem;
  }

  .section-content :global(li) {
    margin: 0.25rem 0;
  }

  .section-content :global(code) {
    background: #f5f5f5;
    padding: 0.125rem 0.25rem;
    border-radius: 3px;
    font-family: 'Courier New', monospace;
    font-size: 0.9em;
  }

  .section-content :global(pre) {
    background: #f5f5f5;
    padding: 1rem;
    border-radius: 4px;
    overflow-x: auto;
    margin: 1rem 0;
  }

  .section-content :global(pre code) {
    background: none;
    padding: 0;
  }

  .section-content :global(h1),
  .section-content :global(h2),
  .section-content :global(h3),
  .section-content :global(h4) {
    margin-top: 1.5rem;
    margin-bottom: 0.5rem;
    color: #1a1a1a;
  }

  .section-content :global(a) {
    color: #646cff;
    text-decoration: none;
  }

  .section-content :global(a:hover) {
    text-decoration: underline;
  }

  .loading,
  .error {
    text-align: center;
    padding: 2rem;
    font-size: 1.2rem;
  }

  .error {
    color: #d32f2f;
  }

  .no-items {
    text-align: center;
    padding: 2rem;
    color: #666;
  }
</style>

