<script lang="ts">
  import { onMount } from 'svelte';
  import type { ProjectSummary } from './types';
  import { loadProjectIndex } from './lib/api';
  import { exportAllProjects } from './lib/export';
  import ProjectList from './lib/ProjectList.svelte';
  import ProjectView from './lib/ProjectView.svelte';
  import Insights from './lib/Insights.svelte';

  let projects: ProjectSummary[] = [];
  let loading = true;
  let error: string | null = null;
  let selectedProjectId: string | null = null;
  let currentView: 'list' | 'insights' = 'list';
  let exporting = false;

  onMount(async () => {
    try {
      projects = await loadProjectIndex();
      loading = false;
    } catch (e) {
      error = e instanceof Error ? e.message : 'Failed to load projects';
      loading = false;
    }
  });

  function handleProjectSelect(projectId: string) {
    selectedProjectId = projectId;
  }

  function handleBack() {
    selectedProjectId = null;
  }

  function handleViewChange(view: 'list' | 'insights') {
    currentView = view;
    selectedProjectId = null;
  }

  function handleHome() {
    selectedProjectId = null;
    currentView = 'list';
  }

  async function handleExport() {
    if (projects.length === 0) return;
    exporting = true;
    try {
      await exportAllProjects(projects);
    } catch (e) {
      console.error('Export failed:', e);
      alert('Failed to export projects. Please try again.');
    } finally {
      exporting = false;
    }
  }
</script>

<main>
  <header>
    <div class="header-content">
      <div>
        <h1 class="home-link" on:click={handleHome} role="button" tabindex="0" on:keydown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            handleHome();
          }
        }}>Project Atlas</h1>
        <p class="subtitle">Project Intelligence Dashboard</p>
      </div>
      {#if !loading && !error && projects.length > 0}
        <button
          class="export-button"
          on:click={handleExport}
          disabled={exporting}
          title="Export all projects to markdown"
        >
          {exporting ? 'Exporting...' : '📥 Export All'}
        </button>
      {/if}
    </div>
  </header>

  {#if loading}
    <div class="loading">
      <div class="spinner"></div>
      <p>Loading projects...</p>
    </div>
  {:else if error}
    <div class="error">
      <h2>⚠️ Failed to Load Projects</h2>
      <p>{error}</p>
      <p class="error-hint">Make sure the aggregator has been run and data files exist in <code>data/projects/</code></p>
    </div>
  {:else if selectedProjectId}
    <ProjectView projectId={selectedProjectId} onBack={handleBack} />
  {:else}
    <nav class="view-nav">
      <button
        class="nav-button"
        class:active={currentView === 'list'}
        on:click={() => handleViewChange('list')}
      >
        Projects
      </button>
      <button
        class="nav-button"
        class:active={currentView === 'insights'}
        on:click={() => handleViewChange('insights')}
      >
        Insights
      </button>
    </nav>

    {#if currentView === 'list'}
      <ProjectList projects={projects} onSelect={handleProjectSelect} />
    {:else if currentView === 'insights'}
      <Insights projects={projects} onSelectProject={handleProjectSelect} />
    {/if}
  {/if}
</main>

<style>
  main {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem;
  }

  @media (max-width: 768px) {
    main {
      padding: 1rem;
    }

    h1 {
      font-size: 2rem;
    }

    .view-nav {
      flex-wrap: wrap;
    }

    .nav-button {
      padding: 0.5rem 1rem;
      font-size: 0.875rem;
    }
  }

  header {
    margin-bottom: 2rem;
  }

  .header-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 1rem;
  }

  .header-content > div {
    text-align: center;
    flex: 1;
    min-width: 200px;
  }

  .export-button {
    background: #646cff;
    color: white;
    border: none;
    padding: 0.75rem 1.5rem;
    border-radius: 6px;
    font-size: 1rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
    white-space: nowrap;
  }

  .export-button:hover:not(:disabled) {
    background: #535bf2;
    transform: translateY(-1px);
    box-shadow: 0 2px 8px rgba(100, 108, 255, 0.3);
  }

  .export-button:active:not(:disabled) {
    transform: translateY(0);
  }

  .export-button:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  @media (max-width: 768px) {
    .header-content {
      flex-direction: column;
    }

    .header-content > div {
      text-align: center;
    }

    .export-button {
      width: 100%;
    }
  }

  h1 {
    font-size: 2.5rem;
    margin: 0;
    color: #1a1a1a;
  }

  .home-link {
    cursor: pointer;
    transition: color 0.2s;
  }

  .home-link:hover {
    color: #646cff;
  }

  .home-link:focus {
    outline: 2px solid #646cff;
    outline-offset: 4px;
    border-radius: 4px;
  }

  .subtitle {
    color: #666;
    margin-top: 0.5rem;
  }

  .view-nav {
    display: flex;
    gap: 0.5rem;
    margin-bottom: 2rem;
    border-bottom: 2px solid #e0e0e0;
  }

  .nav-button {
    background: none;
    border: none;
    padding: 0.75rem 1.5rem;
    font-size: 1rem;
    font-weight: 500;
    color: #666;
    cursor: pointer;
    border-bottom: 2px solid transparent;
    margin-bottom: -2px;
    transition: all 0.2s;
  }

  .nav-button:hover {
    color: #1a1a1a;
    background: #f5f5f5;
  }

  .nav-button.active {
    color: #646cff;
    border-bottom-color: #646cff;
  }

  .loading {
    text-align: center;
    padding: 4rem 2rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
  }

  .spinner {
    width: 40px;
    height: 40px;
    border: 4px solid #e0e0e0;
    border-top-color: #646cff;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }

  .loading p {
    color: #666;
    font-size: 1.1rem;
    margin: 0;
  }

  .error {
    text-align: center;
    padding: 3rem 2rem;
    max-width: 600px;
    margin: 0 auto;
    background: #ffebee;
    border: 1px solid #ffcdd2;
    border-radius: 8px;
  }

  .error h2 {
    color: #c62828;
    margin: 0 0 1rem 0;
    font-size: 1.5rem;
  }

  .error p {
    color: #d32f2f;
    margin: 0.5rem 0;
    font-size: 1rem;
  }

  .error-hint {
    color: #666 !important;
    font-size: 0.875rem !important;
    margin-top: 1rem !important;
  }

  .error code {
    background: #f5f5f5;
    padding: 0.125rem 0.375rem;
    border-radius: 3px;
    font-family: 'Courier New', monospace;
    font-size: 0.9em;
  }
</style>
