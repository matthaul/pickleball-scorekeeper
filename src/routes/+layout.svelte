<script lang="ts">
	import { onMount } from 'svelte';
	import favicon from '$lib/assets/favicon.svg';

	let { children } = $props();

	onMount(() => {
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
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

{@render children()}
