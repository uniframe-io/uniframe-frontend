<template>
	<div class="tw-relative">
		<!-- TODO  in Line 16 the logic is for having 5-20 paginator rows per page on "Create" page so it will have less height and if it is on "List" page wil have 20-100 rows per page  -->
		<DataTable
			id="data-table"
			class="tw-text-sm"
			stripedRows
			:value="dataSets"
			v-model:selection="selectedDataSet"
			responsiveLayout="scroll"
			dataKey="id"
			:scrollable="true"
			scrollHeight="700px"
			:loading="loading"
			:paginator="true"
			:rows="route.path.includes('create') ? 5 : 20"
			:rowsPerPageOptions="route.path.includes('create') ? [5, 10, 20] : [20, 50, 100]"
			currentPageReportTemplate="Showing {first} - {last} of {totalRecords}"
			paginatorTemplate="CurrentPageReport PrevPageLink PageLinks NextPageLink RowsPerPageDropdown"
			paginatorPosition="top"
			v-model:filters="searchFilters"
			:globalFilterFields="['name']"
			sortField="createdAt"
			:sortOrder="-1"
			:showAction="showAction"
		>
			<Column headerClass="table-header" selectionMode="single" style="max-width: 2rem"></Column>
			<Column headerClass="table-header" field="name" header="Name" sortable>
				<template #body="{ data }">
					<router-link
						class="tw-underline tw-text-primaryColor"
						:to="{ name: 'GetDetailDataSet', params: { id: data.id } }"
					>
						{{
							data.name.length > charCount ? `${data.name.slice(0, charCount)} ...` : data.name
						}}</router-link
					>
				</template>
			</Column>
			<Column headerClass="table-header" header="Description">
				<template #body="{ data }">
					{{
						data.description.length > charCount
							? `${data.description.slice(0, charCount)} ...`
							: data.description
					}}
				</template>
			</Column>
			<Column headerClass="table-header" field="name" header="Ownership type" sortable>
				<template #body="{ data }">
					{{ data.ownership_type }}
				</template>
			</Column>
			<Column headerClass="table-header" header="File type" field="fileType"></Column>
			<Column headerClass="table-header" header="Created Time" field="createdAt" sortable> </Column>
			<template #paginatorRight>
				<div class="p-d-flex p-jc-end">
					<span class="p-input-icon-left">
						<i class="pi pi-search" />
						<InputText v-model="searchFilters.global.value" placeholder="Search by dataset name" />
					</span>
				</div>
			</template>

			<Column
				v-if="showAction"
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
							:disabled="data.ownership_type !== 'private'"
						/>
						<Button
							@click="edit(data)"
							icon="pi pi-pencil"
							class="p-button-text p-button-rounded p-button-sm"
							:disabled="data.ownership_type !== 'private'"
						/>
					</div>
				</template>
			</Column>

			<template #empty>No DataSet found.</template>
		</DataTable>
	</div>
</template>

