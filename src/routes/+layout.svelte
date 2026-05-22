<script lang="ts">
	import favicon from '$lib/assets/favicon.svg';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<link rel="preconnect" href="https://fonts.googleapis.com">
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous">
	<link href="https://fonts.googleapis.com/css2?family=Libertinus+Serif:ital,wght@0,400;0,600;0,700;1,400;1,600;1,700&display=swap" rel="stylesheet">
</svelte:head>

<div class="layout">
	{@render children()}
</div>

<style>
	:global(:root) {
		--bg: rgb(255, 248, 232);
		--accent: rgb(30, 13, 98);
	}

	:global(body) {
		margin: 0;
		min-height: 100vh;
		background-color: var(--bg);
		/* background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='48' height='48' viewBox='0 0 48 48'><g fill='rgb(30,13,98)' fill-opacity='0.18'><path d='M24 22 L26 24 L24 26 L22 24 Z'/><path d='M0 -2 L2 0 L0 2 L-2 0 Z'/><path d='M48 -2 L50 0 L48 2 L46 0 Z'/><path d='M0 46 L2 48 L0 50 L-2 48 Z'/><path d='M48 46 L50 48 L48 50 L46 48 Z'/></g></svg>");
		background-size: 48px 48px; */
		overflow-x: hidden;
		padding: 1em 3em 0 3em;
		box-sizing: border-box;

		font-family: "Libertinus Serif", serif;
		font-size: 20px;
		font-weight: 200;
		line-height: 1.5;
	}
</style>
