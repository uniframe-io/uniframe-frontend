<template>
	<div class="tw-relative h-screen-20 tw-overflow-hidden">
		<div
			class="
				tw-w-4/5
				h-screen--20
				tw-m-auto tw-flex tw-flex-col tw-gap-7 tw-items-center tw-justify-center
			"
		>
			<h1 class="h2-bold">Coming soon</h1>
			<p class="p-base tw-w-2/5 tw-max-w-xl tw-text-center">
				This page is under construction. Will available soon
			</p>
		</div>

		<div class="vertical-border card-border tw-absolute tw-top-5 tw-left-36"></div>
		<div
			class="
				horizontal-border
				card-border
				tw-absolute tw-transform tw-translate-x-10 tw-left-48 tw-bottom-10
			"
		></div>
	</div>
</template>
<script>
export default {
	name: 'Help',
};
</script>

<style lang="scss">
.vertical-border {
	height: 100%;
	width: 15rem;
}
.horizontal-border {
	width: 100%;
	height: 15rem;
}
</style>
