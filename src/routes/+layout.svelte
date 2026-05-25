<script lang="ts">
  import favicon from '$lib/assets/favicon.svg';
  import Dither from '$lib/Dither.svelte';
  import { BAYER_8, DITHER_CELL, DITHER_COLOR_CSS, DITHER_DENSITY } from '$lib/dither-pattern';

  let { children } = $props();

  function ditherMask(density: number): string {
    const rects: string[] = [];
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        if (BAYER_8[row][col] < density) {
          rects.push(`<rect x='${col}' y='${row}' width='1' height='1' fill='white'/>`);
        }
      }
    }
    const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='8' height='8'>${rects.join('')}</svg>`;
    return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
  }

  const ditherMaskUrl = ditherMask(DITHER_DENSITY);
  const ditherMaskSize = `${DITHER_CELL * 8}px`;
</script>

<svelte:head>
  <link rel="icon" href={favicon} />
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous">
  <link href="https://fonts.googleapis.com/css2?family=Libertinus+Serif:ital,wght@0,400;0,600;0,700;1,400;1,600;1,700&display=swap" rel="stylesheet">
  {@html `<style>:root { --dither: ${DITHER_COLOR_CSS}; --dither-mask: ${ditherMaskUrl}; --dither-mask-size: ${ditherMaskSize}; }</style>`}
</svelte:head>

<Dither />

<div class="layout">
  {@render children()}
</div>

<style>
  .layout {
    flex: 1;
    display: flex;
    flex-direction: column;
  }

  :global(:root) {
    --bg: rgb(255, 248, 232);
    --accent: rgb(30, 13, 98);
    --highlight: rgba(30, 13, 98, 0.4);
    --shading: rgba(107, 75, 0, 0.2);
  }

  :global(body) {
    margin: 0;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    background-color: var(--bg);
    overflow-x: hidden;
    padding: 1em 1em 0 2em;
    box-sizing: border-box;

    font-family: "Libertinus Serif", serif;
    font-size: 20px;
    font-weight: 200;
    line-height: 1.5;

    user-select: none;
    -webkit-user-select: none;
  }

  .layout {
    user-select: text;
    -webkit-user-select: text;
  }

  :global(body:not(.dither-active)::before) {
    content: '';
    position: fixed;
    inset: 0;
    background-color: var(--dither);
    -webkit-mask-image: var(--dither-mask);
    mask-image: var(--dither-mask);
    -webkit-mask-size: var(--dither-mask-size);
    mask-size: var(--dither-mask-size);
    z-index: -1;
    pointer-events: none;
  }
</style>
