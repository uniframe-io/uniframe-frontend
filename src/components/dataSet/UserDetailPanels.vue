<template>
	<div class="tw-container tw-flex tw-flex-col tw-gap-2 tw-p-8 tw-justify-center tw-shadow-sm">
		<div class="">
			<Panel header="Dataset Name">
				<span class="tw-flex tw-text-left">{{ props.name }}</span>
			</Panel>
		</div>
		<div class="">
			<Panel header="Dataset Description">
				<span class="tw-flex tw-text-left">{{ props.description }}</span>
			</Panel>
		</div>
	</div>
</template>

<script>
import Panel from 'primevue/panel';
export default {
	name: 'DataSetUserDetailPanels',
	components: {
		Panel,
	},
	props: {
		name: { type: String, required: true },
		description: { type: String, required: true },
	},
	setup(props) {
		return {
			props,
		};
	},
};
</script>

<style lang="scss" scoped></style>
