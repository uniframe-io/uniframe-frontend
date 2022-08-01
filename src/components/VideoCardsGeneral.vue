<template>
	<div class="tw-relative tw-w-full tw-mt-0 tw-flex tw-flex-col md:tw-flex-row">
		<div class="text-section md:tw-w-1/2 tw-w-full">
			<div
				class="title"
				:class="{
					'tw-left-10 ': position === 'left',
					'tw-right-10': position === 'right',
				}"
			>
				<h4 class="h4-bold tw-px-5 md:tw-px-8 tw-py-2">
					{{ title }}
				</h4>
			</div>
			<div class="description tw-mb-2">
				<div v-html="description" class="tw-px-5 md:tw-px-8 tw-text-left"></div>
			</div>
		</div>
		<div
			class="
				video-section
				md:tw-w-1/2
				tw-w-4/5
				tw-border-primaryColor
				tw-rounded
				tw-border-2
				tw-shadow-md
				tw-flex
				tw-justify-center
				tw-p-1
				tw-mx-auto
				tw-my-5
				md:tw-my-0
			"
		>
			<video autoplay muted loop preload="none">
				<source :src="require(`@/assets/videos/${videoSourceName}`)" type="video/mp4" />
			</video>
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
		videoSourceName: {
			type: String,
			default: 'step1-create-dataset.mp4',
		},
	},
};
</script>

<style lang="scss" scoped></style>
