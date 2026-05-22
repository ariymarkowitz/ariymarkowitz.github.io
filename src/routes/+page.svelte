<script lang="ts">
  const projects = [
    {
      title: "Quick Sets",
      description: "A web implementation of the game SET",
      url: "https://ariymarkowitz.github.io/quick-sets/",
      thumbnail: "/thumbnails/quicksets.png"
    },
    {
      title: "Ripple",
      description: "Abstract art",
      url: "https://ariymarkowitz.github.io/art/ripple/",
      thumbnail: "/thumbnails/ripple.png"
    },
    {
      title: "Voidpool",
      description: "Enter the void",
      url: "ariymarkowitz.github.io/art/voidpool/",
      thumbnail: "/thumbnails/voidpool.png"
    },
    {
      title: "Hyperbolic space visualiser",
      description: "Visualisation of isometry groups of hyperbolic space",
      url: "https://ariymarkowitz.github.io/H3-Visualiser/",
      thumbnail: "/thumbnails/h3.png"
    },
    {
      title: "Bruhat-Tits tree visualiser",
      description: "Visualisation of isometry groups of Bruhat-Tits trees",
      url: "https://ariymarkowitz.github.io/Bruhat-Tits-Tree-Visualiser/",
      thumbnail: "/thumbnails/btt.png"
    }
  ];
</script>

<h1 id="name" title="Ari Markowitz">Ari Markowitz</h1>
<hr />
<p>
  My name is Ari. I recently completed my PhD at the University of Auckland.
  I like maths, design, and programming. I make web apps and games sometimes.
</p>

<section class="projects">
  <h2>Projects</h2>
  <div class="grid">
    {#each projects as project}
      <a class="card" href={project.url} target="_blank" rel="noopener noreferrer">
        <div class="thumb-wrapper">
          <img class="thumb" src={project.thumbnail} alt={project.title} />
        </div>
        <span class="title">{project.title}</span>
        <p class="desc">{project.description}</p>
      </a>
    {/each}
  </div>
</section>

<style>
  #name {
    margin: 0;
    font-size: 40px;
    color: var(--accent);
  }

  hr {
    height: 2px;
    border: none;
    border-radius: 22px;
    background-color: var(--accent);
    margin: -18.5px -3em 30px -1px;
  }

  .projects h2 {
    font-size: 1.1em;
    font-weight: 600;
    color: var(--accent);
    margin: 1.5em 0 0.75em;
  }

  .grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, 200px);
    gap: 1.25em;
  }

  .card {
    display: block;
    text-decoration: none;
  }

  .thumb-wrapper {
    border: 2px solid var(--accent);
    border-radius: 4px;
    overflow: hidden;
    margin-bottom: 0.4em;
    transition: transform 0.2s ease, box-shadow 0.2s ease;
  }

  .card:hover .thumb-wrapper {
    transform: scale(1.05);
    box-shadow: 4px 4px 0 0 rgba(30, 13, 98, 0.4);
  }

  .card:hover .thumb {
    transform: scale(1.02);
  }

  .thumb {
    display: block;
    width: 100%;
    aspect-ratio: 16 / 9;
    object-fit: cover;

    transition: transform 0.3s ease;
  }

  .title {
    display: block;
    font-weight: 600;
    color: var(--accent);
  }

  .desc {
    margin: 0.2em 0 0;
    font-size: 0.85em;
    color: rgba(30, 13, 98, 0.8);
  }
</style>
