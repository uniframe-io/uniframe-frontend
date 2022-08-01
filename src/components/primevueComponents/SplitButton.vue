<template>
	<div :class="containerClass" :style="style">
		<PVSButton
			v-bind="$attrs"
			label="Action"
			type="button"
			class="
				btn-primary-hollow
				tw-rounded-full tw-w-32 tw-text-base tw-flex tw-items-center tw-justify-center
			"
			icon="pi pi-chevron-down "
			iconPos="right"
			@click="onDropdownButtonClick"
			:disabled="$attrs.disabled"
			aria-haspopup="true"
			:aria-controls="ariaId + '_overlay'"
		/>
		<PVSMenu
			:id="ariaId + '_overlay'"
			ref="menu"
			:model="model"
			:popup="true"
			:autoZIndex="autoZIndex"
			:baseZIndex="baseZIndex"
			:appendTo="appendTo"
		/>
	</div>
</template>

<script>
import Button from 'primevue/button';
import Menu from 'primevue/menu';
import { UniqueComponentId } from 'primevue/utils';

export default {
	name: 'SplitButton',
	inheritAttrs: false,
	props: {
		label: {
			type: String,
			default: null,
		},
		icon: {
			type: String,
			default: null,
		},
		model: {
			type: Array,
			default: null,
		},
		autoZIndex: {
			type: Boolean,
			default: true,
		},
		baseZIndex: {
			type: Number,
			default: 0,
		},
		appendTo: {
			type: String,
			default: 'body',
		},
		class: null,
		style: null,
	},
	methods: {
		onDropdownButtonClick() {
			this.$refs.menu.toggle({ currentTarget: this.$el });
		},
		onDefaultButtonClick() {
			this.$refs.menu.hide();
		},
	},
	computed: {
		ariaId() {
			return UniqueComponentId();
		},
		containerClass() {
			return [this.class];
		},
	},
	components: {
		PVSButton: Button,
		PVSMenu: Menu,
	},
};
</script>
