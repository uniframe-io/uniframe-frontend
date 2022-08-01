<template>
	<Dialog
		header="Confirmation"
		v-model:visible="infoConfirm.isDialogShow"
		:style="{ width: '450px' }"
		:modal="true"
		class="delete-check-dialog"
	>
		<div class="confirmation-content tw-flex tw-items-center">
			<i class="pi pi-exclamation-triangle p-mr-3" style="font-size: 2.5rem" />
			<div>
				<span> This Dataset is being used by Task(s) with name of </span>
				<span class="tw-font-semibold"
					>{{ `${infoConfirm.tasks.map((task) => `"${task.name}"`)}` }}
				</span>
				<span> and can not be deleted.</span>
			</div>
		</div>
		<template #footer>
			<div class="tw-flex tw-justify-center">
				<Button
					label="OK"
					@click="closeConfirmation"
					class="btn-primary btn-primary-gradient tw-px-10"
					autofocus
				/>
			</div>
		</template>
	</Dialog>
	<ConfirmDialog />
	<div class="tw-flex tw-items-center tw-gap-3">
		<button
			class="tw-p-0 focus:tw-outline-none tw-text-primaryColor"
			:class="isLoading ? 'pi pi-spin pi-spinner' : 'pi pi-refresh'"
			@click="update"
			v-show="route.name !== `GetDetailDataSet`"
		></button>
		<SplitButton label="Action" :disabled="disabled" icon="pi pi-pencil" :model="items" />
	</div>
</template>
<script>
import { useConfirm } from 'primevue/useconfirm';
import { ref, watch, computed } from 'vue';
import { useStore } from 'vuex';
import { useRouter, useRoute } from 'vue-router';
export default {
	props: {
		toastEdit: {
			type: Boolean,
		},
		disabled: {
			type: Boolean,
		},
	},
	emits: ['updateDataSet'],
	setup(props, { emit }) {
		const infoConfirm = computed(() => store.state.infoConfirm);
		const store = useStore();
		const router = useRouter();
		const route = useRoute();
		const confirm = useConfirm();
		const isDataSetSelected = ref(false);
		const isLoading = ref(false);
		async function deleteDataset() {
			if (store.state.dataSet.selectedDataSet.id !== undefined) {
				store.commit('SET_BLOCKUI_VALUE', true);
				store.dispatch('dataSet/deleteDataSet', store.state.dataSet.selectedDataSet.id);
				setTimeout(() => {
					router.push({ name: 'DataSetList' });
					emit('updateDataSet');
					store.commit('SET_BLOCKUI_VALUE', false);
				}, store.state.uiTimeOut);
			}
		}
		function closeConfirmation() {
			store.commit('SET_INFO_CONFIRM', { isisDialogVisible: false });
		}
		function successfulEditToast() {
			store.commit('SET_TOAST_STATUS', {
				severity: 'success',
				summary: 'Dataset Edited',
				detail: `Dataset edited successfully`,
				life: 3000,
			});
		}
		watch(
			() => props.toastEdit,
			() => {
				successfulEditToast();
			}
		);
		const openConfirmation = () => {
			infoConfirm.value = true;
		};
		function edit() {
			if (store.state.dataSet.selectedDataSet.id !== undefined) {
				router.push({
					name: 'EditDataSet',
					params: { id: store.state.dataSet.selectedDataSet.id },
				});
			} else {
				store.commit('SET_TOAST_STATUS', {
					severity: 'warn',
					summary: 'Dataset not selected',
					detail: `Please select a dataset to edit`,
					life: 3000,
				});
			}
		}
		const confirmDelete = async () => {
			await store.dispatch(
				'dataSet/checkDataSetStatsForDelete',
				store.state.dataSet.selectedDataSet.id
			);
			const usedByTasks = store.state.dataSet.dataSetStatsForDelete.used_by_tasks;
			const datasetName = store.state.dataSet.selectedDataSet.name;
			if (usedByTasks.length === 0) {
				confirm.require({
					message: `Do you want to delete  dataset "${datasetName}"?`,
					header: 'Delete Confirmation',
					icon: 'pi pi-info-circle',
					acceptClass: 'p-button-danger',
					accept: async () => {
						await deleteDataset();
					},
					reject: () => {
						if (process.env.VUE_APP_ENVIRONMENT !== 'prod') console.log('Nothing Deleted');
					},
				});
			} else {
				store.commit('SET_INFO_CONFIRM', { isDialogShow: true, tasks: usedByTasks });
			}
		};
		function update() {
			//TODO: for now loading spinner set with time out later should on api call
			isLoading.value = true;
			emit('updateDataSet');
			store.commit(
				'SET_TOAST_STATUS',
				{
					severity: 'info', // String => success, info, warn, error
					summary: 'Updated',
					detail: 'DataSet Updated',
					life: 3000,
					closable: true,
				},
				{ root: true }
			);
			setTimeout(() => {
				isLoading.value = false;
			}, 500);
		}
		watch(
			//this watch is disable delete function
			() => store.state.dataSet.selectedDataSet,
			() => {
				isDataSetSelected.value = store.state.dataSet.selectedDataSet.id !== undefined;
			}
		);
		const items = ref([
			{
				label: 'Edit',
				icon: 'pi pi-pencil',
				command: () => edit(),
				disabled: computed(
					() =>
						!isDataSetSelected.value ||
						store.state.dataSet.selectedDataSet.ownership_type !== 'private'
				),
			},
			{
				label: 'Update',
				icon: 'pi pi-refresh',
				disabled: route.name === `GetDetailDataSet`,
				command: () => {
					//TODO: error handle this if networks not working
					update();
				},
			},
			{
				label: 'Delete',
				icon: 'pi pi-times',
				command: () => confirmDelete(),
				disabled: computed(
					() =>
						!isDataSetSelected.value ||
						store.state.dataSet.selectedDataSet.ownership_type !== 'private'
				), // if dataset not selected will be disabled or not private
			},
		]);

		return {
			closeConfirmation,
			openConfirmation,
			infoConfirm,
			route,
			isLoading,
			update,
			items,
			edit,
			successfulEditToast,
		};
	},
};
</script>
<style lang="scss">
.p-progress-spinner-color {
	background-color: blue;
}
.delete-check-dialog {
	border-radius: 1rem !important;
	.p-dialog-header {
		border-radius: 1rem 1rem 0 0 !important;
	}
	.p-dialog-footer {
		border-radius: 0 0 1rem 1rem !important;
	}
}
</style>
