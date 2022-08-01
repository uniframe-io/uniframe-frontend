<template>
	<div class="tw-flex tw-mx-auto tw-max-w-screen-3xl">
		<DashboardSidebar class="tw-w-1/5" />
		<div class="md:tw-container tw-mx-auto">
			<Crumb
				class="tw-h-12 tw-py-2 tw-text-primaryColor tw-border-none"
				:crumbBatchName="batchTaskDetail.name"
				:crumbDataSethName="dataSetDetail.name"
			/>
			<div
				class="header flex-col tw-items-center tw-justify-center tw-h-10"
				v-if="route.name === 'Dashboard'"
			>
				<h1 v-if="name" class="tw-text-3xl">Welcome {{ name }}!</h1>
			</div>
			<div v-if="route.name === 'Dashboard'" class="body tw-p-5">
				<div class="tw-h-auto tw-mb-1">
					<CardHeader title="Datasets" showHelp helpReference="dashboard_data_table" />
				</div>
				<DataTable
					:key="loading"
					stripedRows
					:loading="loading"
					:value="datasetTableData"
					responsiveLayout="scroll"
					class="dashboard-dataset-table p-datatable-sm tw-border tw-border-gray tw-shadow-lg"
				>
					<Column header="Type">
						<template #body="{ data }">
							<router-link v-if="data.type === 'Created Dataset'" :to="{ name: 'DataSetList' }">
								<span class="tw-underline tw-text-primaryColor">
									{{ data.type }}
								</span>
							</router-link>
							<span v-else>{{ data.type }}</span>
						</template>
					</Column>
					<Column field="" header=""></Column>
					<Column field="uploadedDatasets" header="Uploaded Datasets"> </Column>
					<Column field="" header=""></Column>
					<Column class="action" header="Action">
						<template #body="{ data }">
							<div v-if="!isNaN(data.uploadedDatasets * 1) || data.uploadedDatasets !== 'N/A'">
								<Button
									@click="redirect(data.type)"
									class="btn-primary btn-primary-gradient tw-w-auto"
									label="Create Dataset"
								/>
							</div>
							<div v-else>
								<p>Coming soon</p>
							</div>
						</template></Column
					>
				</DataTable>
			</div>
			<div v-if="route.name === 'Dashboard'" class="body tw-p-5">
				<div class="tw-h-auto tw-mb-1">
					<CardHeader
						title="String matching Tasks"
						showHelp
						helpReference="dashboard_matching_task_table"
					/>
				</div>
				<DataTable
					:key="loading"
					stripedRows
					:loading="loading"
					:value="taskTableData"
					responsiveLayout="scroll"
					class="dashboard-dataset-table p-datatable-sm tw-border tw-border-gray tw-shadow-lg"
				>
					<Column header="Type">
						<template #body="{ data }">
							<router-link
								:to="{ name: data.type === 'Batch Task' ? 'BatchTaskList' : 'RealTimeTaskList' }"
							>
								<span class="tw-underline tw-text-primaryColor">
									{{ data.type }}
								</span>
							</router-link>
						</template>
					</Column>
					<Column field="created">
						<template #header>
							<div>Created</div>
						</template>
					</Column>
					<Column field="running" class="tw-text-primaryColor">
						<template #header>
							<div class="tw-text-primaryColor">Running</div>
						</template>
					</Column>
					<Column field="failed" class="tw-text-dangerColor">
						<template #header>
							<div class="tw-text-dangerColor">Failed</div>
						</template>
					</Column>
					<Column field="completed" class="tw-text-successColor">
						<template #header>
							<div class="tw-text-successColor">Completed</div>
						</template>
					</Column>
					<Column class="action" header="Action">
						<template #body="{ data }">
							<div>
								<Button
									@click="redirect(data.type)"
									class="btn-primary btn-primary-gradient tw-w-auto tw-py-2 tw-px-7"
									:label="`Create Task`"
								/>
							</div> </template
					></Column>
				</DataTable>
			</div>
			<suspense>
				<router-view :key="dashboardIndex" />
			</suspense>
		</div>
	</div>
