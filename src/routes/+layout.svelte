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
		padding: 1em 3em 0 3em;
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
		-webkit-mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32'%3E%3Crect x='0' y='0' width='4' height='4' rx='2' fill='white'/%3E%3Crect x='8' y='0' width='4' height='4' rx='2' fill='white'/%3E%3Crect x='16' y='0' width='4' height='4' rx='2' fill='white'/%3E%3Crect x='8' y='8' width='4' height='4' rx='2' fill='white'/%3E%3Crect x='24' y='8' width='4' height='4' rx='2' fill='white'/%3E%3Crect x='0' y='16' width='4' height='4' rx='2' fill='white'/%3E%3Crect x='16' y='16' width='4' height='4' rx='2' fill='white'/%3E%3Crect x='24' y='16' width='4' height='4' rx='2' fill='white'/%3E%3Crect x='8' y='24' width='4' height='4' rx='2' fill='white'/%3E%3Crect x='24' y='24' width='4' height='4' rx='2' fill='white'/%3E%3C/svg%3E");
		mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32'%3E%3Crect x='0' y='0' width='4' height='4' rx='2' fill='white'/%3E%3Crect x='8' y='0' width='4' height='4' rx='2' fill='white'/%3E%3Crect x='16' y='0' width='4' height='4' rx='2' fill='white'/%3E%3Crect x='8' y='8' width='4' height='4' rx='2' fill='white'/%3E%3Crect x='24' y='8' width='4' height='4' rx='2' fill='white'/%3E%3Crect x='0' y='16' width='4' height='4' rx='2' fill='white'/%3E%3Crect x='16' y='16' width='4' height='4' rx='2' fill='white'/%3E%3Crect x='24' y='16' width='4' height='4' rx='2' fill='white'/%3E%3Crect x='8' y='24' width='4' height='4' rx='2' fill='white'/%3E%3Crect x='24' y='24' width='4' height='4' rx='2' fill='white'/%3E%3C/svg%3E");
		-webkit-mask-size: 32px 32px;
		mask-size: 32px 32px;
		z-index: -1;
		pointer-events: none;
	}
</style>
