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
		overflow: hidden;
		padding: 3em;

		font-family: "Libertinus Serif", serif;
		font-size: 20px;
		font-weight: 200;
		line-height: 1.5;
	}
</style>
