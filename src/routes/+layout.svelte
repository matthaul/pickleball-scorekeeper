<script lang="ts">
	import '../app.css';
	import { onMount } from 'svelte';
	import favicon from '$lib/assets/favicon.svg';
	import { toolbarStore } from '$lib/stores/toolbarStore';
    import { fly } from 'svelte/transition';

	let { children } = $props();
	let mounted = false;

	onMount(() => {
		mounted = true;
		// Block edge swipe gestures for back/forward navigation
		let startX = 0;
		let startY = 0;
		const edgeThreshold = 50; // pixels from edge

		const handleTouchStart = (e: TouchEvent) => {
			startX = e.touches[0].pageX;
			startY = e.touches[0].pageY;
		};

		const handleTouchMove = (e: TouchEvent) => {
			const currentX = e.touches[0].pageX;
			const currentY = e.touches[0].pageY;
			const diffX = currentX - startX;
			const diffY = currentY - startY;

			// Check if it's a horizontal swipe
			const isHorizontalSwipe = Math.abs(diffX) > Math.abs(diffY);

			// Check if starting from edge
			const isFromLeftEdge = startX < edgeThreshold;
			const isFromRightEdge = startX > window.innerWidth - edgeThreshold;

			// If horizontal swipe from edge, prevent it
			if (isHorizontalSwipe && (isFromLeftEdge || isFromRightEdge)) {
				e.preventDefault();
			}
		};

		// Add event listeners with passive: false to allow preventDefault
		document.addEventListener('touchstart', handleTouchStart, { passive: false });
		document.addEventListener('touchmove', handleTouchMove, { passive: false });

		// Cleanup on unmount
		return () => {
			document.removeEventListener('touchstart', handleTouchStart);
			document.removeEventListener('touchmove', handleTouchMove);
		};
	});

	function handleMenuItemClick(item: { action?: () => void }) {
		if (item.action) {
			item.action();
		}
		toolbarStore.closeMenu();
	}
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<div class="banner">
	<h1>Score Keeper</h1>
</div>

<div class="app-container">
	{@render children()}
</div>




<!-- Menu overlay (covers everything including toolbar) -->
{#if $toolbarStore.menuOpen}
	<div class="menu-overlay" onclick={() => toolbarStore.closeMenu()}></div>
	<div class="menu">
		{#each $toolbarStore.menuItems as item}
			{#if item.href}
				<a href={item.href} onclick={() => toolbarStore.closeMenu()}>{item.label}</a>
			{:else}
				<button onclick={() => handleMenuItemClick(item)}>{item.label}</button>
			{/if}
		{/each}
	</div>
{/if}

<!-- Toolbar -->
<div class="toolbar">
	{#if $toolbarStore.leftButton && !$toolbarStore.menuOpen}
		<button class="btn-toolbar" onclick={$toolbarStore.leftButton.action}>
			{$toolbarStore.leftButton.label}
		</button>
	{:else}
		<div class="toolbar-spacer"></div>
	{/if}

	{#if $toolbarStore.cancelButton && !$toolbarStore.menuOpen}
		<button class="btn-toolbar btn-cancel" onclick={$toolbarStore.cancelButton.action}>
			{$toolbarStore.cancelButton.label}
		</button>
	{/if}

	<button class="btn-toolbar btn-menu" onclick={() => toolbarStore.toggleMenu()}>
		<span class="menu-icon" class:open={$toolbarStore.menuOpen}>
		<!-- These 3 spans make the hamburger menu-->
			<span></span>
			<span></span>
			<span></span>
		</span>
	</button>
</div>

<style>
	.app-container {
		padding-top: var(--header-height);
		padding-bottom: var(--toolbar-height);
		min-height: 100%;
	}

	.toolbar {
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		height: var(--toolbar-height);
		display: flex;
		align-items: stretch;
		gap: 0.5rem;
		padding: var(--toolbar-padding);
		background-color: var(--bg-dark);
		border-top: 1px solid var(--border);
		z-index: 200;
		box-sizing: border-box;
	}

	.btn-toolbar {
		background-color: var(--secondary);
		color: var(--text-light);
		border: none;
		border-radius: 4px;
		padding: 0 1rem;
		font-size: 1.25rem;
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.btn-toolbar:active {
		opacity: 0.8;
	}

	.toolbar-spacer {
		flex: 1;
	}

	.btn-toolbar:first-child {
		flex: 1;
	}

	.btn-cancel {
		flex-shrink: 0;
		padding: 0 1rem;
	}

	.btn-menu {
		flex-shrink: 0;
		width: 43px;
		height: 43px;
		align-self: center;
		padding: 0;
	}

	/* Hamburger icon */
	.menu-icon {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		width: 18px;
		height: 18px;
		gap: 5px;
	}

	.menu-icon span {
		display: block;
		width: 18px;
		height: 3px;
		background-color: var(--text-light);
		border-radius: 2px;
		transition: all 0.3s ease;
	}

	/* X animation */
	.menu-icon.open span:nth-child(1) {
		transform: rotate(45deg) translate(5px, 6px);
	}

	.menu-icon.open span:nth-child(2) {
		opacity: 0;
	}

	.menu-icon.open span:nth-child(3) {
		transform: rotate(-45deg) translate(5px, -6px);
	}

	.menu-overlay {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: rgba(0, 0, 0, 0.5);
		z-index: 150;
	}

	.menu {
		position: fixed;
		bottom: var(--toolbar-height);
		left: 0;
		right: 0;
		background-color: var(--bg-dark);
		display: flex;
		flex-direction: column;
		z-index: 250;
	}

	.menu a,
	.menu button {
		padding: 1rem;
		background-color: var(--bg-dark);
		color: var(--text-light);
		text-decoration: none;
		text-align: left;
		border: none;
		border-bottom: 1px solid var(--border-dark);
		font-size: 1rem;
		font-family: var(--font-body);
		cursor: pointer;
	}

	.menu a:hover,
	.menu button:hover {
		background-color: var(--border-dark);
	}
</style>
