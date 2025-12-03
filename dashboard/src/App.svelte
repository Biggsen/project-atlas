<script lang="ts">
  import { onMount } from 'svelte';
  import type { ProjectSummary } from './types';
  import { loadProjectIndex } from './lib/api';
  import ProjectList from './lib/ProjectList.svelte';
  import ProjectView from './lib/ProjectView.svelte';

  let projects: ProjectSummary[] = [];
  let loading = true;
  let error: string | null = null;
  let selectedProjectId: string | null = null;

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
</script>

<main>
  <header>
    <h1>Project Atlas</h1>
    <p class="subtitle">Project Intelligence Dashboard</p>
  </header>

  {#if loading}
    <div class="loading">Loading projects...</div>
  {:else if error}
    <div class="error">Error: {error}</div>
  {:else if selectedProjectId}
    <ProjectView projectId={selectedProjectId} onBack={handleBack} />
  {:else}
    <ProjectList projects={projects} onSelect={handleProjectSelect} />
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
    margin-bottom: 3rem;
  }

  h1 {
    font-size: 2.5rem;
    margin: 0;
    color: #1a1a1a;
  }

  .subtitle {
    color: #666;
    margin-top: 0.5rem;
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
