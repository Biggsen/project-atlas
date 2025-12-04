<script lang="ts">
  import type { ProjectSummary } from '../types';
  import { calculateInsights, type Insights } from './insights';

  export let projects: ProjectSummary[];
  export let onSelectProject: (projectId: string) => void;

  $: insights = calculateInsights(projects);
</script>

<div class="insights">
  <h2>Cross-Project Insights</h2>

  <div class="aggregation-section">
    <h3>Overview</h3>
    <div class="aggregation-grid">
      <div class="stat-card">
        <div class="stat-value">{insights.aggregation.totalProjects}</div>
        <div class="stat-label">Total Projects</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">{insights.aggregation.totalWorkItems}</div>
        <div class="stat-label">Total Work Items</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">{insights.aggregation.completedWorkItems}</div>
        <div class="stat-label">Completed</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">{insights.aggregation.incompleteWorkItems}</div>
        <div class="stat-label">Incomplete</div>
      </div>
    </div>

    <div class="aggregation-details">
      <div class="detail-group">
        <h4>By Type</h4>
        <div class="detail-list">
          <div class="detail-item">
            <span class="detail-label">Features:</span>
            <span class="detail-value">{insights.aggregation.byType.features}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">Enhancements:</span>
            <span class="detail-value">{insights.aggregation.byType.enhancements}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">Bugs:</span>
            <span class="detail-value">{insights.aggregation.byType.bugs}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">Tasks:</span>
            <span class="detail-value">{insights.aggregation.byType.tasks}</span>
          </div>
        </div>
      </div>

      <div class="detail-group">
        <h4>By Status</h4>
        <div class="detail-list">
          <div class="detail-item">
            <span class="detail-label">Active:</span>
            <span class="detail-value">{insights.aggregation.byStatus.active}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">MVP:</span>
            <span class="detail-value">{insights.aggregation.byStatus.mvp}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">Paused:</span>
            <span class="detail-value">{insights.aggregation.byStatus.paused}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">Archived:</span>
            <span class="detail-value">{insights.aggregation.byStatus.archived}</span>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div class="insight-section">
    <h3>⚠️ Drift Detection</h3>
    <p class="insight-description">Active projects that haven't been updated in 20+ days</p>
    {#if insights.drift.length > 0}
      <div class="insight-list">
        {#each insights.drift as item}
          <div
            class="insight-item drift"
            on:click={() => onSelectProject(item.projectId)}
            on:keydown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                onSelectProject(item.projectId);
              }
            }}
            role="button"
            tabindex="0"
          >
            <div class="insight-item-header">
              <span class="insight-item-name">{item.name}</span>
              <span class="insight-item-badge">{item.daysSinceUpdate} days</span>
            </div>
          </div>
        {/each}
      </div>
    {:else}
      <div class="no-insights">No drift detected. All active projects are up to date!</div>
    {/if}
  </div>

  <div class="insight-section">
    <h3>🎯 Quick Wins</h3>
    <p class="insight-description">Projects with few incomplete items (≤5) and good progress (≥50%)</p>
    {#if insights.quickWins.length > 0}
      <div class="insight-list">
        {#each insights.quickWins as item}
          <div
            class="insight-item quick-win"
            on:click={() => onSelectProject(item.projectId)}
            on:keydown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                onSelectProject(item.projectId);
              }
            }}
            role="button"
            tabindex="0"
          >
            <div class="insight-item-header">
              <span class="insight-item-name">{item.name}</span>
              <span class="insight-item-badge">{item.incompleteCount} remaining</span>
            </div>
            <div class="insight-item-meta">{item.completionPercentage}% complete</div>
          </div>
        {/each}
      </div>
    {:else}
      <div class="no-insights">No quick wins identified at this time.</div>
    {/if}
  </div>

  <div class="insight-section">
    <h3>🚨 High-Risk Zones</h3>
    <p class="insight-description">Projects with many bugs (≥3) and low completion (&lt;70%)</p>
    {#if insights.highRisk.length > 0}
      <div class="insight-list">
        {#each insights.highRisk as item}
          <div
            class="insight-item high-risk"
            on:click={() => onSelectProject(item.projectId)}
            on:keydown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                onSelectProject(item.projectId);
              }
            }}
            role="button"
            tabindex="0"
          >
            <div class="insight-item-header">
              <span class="insight-item-name">{item.name}</span>
              <span class="insight-item-badge">{item.bugCount} bugs</span>
            </div>
            <div class="insight-item-meta">{item.completionPercentage}% complete • {item.totalWorkItems} total items</div>
          </div>
        {/each}
      </div>
    {:else}
      <div class="no-insights">No high-risk projects identified. Great job!</div>
    {/if}
  </div>

  <div class="insight-section">
    <h3>🚀 Release Ready</h3>
    <p class="insight-description">Projects with high completion (≥80%) and few bugs (&lt;3)</p>
    {#if insights.releaseReady.length > 0}
      <div class="insight-list">
        {#each insights.releaseReady as item}
          <div
            class="insight-item release-ready"
            on:click={() => onSelectProject(item.projectId)}
            on:keydown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                onSelectProject(item.projectId);
              }
            }}
            role="button"
            tabindex="0"
          >
            <div class="insight-item-header">
              <span class="insight-item-name">{item.name}</span>
              <span class="insight-item-badge">{item.completionPercentage}%</span>
            </div>
            <div class="insight-item-meta">{item.bugCount} bugs • {item.totalWorkItems} total items</div>
          </div>
        {/each}
      </div>
    {:else}
      <div class="no-insights">No projects are currently release-ready.</div>
    {/if}
  </div>
