<template>
	<div>
		<DataTable
			id="task-table"
			class="tw-text-sm"
			stripedRows
			:value="nmTasks"
			v-model:selection="taskSelected"
			responsiveLayout="scroll"
			dataKey="id"
			:scrollable="true"
			scrollHeight="700"
			:loading="loading"
			:paginator="true"
			paginatorPosition="top"
			:rows="20"
			:rowsPerPageOptions="[20, 50, 100]"
			currentPageReportTemplate="Showing {first} to {last} of {totalRecords}"
			paginatorTemplate="CurrentPageReport PrevPageLink PageLinks NextPageLink RowsPerPageDropdown"
			v-model:filters="searchFilters"
			:globalFilterFields="['name']"
			sortField="created_at"
			:sortOrder="-1"
		>
			<template #paginatorRight>
				<div class="p-d-flex p-jc-end">
					<span class="p-input-icon-left">
						<i class="pi pi-search" />
						<InputText v-model="searchFilters.global.value" placeholder="Search by task name" />
					</span>
				</div>
			</template>

			<template #empty>No Tasks found.</template>
			<Column headerClass="table-header" selectionMode="single" style="max-width: 2rem"></Column>
			<Column headerClass="table-header" field="name" header="Task Name" sortable>
				<template #body="{ data }">
					<router-link
						class="tw-underline tw-text-primaryColor"
						:to="{
							name: detailRoute,
							params: { id: data.id },
						}"
					>
						{{
							data.name.length > charCount ? `${data.name.slice(0, charCount)} ...` : data.name
						}}</router-link
					>
				</template>
			</Column>
			<Column headerClass="table-header" header="Status" field="ext_info.nm_status">
				<template #body="{ data }">
					<div
						class="tw-font-semibold"
						:class="{
							'tw-text-green-500':
								data.ext_info.nm_status === 'preparing' ||
								data.ext_info.nm_status === 'launching' ||
								data.ext_info.nm_status === 'ready' ||
								data.ext_info.nm_status === 'complete',
							'tw-text-red-500':
								data.ext_info.nm_status === 'failed' || data.ext_info.nm_status === 'out-of-memory',
							'tw-text-yellow-600': data.ext_info.nm_status === 'terminating',
						}"
					>
						{{ data.ext_info.nm_status }}
					</div>
				</template>
			</Column>
			<!-- TODO add dynamic columns to change the view regarding batch or realtime  -->
			<Column headerClass="table-header" header="GroundTruth DataSet">
				<template #body="{ data }">
					<router-link
						:class="{
							'tw-text-red-500 tw-cursor-not-allowed tw-pointer-events-none':
								dataSetName(data.ext_info.gt_dataset_config.dataset_id) === wrongDataSetMsg,
						}"
						class="tw-underline tw-text-primaryColor"
						:to="{
							name: 'GetDetailDataSet',
							params: { id: data.ext_info.gt_dataset_config.dataset_id },
						}"
					>
						{{
							dataSetName(data.ext_info.gt_dataset_config.dataset_id).length > charCount
								? `${dataSetName(data.ext_info.gt_dataset_config.dataset_id).slice(
										0,
										charCount
								  )} ...`
								: dataSetName(data.ext_info.gt_dataset_config.dataset_id)
						}}</router-link
					>
				</template>
			</Column>
			<Column
				headerClass="table-header"
				v-if="isBatchTask"
				:header="isBatchTask ? 'Matching DataSet' : 'NA'"
			>
				<template #body="{ data }" v-if="isBatchTask">
					<!-- TODO change name with prefix NmBatchTask  or NmRealTimeTask-->
					<router-link
						v-if="isBatchTask"
						:to="{
							name: 'GetDetailDataSet',
							params: { id: data.ext_info.nm_dataset_config.dataset_id },
						}"
						class="tw-underline tw-text-primaryColor"
						:class="{
							'tw-text-red-500 tw-cursor-not-allowed tw-pointer-events-none':
								dataSetName(data.ext_info.nm_dataset_config.dataset_id) === wrongDataSetMsg,
						}"
						>{{
							dataSetName(data.ext_info.nm_dataset_config.dataset_id).length > charCount
								? `${dataSetName(data.ext_info.nm_dataset_config.dataset_id).slice(
										0,
										charCount
								  )} ...`
								: dataSetName(data.ext_info.nm_dataset_config.dataset_id)
						}}</router-link
					>
				</template>
			</Column>
			<Column headerClass="table-header" field="started_at" header="Start time" sortable
				><template #body="{ data }">{{
					data.started_at ? convertedTime(data.started_at) : data.na
				}}</template></Column
			>
			<Column headerClass="table-header" header="End Time"
				><template #body="{ data }">{{
					data.finished_at ? convertedTime(data.finished_at) : data.na
				}}</template></Column
			>
			<Column
				headerClass="table-header tw-flex tw-justify-center "
				header="Action"
				bodyClass="tw-flex tw-justify-center"
				style="max-width: 6rem; display: flex; justify-content: center; padding: 10px"
			>
				<template #body="{ data }">
					<div class="tw-flex">
						<Button
							icon="pi pi-trash"
							class="
								tw-rounded-full tw-bg-dangerColor
								p-button-danger p-button-outlined
								tw-outline-none
							"
							@click="confirmDelete(data)"
						/>
					</div>
				</template>
			</Column>
		</DataTable>
	</div>
