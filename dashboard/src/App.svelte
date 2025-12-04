<script lang="ts">
  import { onMount } from 'svelte';
  import type { ProjectSummary } from './types';
  import { loadProjectIndex } from './lib/api';
  import ProjectList from './lib/ProjectList.svelte';
  import ProjectView from './lib/ProjectView.svelte';
  import Insights from './lib/Insights.svelte';

  let projects: ProjectSummary[] = [];
  let loading = true;
  let error: string | null = null;
  let selectedProjectId: string | null = null;
  let currentView: 'list' | 'insights' = 'list';

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
</script>

<main>
  <header>
    <h1 class="home-link" on:click={handleHome} role="button" tabindex="0" on:keydown={(e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        handleHome();
      }
    }}>Project Atlas</h1>
    <p class="subtitle">Project Intelligence Dashboard</p>
  </header>

  {#if loading}
    <div class="loading">Loading projects...</div>
  {:else if error}
    <div class="error">Error: {error}</div>
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

  header {
    text-align: center;
    margin-bottom: 2rem;
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

  .loading,
  .error {
    text-align: center;
    padding: 2rem;
    font-size: 1.2rem;
  }

  .error {
    color: #d32f2f;
  }
</style>
