<template>
	<div class="tw-text-sm tw-w-full">
		<span v-if="helpGuideData[helpReference]" class="">
			{{ helpGuideData[helpReference].text }}
		</span>
		<span
			v-if="helpGuideData[helpReference]"
			class="tw-inline-block tw-mx-2 hover:tw-underline tw-text-primaryColor tw-cursor-pointer"
			:class="{ 'pi pi-external-link tw-text-sm hover:tw-no-underline': icon }"
			@click="openNewTab(helpGuideData[helpReference].link)"
			>{{ icon ? '' : `Learn more` }}</span
		>
	</div>
</template>

<script>
import { computed } from 'vue';
import { useStore } from 'vuex';
export default {
	name: 'HelpGuide',
	props: {
		helpReference: {
			type: String,
			default: 'defaultHelp',
		},
		icon: {
			type: Boolean,
			default: false,
		},
	},
	setup() {
		const store = useStore();
		function openNewTab(link) {
			const url = `${process.env.VUE_APP_DOCUMENTS_BASE_URL}${link}`;
			window.open(url);
			return url;
		}
		return {
			openNewTab,
			helpGuideData: computed(() => store.state.helpGuide.helpGuideData),
		};
	},
};
</script>