<script>
import { onMounted, ref, watchEffect, watch, computed } from 'vue';
import { useStore } from 'vuex';
import { useRoute, useRouter } from 'vue-router';
import convertToLocalObject from '@/helpers/convertToLocalObject.ts';
import { onBeforeRouteLeave } from 'vue-router';
import { useConfirm } from 'primevue/useconfirm';
export default {
	emits: ['updateDataSet'],

	props: {
		reference: {
			type: String,
		},
		id: {
			type: Number,
			require: true,
		},
		showAction: {
			type: Boolean,
			default: true,
		},
		disabled: {
			type: Boolean,
		},
	},
	setup(props, { emit }) {
		const store = useStore();
		const router = useRouter();
		const route = useRoute();
		const dataSets = ref(null);
		const confirm = useConfirm();
		const loading = ref(true);
		const isDataSet = ref(true);
		const selectedDataSet = ref(null);
		const charCount = 30;
		const dataSetDetail = computed(() => store.state.dataSet.dataSetDetail);
		const searchFilters = ref({
			global: {
				value: null,
			},
		});
		function deleteWithId(id) {
			store.commit('SET_BLOCKUI_VALUE', true);
			store.dispatch('dataSet/deleteDataSet', id);
			setTimeout(() => {
				emit('updateDataSet');
				store.commit('SET_BLOCKUI_VALUE', false);
			}, store.state.uiTimeOut);
		}
		const confirmDelete = async (data) => {
			await store.dispatch('dataSet/checkDataSetStatsForDelete', data.id);
			const usedByTasks = store.state.dataSet.dataSetStatsForDelete.used_by_tasks;
			if (usedByTasks.length === 0) {
				confirm.require({
					message: `Do you want to delete dataset "${data.name}"?`,
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
			} else {
				store.commit('SET_INFO_CONFIRM', { isDialogShow: true, tasks: usedByTasks });
			}
		};

		async function getDataSets() {
			dataSets.value = null;
			await store.dispatch('dataSet/getAllDataSets');
			dataSets.value = store.getters['dataSet/userDatasets'].dataSets;
			if (dataSets.value.length === 0) return (isDataSet.value = false);
			dataSets.value = convertToLocalObject(dataSets.value);
		}
		onMounted(() => {
			//every time that list rendered on page will call lists
			getDataSets();
		});
		watch(
			() => selectedDataSet.value,
			() => {
				if (selectedDataSet.value) {
					switch (props.reference) {
						case 'groundTruth':
							store.commit('nmTask/SET_SELECTED_GROUND_TRUTH_DATASET', selectedDataSet.value);
							store.commit('nmTask/SET_TASK', {
								ext_info: {
									...store.state.nmTask.createdBatchTaskData.ext_info,
									gt_dataset_config: {
										...store.state.nmTask.createdBatchTaskData.ext_info.gt_dataset_config,
										dataset_id: selectedDataSet.value.id,
									},
								},
							});
							break;
						case 'nameMatching':
							store.commit('nmTask/SET_SELECTED_NAME_MATCHING_DATASET', selectedDataSet.value);
							store.commit('nmTask/SET_TASK', {
								ext_info: {
									...store.state.nmTask.createdBatchTaskData.ext_info,
									nm_dataset_config: {
										...store.state.nmTask.createdBatchTaskData.ext_info.nm_dataset_config,
										dataset_id: selectedDataSet.value.id,
									},
								},
							});
							break;

						default:
							store.commit('dataSet/SET_SELECTED_DATASET', selectedDataSet.value);
							store.commit('dataSet/SET_USER_DATA', {
								name: selectedDataSet.value.name,
								description: selectedDataSet.value.description,
							});
							break;
					}
				}
			}
		);

		watchEffect(() => {
			//showing loading effect
			if (dataSets.value !== null) {
				loading.value = false;
			} else {
				loading.value = true;
			}
		});
		function resetForm() {
			selectedDataSet.value = {};
			store.commit('dataSet/SET_SELECTED_DATASET', {}); //deselect dataset
			store.commit('dataSet/SET_USER_DATA', {
				name: '',
				description: '',
			});
		}

		async function edit(data) {
			router.push({
				name: 'EditDataSet',
				params: { id: data.id },
			});
		}
		onBeforeRouteLeave(async (to) => {
			if (to.name === 'EditDataSet') {
				await store.dispatch('dataSet/getDataSetDetail', to.params.id);
				store.commit('dataSet/SET_SELECTED_DATASET', dataSetDetail.value);
				store.commit('dataSet/SET_USER_DATA', {
					name: dataSetDetail.value.name,
					description: dataSetDetail.value.description,
				});
			}
		});
		return {
			store,
			route,
			edit,
			charCount,
			searchFilters,
			getDataSets,
			resetForm,
			selectedDataSet,
			isDataSet,
			loading,
			dataSets,
			confirmDelete,
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
.p-paginator {
	padding: 0.5rem;
}
.p-radiobutton {
	&:focus {
		outline: none;
		box-shadow: none;
	}
	.p-radiobutton-box {
		border: 1px solid $lightGray;
		background: $white;
		width: 20px;
		height: 20px;
		color: $gray;
		border-radius: 50%;
		transition: background-color 0.2s, color 0.2s, border-color 0.2s, box-shadow 0.2s;
		.p-radiobutton-icon {
			width: 9px;
			height: 9px;
			transition-duration: 0.2s;
			background-color: $white;
		}
	}
}
.p-radiobutton-box.p-highlight .p-radiobutton-icon {
	transform: translateZ(0) scale(0.6, 0.6);
	visibility: visible;
}
</style>
