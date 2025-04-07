<script lang="ts">
	import '../app.css';

	let { children } = $props();
</script>

<div class="screen"></div>
{@render children()}


<style>
	.screen {
		@apply fixed -z-50;
		width: 100svw;
		height: 100svh;
		background: linear-gradient(
			150deg,
			#2b2e4a,
			#3e345e,
			#57386e,
			#723b78,
			#903c7a,
			#af3d73,
			#cd3f63,
			#e84545
		);
	}
</style>