</div>

<style>
  .insights {
    width: 100%;
  }

  .insights > h2 {
    font-size: 2rem;
    margin: 0 0 2rem 0;
    color: #1a1a1a;
  }

  .aggregation-section {
    background: #f5f5f5;
    border-radius: 8px;
    padding: 1.5rem;
    margin-bottom: 2rem;
  }

  .aggregation-section h3 {
    font-size: 1.25rem;
    margin: 0 0 1rem 0;
    color: #1a1a1a;
  }

  .aggregation-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 1rem;
    margin-bottom: 1.5rem;
  }

  @media (max-width: 768px) {
    .aggregation-grid {
      grid-template-columns: repeat(2, 1fr);
    }

    .aggregation-details {
      grid-template-columns: 1fr;
      gap: 1.5rem;
    }

    .insight-section {
      margin-bottom: 2rem;
    }

    .insight-section h3 {
      font-size: 1.25rem;
    }
  }

  .stat-card {
    background: white;
    border-radius: 8px;
    padding: 1rem;
    text-align: center;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  .stat-value {
    font-size: 2rem;
    font-weight: 600;
    color: #1a1a1a;
    margin-bottom: 0.25rem;
  }

  .stat-label {
    font-size: 0.875rem;
    color: #666;
  }

  .aggregation-details {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 2rem;
  }

  .detail-group h4 {
    font-size: 1rem;
    margin: 0 0 0.75rem 0;
    color: #1a1a1a;
  }

  .detail-list {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .detail-item {
    display: flex;
    justify-content: space-between;
    padding: 0.5rem;
    background: white;
    border-radius: 4px;
  }

  .detail-label {
    color: #666;
    font-size: 0.875rem;
  }

  .detail-value {
    font-weight: 600;
    color: #1a1a1a;
    font-size: 0.875rem;
  }

  .insight-section {
    margin-bottom: 2.5rem;
  }

  .insight-section h3 {
    font-size: 1.5rem;
    margin: 0 0 0.5rem 0;
    color: #1a1a1a;
  }

  .insight-description {
    color: #666;
    font-size: 0.875rem;
    margin: 0 0 1rem 0;
  }

  .insight-list {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .insight-item {
    background: white;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    padding: 1rem;
    cursor: pointer;
    transition: all 0.2s;
  }

  .insight-item:hover {
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    transform: translateY(-2px);
  }

  .insight-item:focus {
    outline: 2px solid #646cff;
    outline-offset: 2px;
  }

  .insight-item.drift {
    border-left: 4px solid #ff9800;
  }

  .insight-item.quick-win {
    border-left: 4px solid #4caf50;
  }

  .insight-item.high-risk {
    border-left: 4px solid #f44336;
  }

  .insight-item.release-ready {
    border-left: 4px solid #2196f3;
  }

  .insight-item-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.5rem;
  }

  .insight-item-name {
    font-weight: 600;
    color: #1a1a1a;
    font-size: 1rem;
  }

  .insight-item-badge {
    padding: 0.25rem 0.75rem;
    border-radius: 12px;
    font-size: 0.75rem;
    font-weight: 500;
    background: #f5f5f5;
    color: #666;
  }

  .insight-item.drift .insight-item-badge {
    background: #fff3cd;
    color: #856404;
  }

  .insight-item.quick-win .insight-item-badge {
    background: #e8f5e9;
    color: #2e7d32;
  }

  .insight-item.high-risk .insight-item-badge {
    background: #ffebee;
    color: #c62828;
  }

  .insight-item.release-ready .insight-item-badge {
    background: #e3f2fd;
    color: #1565c0;
  }

  .insight-item-meta {
    font-size: 0.875rem;
    color: #666;
  }

  .no-insights {
    padding: 2rem;
    text-align: center;
    color: #999;
    background: #f5f5f5;
    border-radius: 8px;
    font-style: italic;
  }
</style>

