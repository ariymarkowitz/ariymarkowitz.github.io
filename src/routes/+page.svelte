<script lang="ts">
  const tagColors: Record<string, string> = {
    Game: 'rgb(38, 95, 52)',
    Art:  'rgb(158, 88, 12)',
    Math: 'rgb(22, 78, 155)'
  };

  const projects = [
    {
      title: "Quick Sets",
      description: "A web implementation of the game SET",
      url: "https://ariymarkowitz.github.io/quick-sets/",
      thumbnail: "/thumbnails/quicksets.png",
      tag: "Game"
    },
    {
      title: "Apeirogon",
      description: "Mathematical art",
      url: "/images/apeirogon.jpg",
      thumbnail: "/thumbnails/apeirogon.png",
      tag: "Art"
    },
    {
      title: "Ripple",
      description: "Abstract interactive art",
      url: "https://ariymarkowitz.github.io/art/ripple/",
      thumbnail: "/thumbnails/ripple.png",
      tag: "Art"
    },
    {
      title: "Voidpool",
      description: "Enter the void",
      url: "https://ariymarkowitz.github.io/art/voidpool/",
      thumbnail: "/thumbnails/voidpool.png",
      tag: "Art"
    },
    {
      title: "Hyperbolic space visualiser",
      description: "Visualisation of isometry groups of hyperbolic space",
      url: "https://ariymarkowitz.github.io/H3-Visualiser/",
      thumbnail: "/thumbnails/h3.png",
      tag: "Maths"
    },
    {
      title: "Bruhat-Tits tree visualiser",
      description: "Visualisation of isometry groups of Bruhat-Tits trees",
      url: "https://ariymarkowitz.github.io/Bruhat-Tits-Tree-Visualiser/",
      thumbnail: "/thumbnails/btt.png",
      tag: "Maths"
    }
  ];
</script>

<div class="title-box">
  <h1 id="name" title="Ari Markowitz">Ari Markowitz</h1>
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
        <a class="card" href={project.url} target="_blank" rel="noopener noreferrer">
          <div class="thumb-wrapper">
            <img class="thumb" src={project.thumbnail} alt={project.title} />
          </div>
          <div class="card-title-row">
            <span class="title">{project.title}</span>
            <span class="tag" style="--tag-color: {tagColors[project.tag]}; background-color: {tagColors[project.tag]}">{project.tag}</span>
          </div>
          <p class="desc">{project.description}</p>
        </a>
      {/each}
    </div>
  </section>
</main>

<style>
  .title-box {
    padding: 0 0 0 2em;
  }

  #name {
    margin: 0 0 -0.4ex 0;
    font-size: clamp(22px, 7.5vw, 40px);
    color: var(--accent);
    line-height: 1;
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
  }

  .card {
    display: block;
    text-decoration: none;
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
