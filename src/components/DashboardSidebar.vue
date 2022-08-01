<template>
	<div class="tw-left-0 tw-z-0 tw-min-h-screen tw-bg-primaryColor tw-relative">
		<PanelMenu
			id="panel-menu"
			:routeName="routeName"
			:routePath="routePath"
			:model="items"
			class="tw-sticky tw-top-24 tw-z-0"
			ref="panelMenu"
		/>
	</div>
</template>

<script>
import PanelMenu from '@/components/primevueComponents/PanelMenu.vue';
import { ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { computed } from 'vue';
export default {
	name: 'DashboardSidebar',
	components: {
		PanelMenu,
	},
	setup() {
		const router = useRouter();
		const route = useRoute();
		const panelMenu = ref(); //this is for highlighting sidebar
		const routeName = computed(() => route.name);
		const routePath = computed(() => route.path);

		const items = ref([
			{
				label: 'Dashboard',
				iconImg: 'dashboard_white_24dp.svg',
				command: () => {
					router.push({ name: 'Dashboard' });
				},
			},
			{
				label: 'Datasets',
				iconImg: 'data.svg',
				command: () => {
					router.push({ name: 'DataSetList' });
				},
			},
			{
				label: 'String Matching',
				iconImg: 'competition.svg',
				items: [
					{
						label: 'Batch tasks',
						iconImg: 'clipboard.svg',
						command: () => {
							router.push({ name: 'BatchTaskList' });
						},
					},
					{
						label: 'Realtime tasks',
						iconImg: 'outline.svg',
						command: () => {
							router.push({ name: 'RealTimeTaskList' });
						},
					},
				],
			},
			{
				label: 'Setting',
				icon: 'pi pi-cog',
				command: () => {
					router.push({ name: 'Setting' });
				},
			},
			{
				label: 'Help',
				icon: 'pi pi-external-link',
				url: process.env.VUE_APP_DOCUMENTS_BASE_URL,
			},
		]);

		return {
			items,
			panelMenu,
			routeName,
			routePath,
		};
	},
};
</script>
