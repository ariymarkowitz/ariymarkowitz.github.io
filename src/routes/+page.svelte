<script lang="ts">
  import { projects, type Project } from '$lib/projects';
  import ProjectCard from '$lib/ProjectCard.svelte';
  import ProjectModal from '$lib/ProjectModal.svelte';

  let selectedProject: Project | null = $state(null);

  function openModal(project: Project) {
    selectedProject = project;
  }

  function closeModal() {
    selectedProject = null;
  }
</script>

<div class="title-box">
  <h1 id="name" title="Ari Markowitz">Ari Markowitz</h1>
  <div class="social-links">
    <a href="https://github.com/ariymarkowitz" target="_blank" rel="noopener noreferrer">
      <span class="icon github-icon"></span>
      <span class="label">GitHub</span>
    </a>
    <span class="separator"></span>
    <a href="https://www.linkedin.com/in/ari-markowitz/" target="_blank" rel="noopener noreferrer">
      <span class="icon linkedin-icon"></span>
      <span class="label">LinkedIn</span>
    </a>
    <span class="separator"></span>
    <a href="mailto:ariymarkowitz@gmail.com">
      <span class="icon email-icon"></span>
      <span class="label">Email</span>
    </a>
  </div>
</div>
<main class="frame">
  <p>
    Hi, I'm Ari. I recently completed my PhD at the University of Auckland.
    I am currently located in Melbourne, Australia.
    I like maths, design, and programming. I make web apps and games sometimes.
  </p>
  <p>
    I am currently looking for a job. If you want to hire someone who is good at
    solving challenging problems, writes clean code, and has a passion for learning,
    please <a href="mailto:ariymarkowitz@gmail.com">send me a message</a>!
  </p>

  <section class="projects">
    <div class="grid">
      {#each projects as project}
        <ProjectCard {project} onInfoClick={() => openModal(project)} />
      {/each}
    </div>
  </section>
</main>

{#if selectedProject}
  <ProjectModal project={selectedProject} onClose={closeModal} />
{/if}

<style>
  .title-box {
    margin: 0 2em;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    align-items: baseline;
    column-gap: 1em;
    row-gap: 6px;
    container-type: inline-size;
  }

  #name {
    margin: 0 0 -0.4ex 0;
    font-size: clamp(22px, 15cqw, 40px);
    color: var(--accent);
    line-height: 1;
    flex-grow: 1;
  }

  .social-links {
    display: flex;
    align-items: center;
    gap: 0.3em;
    transition: opacity 0.1s ease;
    min-width: 0;
  }

  .social-links a {
    display: flex;
    align-items: center;
    gap: 0.3em;
    color: var(--accent);
    text-decoration: none;
    opacity: 0.8;
  }

  .social-links a:hover {
    opacity: 1;
  }

  @media (max-width: 430px) {
    .label {
      display: none;
    }
  }

  .separator {
    position: relative;
    flex-shrink: 1;
    width: 1em;
    height: 1.2em;
  }

  .separator::after {
    content: '';
    position: absolute;
    left: 50%;
    top: 0;
    width: 1px;
    height: 100%;
    background-color: var(--accent);
    opacity: 0.4;
  }

  .icon {
    display: inline-block;
    width: 1.1em;
    height: 1.1em;
    background-color: currentColor;
    mask-size: contain;
    mask-repeat: no-repeat;
    mask-position: center;
    flex-shrink: 0;
  }

  .github-icon {
    mask-image: url('../lib/assets/github.svg');
  }

  .linkedin-icon {
    mask-image: url('../lib/assets/linkedin.svg');
  }

  .email-icon {
    mask-image: url('../lib/assets/mail.svg');
  }

  .frame {
    flex: 1;
    position: relative;
    background-color: var(--bg);
    border-top: 2px solid var(--accent);
    border-right: 2px solid var(--accent);
    border-left: 1px solid rgba(107, 75, 0, 0.2);
    border-bottom: 1px solid rgba(0, 0, 0, 0.6);
    border-radius: 2px;
    margin: 6px 0 3em 0;
    padding: calc(6px + 0.5em) 2em 3em 2em;
    box-shadow: 4px 4px 0 var(--highlight);
  }

  .frame::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 6px;
    background-image: repeating-linear-gradient(
      -45deg,
      var(--accent) 0,
      var(--accent) 3px,
      var(--bg) 3px,
      var(--bg) 6px
    );
    background-size: 8.4853px 8.4853px;
    background-position: left top;
    pointer-events: none;
  }

  .projects {
    margin-top: 2em;
  }

  .grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 1.25em;
    align-items: start;
  }
</style>
