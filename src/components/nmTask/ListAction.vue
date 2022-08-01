<template>
	<ConfirmDialog />
	<div class="tw-flex tw-items-center tw-gap-3">
		<button
			v-if="isUpdateVisible"
			class="tw-p-0 focus:tw-outline-none tw-text-primaryColor"
			:class="isLoading ? 'pi pi-spin pi-spinner' : 'pi pi-refresh'"
			@click="update"
		></button>
		<SplitButton
			label="Edit"
			:disabled="disabled"
			icon="pi pi-pencil"
			:model="items"
			class="p-button-sm"
		></SplitButton>
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
		isUpdateVisible: {
			type: Boolean,
			default: true,
		},
	},
	emits: ['updateTaskList'],
	setup(props, { emit }) {
		const store = useStore();
		const router = useRouter();
		const route = useRoute();
		const confirm = useConfirm();
		const isTaskSelected = ref(false);
		const isLoading = ref(false);
		const isBatchTask = computed({
			get: () => store.state.nmTask.taskState.isBatchTask,
			set: (value) => store.commit('nmTask/SET_IS_BATCH_TASK', value),
		});
		async function deleteTask() {
			if (store.state.nmTask.taskSelected.id !== undefined) {
				store.commit('SET_BLOCKUI_VALUE', true);
				const taskId = store.state.nmTask.taskSelected.id;
				store.dispatch('nmTask/deleteTask', taskId);
				emit('updateTaskList');
				setTimeout(() => {
					isBatchTask.value
						? router.push({ name: 'BatchTaskList' })
						: router.push({ name: 'RealTimeTaskList' });
					store.commit('SET_BLOCKUI_VALUE', false);
				}, store.state.uiTimeOut);
			} else {
				store.commit('SET_TOAST_STATUS', {
					severity: 'warn',
					summary: 'Dataset not selected',
					detail: `Please select a task to delete`,
					life: 3000,
				});
			}
		}
		function update() {
			//TODO: for now loading spinner set with time out later should on api call
			isLoading.value = true;
			emit('updateTaskList');
			store.commit(
				'SET_TOAST_STATUS',
				{
					severity: 'info', // String => success, info, warn, error
					summary: 'Updated',
					detail: `${route.path.includes('datasets') ? 'Datasets updated' : 'Tasks Updated'}`,
					life: 3000,
					closable: true,
				},
				{ root: true }
			);
			setTimeout(() => {
				isLoading.value = false;
			}, 500);
		}

		function successfulEditToast() {
			store.commit('SET_TOAST_STATUS', {
				severity: 'success',
				summary: 'Task Edited',
				detail: `Batch Task edited successfully`,
				life: 3000,
			});
		}
		watch(
			() => props.toastEdit,
			() => {
				successfulEditToast();
			}
		);

		function edit() {
			if (store.state.nmTask.taskSelected.id !== undefined) {
				router.push({
					name: isBatchTask.value ? 'BatchTaskEdit' : 'RealTimeTaskEdit',
					params: { id: store.state.nmTask.taskSelected.id },
				});
			} else {
				store.commit('SET_TOAST_STATUS', {
					severity: 'warn',
					summary: 'Dataset not selected',
					detail: `Please select a task to edit`,
					life: 3000,
				});
			}
		}
		const confirmDelete = () => {
			confirm.require({
				message: `Do you want to delete  task "${store.state.nmTask.taskSelected.name}"?`,
				header: 'Delete Confirmation',
				icon: 'pi pi-info-circle',
				acceptClass: 'p-button-danger',
				accept: async () => {
					await deleteTask();
					emit('updateTaskList');
				},
				reject: () => {
					if (process.env.VUE_APP_ENVIRONMENT !== 'prod') console.log('Nothing Deleted');
				},
			});
		};
		watch(
			//this watch is disable delete function
			() => store.state.nmTask.taskSelected,
			() => {
				isTaskSelected.value = store.state.nmTask.taskSelected.id !== undefined;
			}
		);
		const items = ref([
			{
				label: 'Update',
				icon: 'pi pi-refresh',
				// disabled: route.name === `GetDetailBatchTask`,
				command: async () => {
					//TODO: error handle this if networks not working
					emit('updateTaskList');
					store.commit(
						'SET_TOAST_STATUS',
						{
							severity: 'info', // String => success, info, warn, error
							summary: 'Updated',
							detail: 'Tasks Updated',
							life: 3000,
							closable: true,
						},
						{ root: true }
					);
				},
			},
			{
				label: 'Delete',
				icon: 'pi pi-times',
				command: () => confirmDelete(),
				disabled: computed(() => !isTaskSelected.value), // if dataset not selected will be disabled
			},
		]);

		return {
			update,
			isLoading,
			route,
			items,
			edit,
			successfulEditToast,
		};
	},
};
</script>