</template>
<script>
import { useStore } from 'vuex';
import { useRoute, useRouter, onBeforeRouteUpdate } from 'vue-router';
import { ref, computed, onMounted, watchEffect } from 'vue';
import DashboardSidebar from '../../components/DashboardSidebar.vue';
import Crumb from '@/components/Crumb.vue';
export default {
	name: 'Dashboard',
	components: { DashboardSidebar, Crumb },
	setup() {
		const store = useStore();
		const route = useRoute();
		const router = useRouter();
		const name = ref('');
		const loading = ref(true);
		onMounted(async () => {
			await getStats();
			await store.dispatch('helpGuide/getHelpGuide');
		});
		onBeforeRouteUpdate(async (to) => {
			if (to.name === 'Dashboard') await getStats();
			if (
				to.name === 'EditDataSet' &&
				store.state.dataSet.selectedDataSet.ownership_type !== 'private'
			)
				return false;
		});
		const datasetTableData = ref([]);
		const taskTableData = ref([]);
		const stats = ref(null);

		async function getStats() {
			stats.value = null;
			await store.dispatch('nmTask/getStats');
			stats.value = store.state.nmTask.stats;
			datasetTableData.value = [
				{ type: 'Created Dataset', uploadedDatasets: stats.value.created_dataset.uploaded_count },
				{ type: 'Shared Datasets', uploadedDatasets: 'N/A' },
			];
			taskTableData.value = [
				{
					type: 'Batch Task',
					created: stats.value.batch_task.created_count,
					running: stats.value.batch_task.running_count,
					failed: stats.value.batch_task.failed_count,
					completed: stats.value.batch_task.complete_count,
				},
				{
					type: 'Realtime Task',
					created: stats.value.realtime_task.created_count,
					running: stats.value.realtime_task.running_count,
					failed: stats.value.realtime_task.failed_count,
					completed: stats.value.realtime_task.complete_count,
				},
			];
		}
		function redirect(reference) {
			if (reference === 'Batch Task') router.push({ name: 'BatchTaskCreate' });
			if (reference === 'Realtime Task') router.push({ name: 'RealTimeTaskCreate' });
			if (reference === 'Created Dataset') router.push({ name: 'CreateDataSet' });
		}
		watchEffect(() => {
			//showing loading effect
			if (stats.value !== null) {
				loading.value = false;
			} else {
				loading.value = true;
			}
		});
		name.value = store.state.currentUserData.fullName.split(' ', 1)[0];
		return {
			getStats,
			redirect,
			loading,
			taskTableData,
			datasetTableData,
			stats,
			batchTaskDetail: computed(() => store.state.nmTask.batchTaskDetail),
			dataSetDetail: computed(() => store.state.dataSet.dataSetDetail),
			dashboardIndex: computed(() => store.state.dashboardIndex),
			name,
			route,
		};
	},
};
</script>
<style lang="scss">
@import '@/style/config';
.table-header {
	background: $tableTitle !important;
	border-top: 1px solid $gray !important;
	border-bottom: 1px solid $gray !important;
}
.action {
	min-width: 10rem !important;
}
.dashboard-dataset-table {
	.p-datatable-tbody,
	.p-datatable-thead {
		tr {
			td {
				width: 20%;
				text-align: center;
				height: 3.5rem;
				font-size: 0.9rem;
			}
			& th {
				text-align: center;
			}
		}
	}
	& .p-datatable-thead {
		tr {
			th {
				width: 20%;
				height: 3.5rem;
				font-size: 1rem;
				font-weight: 400 !important;
				background: $tableTitle !important;
				border-bottom: 1px solid $gray !important;
				.p-column-header-content {
					display: flex;
					justify-content: center;
				}
			}
		}
	}
}
</style>
