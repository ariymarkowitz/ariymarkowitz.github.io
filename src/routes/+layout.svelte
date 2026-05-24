<script lang="ts">
	import favicon from '$lib/assets/favicon.svg';

	let { children } = $props();

	// 0–64. Number of cells (out of 64) filled in the 8x8 Bayer matrix.
	const ditherDensity = 9;

	const BAYER_8 = [
		[ 0, 32,  8, 40,  2, 34, 10, 42],
		[48, 16, 56, 24, 50, 18, 58, 26],
		[12, 44,  4, 36, 14, 46,  6, 38],
		[60, 28, 52, 20, 62, 30, 54, 22],
		[ 3, 35, 11, 43,  1, 33,  9, 41],
		[51, 19, 59, 27, 49, 17, 57, 25],
		[15, 47,  7, 39, 13, 45,  5, 37],
		[63, 31, 55, 23, 61, 29, 53, 21],
	];

	function ditherMask(density: number): string {
		const rects: string[] = [];
		for (let row = 0; row < 8; row++) {
			for (let col = 0; col < 8; col++) {
				if (BAYER_8[row][col] < density) {
					rects.push(`<rect x='${col * 2}' y='${row * 2}' width='2' height='2' fill='white'/>`);
				}
			}
		}
		const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='16' height='16'>${rects.join('')}</svg>`;
		return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
	}

	const ditherMaskUrl = ditherMask(ditherDensity);
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<link rel="preconnect" href="https://fonts.googleapis.com">
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous">
	<link href="https://fonts.googleapis.com/css2?family=Libertinus+Serif:ital,wght@0,400;0,600;0,700;1,400;1,600;1,700&display=swap" rel="stylesheet">
	{@html `<style>:root { --dither-mask: ${ditherMaskUrl}; }</style>`}
</svelte:head>

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
		--dither: rgb(222, 220, 218);
		--accent: rgb(30, 13, 98);
		--highlight: rgba(30, 13, 98, 0.4);
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
	}

	:global(body::before) {
		content: '';
		position: fixed;
		inset: 0;
		background-color: var(--dither);
		-webkit-mask-image: var(--dither-mask);
		mask-image: var(--dither-mask);
		-webkit-mask-size: 12px 12px;
		mask-size: 12px 12px;
		z-index: -1;
		pointer-events: none;
	}
</style>
