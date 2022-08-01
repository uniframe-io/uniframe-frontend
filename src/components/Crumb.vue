<template>
	<Breadcrumb id="bread-crumb" :home="home" :model="items" class="tw-sticky tw-top-20 tw-z-10" />
</template>

<script>
import { useRoute } from 'vue-router';
import { ref, watch, computed } from 'vue';
import Breadcrumb from 'primevue/breadcrumb';

import capitalize from '@/helpers/capitalize.ts';

export default {
	name: 'BatchTaskLayout',
	components: { Breadcrumb },
	props: ['crumbDataSethName', 'crumbBatchName'],
	setup(props) {
		const route = useRoute();
		const items = ref([]);
		const home = ref({
			label: 'Home',
			to: { name: 'Home' },
		});
		// TODO: enhance this function
		//returning path regarding each breadCrumb
		function getPathNameFromPath(pathStr, pathArr) {
			const pathId = parseInt(pathStr);
			if (pathStr === 'Dashboard') return 'Dashboard';
			if (pathStr === 'Datasets') return 'DataSetList';
			if (pathStr === 'Batch Task') return 'BatchTaskList';
			if (pathStr === 'Real Time Task') return 'RealTimeTaskList';
			if (pathStr === 'Create') {
				if (pathArr.includes('Batch')) return 'BatchTaskCreate';
				if (pathArr.includes('Real')) return 'RealTimeTaskCreate';
				if (pathArr.includes('Datasets')) return 'CreateDataSet';
			}
			if (!isNaN(pathId)) {
				if (pathArr.includes('Datasets')) return 'GetDetailDataSet';
				if (pathArr.includes('Batch Task')) return 'GetDetailBatchTask';
				if (pathArr.includes('Real Time Task')) return 'GetDetailRealTime';
			}
		}

		//In this function I am generating bread crumb text from the browser path
		function generateCrumbItemsFromPath() {
			items.value = [];
			const pathArr = route.fullPath.toLowerCase().split('/');
			const generatePathArr = pathArr.map((path) => {
				if (path.includes('-')) {
					let pathWithHyphen = path.split('-');
					pathWithHyphen = pathWithHyphen.map((str) => {
						if (str === 'nm') return; //I am skipping "nm"
						return capitalize(str);
					});
					return pathWithHyphen.join(' ').substring(1); //skipping first space in string
				}
				return capitalize(path);
			});

			generatePathArr.forEach((item, _, pathArr) => {
				const pathName = getPathNameFromPath(item, pathArr);
				// TODO:investigate the delay of changing bread crumb
				if (item !== '') {
					items.value.push({
						//returning name from ID for dataset and task
						label: computed(() => {
							if (!isNaN(item) && !pathArr.includes('Datasets') && props.crumbBatchName)
								return props.crumbBatchName;
							if (!isNaN(item) && pathArr.includes('Datasets') && props.crumbDataSethName)
								return props.crumbDataSethName;
							return item;
						}),
						to: { name: pathName },
					});
				}
			});
		}

		watch(
			() => route.path,
			() => {
				generateCrumbItemsFromPath();
			},
			{ immediate: true }
		);

		return {
			route,
			home,
			items,
		};
	},
};
</script>
<style lang="scss">
@import '@/style/config';
#bread-crumb {
	span.p-menuitem-icon,
	span.p-menuitem-text {
		color: $primaryColor !important;
	}
}
</style>
