<script lang="ts">
  import type { Project } from '$lib/projects';
  import { tagColors } from '$lib/projects';
  import { hasProjectDetails } from '$lib/projectDetails';

  let { project, onInfoClick }: { project: Project; onInfoClick: () => void } = $props();

  function handleInfoClick(e: MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    onInfoClick();
  }
</script>

<a class="card" href={project.url} target="_blank" rel="noopener noreferrer">
  <div class="thumb-wrapper">
    <img class="thumb" src={project.thumbnail} alt={project.title} />
    {#if hasProjectDetails(project.slug)}
      <button
        class="info-btn"
        type="button"
        aria-label="More information about {project.title}"
        onclick={handleInfoClick}
      ><span class="info-icon"></span></button>
    {/if}
    {#if project.seizureWarning}
      <span class="seizure-bar">
        <span class="seizure-icon"></span>
        Seizure warning
      </span>
    {/if}
  </div>
  <div class="card-title-row">
    <span class="title">{project.title}</span>
    <span class="tag" style="--tag-color: {tagColors[project.tag]}; background-color: {tagColors[project.tag]}">{project.tag}</span>
  </div>
  {#if project.description}
    <p class="desc">{project.description}</p>
  {/if}
</a>

<style>
  .card {
    display: block;
    text-decoration: none;
    background: none;
    border: none;
    padding: 0;
    cursor: pointer;
    text-align: left;
    font-family: inherit;
    font-size: inherit;
    color: inherit;
    width: 100%;
  }

  .thumb-wrapper {
    position: relative;
    border: 2px solid var(--accent);
    border-radius: 4px;
    overflow: hidden;
    margin-bottom: 0.4em;
    aspect-ratio: 16 / 9;
    transition: transform 0.2s ease, box-shadow 0.2s ease;
  }

  .card-title-row {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: 0.5em;
  }

  .tag {
    flex-shrink: 0;
    background-color: var(--accent);
    color: var(--bg);
    font-size: 0.65em;
    font-weight: 600;
    padding: 0.15em 0.5em;
    border-radius: 2px;
    position: relative;
    top: -0.1em;
  }

  .card:hover .thumb-wrapper {
    transform: scale(1.05);
    box-shadow: 4px 4px 0 0 var(--highlight);
  }

  .card:hover .thumb {
    transform: scale(1.02);
  }

  .thumb {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
    transition: transform 0.3s ease;
  }

  .title {
    display: flex;
    font-weight: 600;
    color: var(--accent);
  }

  .desc {
    margin: 0.2em 0 0;
    font-size: 0.85em;
    color: rgba(30, 13, 98, 0.8);
  }

  .info-btn {
    position: absolute;
    top: 0.4em;
    right: 0.4em;
    width: 2.1em;
    height: 2.1em;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--bg);
    border: none;
    border-radius: 50%;
    cursor: pointer;
    padding: 0;
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  .info-icon {
    display: block;
    width: 2em;
    height: 2em;
    background-color: var(--accent);
    mask-image: url('./assets/info.svg');
    mask-size: contain;
    mask-repeat: no-repeat;
    mask-position: center;
  }

  .card:hover .info-btn,
  .info-btn:focus-visible {
    opacity: 0.7;
  }

  .card:hover .info-btn:hover {
    opacity: 1;
  }

  @media (hover: none) {
    .info-btn {
      opacity: 1;
    }
  }

  .seizure-bar {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.4em;
    background: rgba(116, 0, 0, 0.92);
    color: var(--bg);
    font-size: 0.75em;
    font-weight: 400;
    padding: 0.3em 0.6em;
    pointer-events: none;
    opacity: 0;
    transition: opacity 0.08s ease;
  }

  .seizure-icon {
    display: inline-block;
    width: 1.1em;
    height: 1.1em;
    flex-shrink: 0;
    background-color: currentColor;
    mask-image: url('./assets/warning.svg');
    mask-size: contain;
    mask-repeat: no-repeat;
    mask-position: center;
  }

  .card:hover .seizure-bar {
    opacity: 1;
  }
</style>
