<script lang="ts">
  import { fade } from 'svelte/transition';
  import type { Project } from '$lib/projects';
  import { getProjectDetailsHtml } from '$lib/projectDetails';
    import { cubicOut } from 'svelte/easing';

  let { project, onClose }: { project: Project; onClose: () => void } = $props();

  let detailsHtml = $state<string | null>(null);
  $effect(() => {
    getProjectDetailsHtml(project.slug).then(html => { detailsHtml = html; });
  });

  function handleOverlayClick(e: MouseEvent) {
    if (e.target === e.currentTarget) onClose();
  }

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === 'Escape') onClose();
  }
</script>

<svelte:window onkeydown={handleKeydown} />

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div class="modal-overlay" onclick={handleOverlayClick} transition:fade={{ duration: 150, easing: cubicOut }}>
  <div class="modal" role="dialog" aria-modal="true" aria-label={project.title} tabindex="-1">
    <div class="modal-header">
      <h2 class="modal-title">{project.title}</h2>
      <button class="close-btn" onclick={onClose} aria-label="Close">&#x2715;</button>
    </div>
    <div class="modal-body">
      {#if detailsHtml}
        <div class="modal-details">{@html detailsHtml}</div>
      {:else if project.description}
        <p class="modal-desc">{project.description}</p>
      {/if}
    </div>
    <div class="modal-footer">
      <a
        href={project.url}
        target="_blank"
        rel="noopener noreferrer"
        class="visit-btn"
      >
        Visit &#x2192;
      </a>
    </div>
  </div>
</div>

<style>
  .modal-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.55);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 100;
    padding: 1em;
  }

  .modal {
    background: var(--bg);
    border: 2px solid var(--accent);
    border-radius: 4px;
    box-shadow: 6px 6px 0 var(--highlight);
    max-width: 520px;
    width: 100%;
    max-height: 80vh;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }

  .modal-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.75em 1.2em 0.6em;
    border-bottom: 1px solid rgba(107, 75, 0, 0.2);
    gap: 1em;
  }

  .modal-title {
    margin: 0;
    font-size: 1.1em;
    color: var(--accent);
    font-weight: 700;
  }

  .close-btn {
    background: none;
    border: none;
    cursor: pointer;
    font-size: 1.1em;
    color: var(--accent);
    padding: 0;
    line-height: 1;
    opacity: 0.7;
    flex-shrink: 0;
    font-family: inherit;
  }

  .close-btn:hover {
    opacity: 1;
  }

  .modal-body {
    padding: 1em 1.2em;
    overflow-y: auto;
    flex: 1;
  }

  .modal-desc {
    margin: 0;
    color: rgba(30, 13, 98, 0.85);
  }

  .modal-details {
    color: rgba(30, 13, 98, 0.85);
    line-height: 1.6;
  }

  .modal-details :global(p) {
    margin: 0 0 0.8em;
  }

  .modal-footer {
    padding: 0.7em 1.2em;
    border-top: 1px solid rgba(107, 75, 0, 0.2);
    display: flex;
    justify-content: flex-end;
  }

  .visit-btn {
    display: inline-block;
    padding: 0.35em 0.9em;
    background-color: var(--accent);
    color: var(--bg);
    text-decoration: none;
    font-weight: 600;
    font-size: 0.9em;
    border-radius: 2px;
    transition: opacity 0.15s ease;
  }

  .visit-btn:hover {
    opacity: 0.85;
  }

  :global(.katex) {
    font-size: 0.85em !important;
  }

  :global(.math-error) {
    color: red;
    font-family: monospace;
  }
</style>