</template>

<script>
import convertToLocalObject from '@/helpers/convertToLocalObject.ts';
import { convertedTime } from '@/helpers/convertToLocalObject.ts';
import { FilterMatchMode } from 'primevue/api';
import { onMounted, ref, watchEffect, computed } from 'vue';
import { useStore } from 'vuex';
import { useConfirm } from 'primevue/useconfirm';

// import _ from 'lodash';
export default {
	name: 'BatchTaskList',
	setup() {
		const store = useStore();
		const nmTasks = ref([]);
		const dataSets = ref(null);
		const confirm = useConfirm();
		const title = ref('');
		const detailRoute = ref('GetDetailBatchTask');
		const isBatchTask = computed(() => store.state.nmTask.taskState.isBatchTask);
		const isNmTask = ref(false);
		const loading = ref(true);
		const wrongDataSetMsg = ref(null);
		const charCount = 30;
		const searchFilters = ref({ global: { value: null, matchMode: FilterMatchMode.CONTAINS } });
		const taskSelected = computed({
			get: () => store.state.nmTask.taskSelected,
			set: (value) => store.commit('nmTask/SET_BATCH_TASK_SELECTED', value),
		});
		function detailRouteCheck() {
			if (!isBatchTask.value) {
				detailRoute.value = 'GetDetailRealTime';
			}
		}
		const dataSetName = (id) => {
			const dataset = dataSets.value.dataSets.filter((dataSet) => dataSet.id === id);
			if (!dataset[0]) {
				wrongDataSetMsg.value = 'No Dataset';
				return wrongDataSetMsg.value;
			} else return dataset[0].name;
		};

		async function getTasks() {
			nmTasks.value = null; // this is for creating loading effect
			await store.dispatch('dataSet/getAllDataSets');
			await store.dispatch('nmTask/getAllTasks');
			store.commit('nmTask/SET_BATCH_TASK_SELECTED', {});
			dataSets.value = store.state.dataSet.userDataSets;
			nmTasks.value = convertToLocalObject(store.state.nmTask.nmTask);
			if (nmTasks.value === null || nmTasks.value.length === 0) return (isNmTask.value = false);
		}

		onMounted(async () => {
			await getTasks();
			detailRouteCheck();
		});
		//TODO:
		// update list After CRUD
		//showing loading effect

		watchEffect(() => {
			if (nmTasks.value !== null) {
				loading.value = false;
			} else {
				loading.value = true;
			}
		});

		function resetForm() {
			taskSelected.value = {};
			store.commit('dataSet/SET_SELECTED_DATASET', {}); //deselect dataset
			store.commit('dataSet/SET_USER_DATA', {
				name: '',
				description: '',
			});
		}
		function deleteWithId(id) {
			store.commit('SET_BLOCKUI_VALUE', true);
			store.dispatch('nmTask/deleteTask', id);
			setTimeout(() => {
				store.commit('SET_BLOCKUI_VALUE', false);
				getTasks();
			}, store.state.uiTimeOut);
		}
		const confirmDelete = (data) => {
			confirm.require({
				message: `Do you want to delete task "${data.name}"?`,
				header: 'Delete Confirmation',
				icon: 'pi pi-info-circle',
				acceptClass: 'p-button-danger',
				accept: async () => {
					await deleteWithId(data.id);
				},
				reject: () => {
					if (process.env.VUE_APP_ENVIRONMENT !== 'prod') console.log('Nothing Deleted');
				},
			});
		};

		return {
			convertedTime,
			charCount,
			confirmDelete,
			deleteWithId,
			searchFilters,
			detailRoute,
			isBatchTask,
			getTasks,
			wrongDataSetMsg,
			dataSetName,
			resetForm,
			isNmTask,
			loading,
			taskSelected,
			nmTasks,
			dataSets,
			title,
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

.p-rowgroup-header {
	height: 50rem !important;
}
span.p-input-icon-left > input.p-inputtext {
	width: 17rem;
	&::placeholder {
		color: $primaryColor;
		opacity: 0.5;
	}

	&:-ms-input-placeholder {
		color: $primaryColor;
		opacity: 0.8;
	}

	&::-ms-input-placeholder {
		color: $primaryColor;
		opacity: 0.8;
	}
}
span.p-input-icon-left > i.pi {
	color: $primaryColor;
	opacity: 0.6;
}

//edit sign in Data table
.p-datatable .p-datatable-tbody > tr > td .p-row-toggler,
.p-datatable .p-datatable-tbody > tr > td .p-row-editor-init,
.p-datatable .p-datatable-tbody > tr > td .p-row-editor-save,
.p-datatable .p-datatable-tbody > tr > td .p-row-editor-cancel {
	color: $primaryColor !important;
}
// delete button
tr td button {
	border: none !important;
}
</style>
