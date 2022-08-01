<template>
	<div class="tw-w-full tw-p-4 tw-flex tw-flex-col">
		<div>
			<div class="tw-h-auto tw-mb-1">
				<CardHeader
					title="Dataset List"
					showHelp
					showDatasetButtons
					helpReference="dataset_list"
					@reset="resetForm"
					@updateDataSet="getDataSet"
					@updateDataSetList="getDataSet"
				/>
			</div>
			<Notification :loc="'getAllDataSets' || 'editDataSet'"> </Notification>
			<div v-if="!isDataSet">You have no Dataset yet</div>
			<DataSetTable
				class="tw-shadow-lg tw-border tw-border-gray tw-w-full"
				ref="dataTable"
				@updateDataSet="getDataSet"
			/>
		</div>
	</div>
</template>

<script>
import DataSetTable from '@/components/dataSet/DataSetTable';
import { ref } from 'vue';

export default {
	name: 'DataSetList',

	components: {
		DataSetTable,
	},

	setup() {
		const icon = ref('pi pi-angle-double-right');
		const title = ref('');
		const isDataSet = ref(true);
		const dataTable = ref(null);
		function getDataSet() {
			dataTable.value.getDataSets();
		}
		function resetForm() {
			dataTable.value.resetForm();
		}
		return {
			getDataSet,
			dataTable,
			resetForm,
			isDataSet,
			icon,
			title,
		};
	},
};
</script>
