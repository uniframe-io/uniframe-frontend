<template>
	<div>
		<CardHeader title="Preview" class="tw-h-auto" showHelp helpReference="dataset_preview" />
		<DataTable
			:loading="!tableData.header"
			:value="tableData.row"
			responsiveLayout="scroll"
			class="p-datatable-sm tw-border tw-border-gray tw-shadow-lg tw-text-sm"
		>
			<Column v-for="(head, i) in tableData.header" :key="i">
				<template #header>
					<div
						:class="{
							'tw-font-bold tw-text-primaryColorVariant':
								head === selectedGtHeader || head === selectedNmHeader,
						}"
					>
						{{ head }}
					</div>
				</template>
				<template #body="{ data }">
					<div
						:class="{
							'tw-font-bold tw-text-primaryColor':
								head === selectedGtHeader || head === selectedNmHeader,
						}"
					>
						{{ data[head] }}
					</div>
				</template>
			</Column>
		</DataTable>
	</div>
</template>
<script>
import { useStore } from 'vuex';
export default {
	name: 'DataSetUploadPreviewData',
	props: {
		showHelp: {
			type: Boolean,
			default: false,
		},
		tableData: {
			type: Object,
			required: true,
		},
		selectedGtHeader: {
			type: String,
		},
		selectedNmHeader: {
			type: String,
		},
	},
	components: {},

	setup() {
		const store = useStore();

		async function createDataSet() {
			await store.dispatch('dataSet/createDataSet');
		}

		return {
			store,
			createDataSet,
		};
	},
};
</script>
