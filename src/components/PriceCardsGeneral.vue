<template>
	<div
		class="
			tw-relative tw-mt-5 tw-flex tw-flex-col tw-bg-white tw-shadow-md
			md:tw-w-5/12
			tw-w-11/12 tw-rounded-md tw-p-3
		"
	>
		<div class="price-card-type">
			<h4 class="h3-bold tw-p-5 tw-text-primaryColor">
				{{ type }}
			</h4>
		</div>
		<div class="price-card-intro tw-h-14">
			<p class="tw-px-5">
				{{ intro }}
			</p>
		</div>
		<div class="price-card-main tw-my-4">
			<h4 class="h4-bold tw-px-5">
				{{ main }}
			</h4>
		</div>
		<div class="price-card-description tw-h-4/6">
			<p v-for="(text, i) in description" :key="i" class="tw-px-5 tw-text-left tw-py-2">
				<i class="pi pi-check-circle tw-mr-2 tw-text-successColor"></i>
				<span>
					{{ text }}
				</span>
			</p>
		</div>
		<Button
			class="
				md:tw-w-1/2
				tw-w-4/5
				tw-mx-auto
				tw-h-12
				tw-my-5
				tw-rounded-full
				tw-bg-gradient-to-tr
				tw-from-primaryColor
				tw-to-secondaryColor
				tw-shadow-md
			"
			:label="btnText"
			@click="btnFunction"
			:disabled="btnDisabled"
		/>
	</div>
</template>

<script>
export default {
	props: {
		type: {
			type: String,
			default: 'Free',
		},
		intro: {
			type: String,
			require: true,
		},
		main: {
			type: String,
			require: true,
		},
		btnText: {
			type: String,
			require: true,
		},
		description: {
			type: Array,
			require: true,
		},
		btnFunction: {
			type: Function,
		},
		btnLink: {
			type: String,
		},
		btnDisabled: {
			type: Boolean,
			require: true,
		},
	},
};
</script>

<style lang="scss" scoped></style>
