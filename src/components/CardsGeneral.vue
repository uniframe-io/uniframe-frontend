<template>
	<div class="tw-relative tw-w-5/12 tw-mt-10">
		<div
			class="title tw-absolute"
			:class="{
				'tw-left-10 ': position === 'left',
				'tw-right-10': position === 'right',
			}"
		>
			<h4 class="h4-bold tw-pt-8 tw-px-8">
				{{ title }}
			</h4>
		</div>
		<div class="description">
			<p class="p-base tw-py-20 tw-px-16 tw-text-center">
				{{ description }}
			</p>
		</div>
	</div>
</template>

<script>
export default {
	props: {
		title: {
			type: String,
			default: '',
		},
		description: {
			type: String,
			default: '',
		},
		position: {
			type: String,
			default: '',
		},
	},
};
</script>

<style lang="scss" scoped></style>
