<template>
	<div data-testId="list-action" class="tw-flex tw-gap-4">
		<div class="">
			<Button
				:label="secondaryFunctionBtnStatus.btnLabel"
				:class="secondaryFunctionBtnStatus.btnClass"
				:disabled="secondaryFunctionBtnStatus.isDisabled"
				:icon="secondaryFunctionBtnStatus.btnIcon"
				type="button"
				class=""
				iconPos="right"
				@click="secondaryFunctionBtnStatus.btnAction"
				v-if="secondaryFunctionBtnStatus.isVisible"
			/>
			<Button
				:label="primaryFunctionBtnStatus.btnLabel"
				:class="primaryFunctionBtnStatus.btnClass"
				:disabled="primaryFunctionBtnStatus.isDisabled"
				:icon="primaryFunctionBtnStatus.btnIcon"
				type="button"
				class=""
				iconPos="left"
				@click="primaryFunctionBtnStatus.btnAction"
				v-if="primaryFunctionBtnStatus.isVisible"
			/>
		</div>

		<ListAction
			@updateTaskList="$emit('updateTaskList')"
			:toastEdit="editRef"
			:disabled="actionBtnStatus.isDisabled"
			v-if="actionBtnStatus.isVisible"
			:isUpdateVisible="isUpdateVisible"
		/>
		<Button
			:label="backBtnStatus.btnLabel"
			:class="backBtnStatus.btnClass"
			:disabled="backBtnStatus.isDisabled"
			:icon="backBtnStatus.btnIcon"
			type="button"
			class="btn-primary tw-rounded-full"
			iconPos="left"
			@click="backBtnStatus.btnAction"
			v-if="backBtnStatus.isVisible"
		/>
		<Button
			:class="nextBtnStatus.btnClass"
			:label="nextBtnStatus.btnLabel"
			:disabled="nextBtnStatus.isDisabled"
			:icon="nextBtnStatus.btnIcon"
			type="button"
			class="btn-primary btn-primary-gradient"
			iconPos="right"
			@click="nextBtnStatus.btnAction"
			v-if="nextBtnStatus.isVisible"
		/>
	</div>
</template>

<script>
import { ref, reactive, watchEffect, computed } from 'vue';
import { useStore } from 'vuex';
import { useRoute, useRouter } from 'vue-router';
import ListAction from './ListAction.vue';
export default {
	props: {
		isValidForm: {
			type: Boolean,
		},
	},
	components: { ListAction },
	emits: ['updateTaskList'],
	comments: {
		ListAction,
	},
	setup(_, { emit }) {
		const store = useStore();
		const nmTask = ref(null);
		const taskDetailStatus = computed(() => store.state.nmTask.batchTaskDetail.ext_info);
		const taskSelected = ref(null);
		const icon = ref('pi pi-angle-double-right');
		const router = useRouter();
		const route = useRoute();
		const currentPath = ref('');
		const isUpdateVisible = ref(true);
		const editRef = ref(true);
		// This main "Action" Button and contorted by two ways "handleBtnStatus"  and "watch"
		// btnClass: is for adding  custom class to each button when needed correspond the route and their use
		// btnAction: is function called when button clicked
		// btnIcon: in case need to add some Icon to button

		const actionBtnStatus = reactive({
			btnClass: '',
			btnAction: '',
			btnIcon: 'pi pi-angle-double-left',
			btnLabel: 'Back',
			isVisible: true, // I have a watch function for this!!
			isDisabled: false,
		});
		const nextBtnStatus = reactive({
			btnClass: 'btn-primary-gradient',
			btnAction: '',
			btnIcon: '',
			btnLabel: 'Next',
			isVisible: true,
			isDisabled: false,
		});
		const backBtnStatus = reactive({
			btnClass: 'btn-primary tw-rounded-full tw-w-auto tw-w-36',
			btnAction: '',
			btnIcon: 'pi pi-angle-double-left',
			btnLabel: 'Back',
			isVisible: true,
			isDisabled: false,
		});
		const primaryFunctionBtnStatus = reactive({
			btnAction: '',
			btnIcon: 'pi pi-caret-right',
			btnLabel: 'Start' || 'Stop',
			isVisible: false,
			isDisabled: false,
		});
		const secondaryFunctionBtnStatus = reactive({
			btnAction: '',
			btnIcon: 'fas fa-stop',
			btnLabel: 'Start' || 'Stop',
			isVisible: false,
			isDisabled: false,
		});
		// btnReset function used to reset buttons style and function to primary status when needed
		function btnReset() {
			// Next and Back keys are main Buttons, like "Back" and "Create Dataset"
			//next
			nextBtnStatus.btnClass = 'p-button-info';
			nextBtnStatus.btnAction = '';
			nextBtnStatus.btnIcon = '';
			nextBtnStatus.btnLabel = 'Next';
			nextBtnStatus.isVisible = true;
			nextBtnStatus.isDisabled = false;
			// back
			backBtnStatus.btnClass = '';
			backBtnStatus.btnAction = '';
			backBtnStatus.btnIcon = '';
			backBtnStatus.btnLabel = 'Back';
			backBtnStatus.isVisible = true;
			backBtnStatus.isDisabled = false;
			// Function keys are use for starting and stopping the running task
			// They will be displayed as needed
			// primary function
			primaryFunctionBtnStatus.btnClass = 'btn-primary tw-w-36 btn-primary-gradient tw-w-auto';
			primaryFunctionBtnStatus.btnAction = '';
			primaryFunctionBtnStatus.btnIcon = 'pi pi-caret-right';
			primaryFunctionBtnStatus.btnLabel = 'Start';
			primaryFunctionBtnStatus.isVisible = false;
			primaryFunctionBtnStatus.isDisabled = false;
			// Secondary  function
			secondaryFunctionBtnStatus.btnClass = 'btn-primary tw-w-36 btn-primary-gradient tw-w-auto';
			secondaryFunctionBtnStatus.btnAction = '';
			secondaryFunctionBtnStatus.btnIcon = 'fas fa-stop';
			secondaryFunctionBtnStatus.btnLabel = 'Stop';
			secondaryFunctionBtnStatus.isVisible = false;
			secondaryFunctionBtnStatus.isDisabled = false;
		}

		// This function is used for controlling buttons status correspond with the route they are in
		// cases are routes names,
		function handleBtnStatus() {
			switch (currentPath.value) {
				case 'RealTimeTaskList':
					btnReset();
					backBtnStatus.isVisible = false;
					nextBtnStatus.btnAction = () => {
						router.push({ name: 'RealTimeTaskCreate' });
					};
					nextBtnStatus.btnLabel = 'Create Realtime Task';
					nextBtnStatus.btnClass = `btn-primary-gradient ${
						nextBtnStatus.btnLabel.length < 6 ? 'tw-w-24' : 'tw-w-auto'
					}`;
					nextBtnStatus.isVisible = true;
					actionBtnStatus.isVisible = true;
					break;
				case 'Dashboard':
					btnReset();
					nextBtnStatus.isVisible = false;
					backBtnStatus.isVisible = false;
					actionBtnStatus.isVisible = true;
					break;
				case 'RealTimeTaskCreate':
					btnReset();
					backBtnStatus.isVisible = true;
					backBtnStatus.btnAction = () => {
						router.push({ name: 'RealTimeTaskList' });
					};
					nextBtnStatus.btnLabel = 'Save';
					nextBtnStatus.isVisible = false;
					actionBtnStatus.isVisible = true;
					nextBtnStatus.btnClass = `btn-primary-gradient ${
						nextBtnStatus.btnLabel.length < 6 ? 'tw-w-24' : 'tw-w-auto'
					}`;
					backBtnStatus.btnClass = `btn-primary-hollow ${
						backBtnStatus.btnLabel.length < 6 ? 'tw-w-24' : 'tw-w-auto'
					}`;
					break;
				case 'BatchTaskCreate':
					btnReset();
					backBtnStatus.isVisible = true;
					backBtnStatus.btnAction = () => {
						router.push({ name: 'BatchTaskList' });
					};
					nextBtnStatus.btnLabel = 'Save';
					nextBtnStatus.isVisible = false;
					actionBtnStatus.isVisible = true;
					backBtnStatus.btnClass = `btn-primary-hollow ${
						backBtnStatus.btnLabel.length < 6 ? 'tw-w-24' : 'tw-w-auto'
					}`;
					break;
				case 'BatchTaskList':
					btnReset();
					backBtnStatus.isVisible = false;
					nextBtnStatus.btnAction = () => {
						router.push({ name: 'BatchTaskCreate' });
					};
					nextBtnStatus.btnLabel = 'Create Batch Task';
					nextBtnStatus.isVisible = true;
					actionBtnStatus.isVisible = true;
					nextBtnStatus.btnClass = `btn-primary-gradient ${
						nextBtnStatus.btnLabel.length < 6 ? 'tw-w-24' : 'tw-w-auto'
					}`;
					break;
				case `GetDetailRealTime`:
					btnReset();
					isUpdateVisible.value = false;
					backBtnStatus.isVisible = true;
					backBtnStatus.btnAction = () => {
						router.push({ name: 'RealTimeTaskList' });
					};
					nextBtnStatus.btnLabel = 'Save';
					nextBtnStatus.isVisible = false;
					actionBtnStatus.isVisible = true;
					backBtnStatus.btnClass = `btn-primary-hollow ${
						backBtnStatus.btnLabel.length < 6 ? 'tw-w-24' : 'tw-w-auto'
					}`;

					primaryFunctionBtnStatus.isVisible = !isTaskRunning(taskDetailStatus.value);
					secondaryFunctionBtnStatus.isVisible = isTaskRunning(taskDetailStatus.value);

					primaryFunctionBtnStatus.btnAction = () => {
						// running nmTask
						const id = store.state.nmTask.taskSelected.id;
						if (id !== undefined) {
							store.dispatch('nmTask/actionTaskRunning', { taskId: id, action: 'start' });
							setTimeout(() => {
								emit('updateTaskList');
							}, 1000);
						}
					};
					secondaryFunctionBtnStatus.btnAction = () => {
						// running nmTask
						const id = store.state.nmTask.taskSelected.id;
						if (id !== undefined) {
							store.dispatch('nmTask/actionTaskRunning', { taskId: id, action: 'stop' });
							setTimeout(() => {
								emit('updateTaskList');
							}, 1000);
						}
					};
					break;
				case `GetDetailBatchTask`:
					btnReset();
					isUpdateVisible.value = false;
					backBtnStatus.isVisible = true;
					backBtnStatus.btnAction = () => {
						router.push({ name: 'BatchTaskList' });
					};
					nextBtnStatus.btnLabel = 'Save';
					nextBtnStatus.isVisible = false;
					actionBtnStatus.isVisible = true;
					backBtnStatus.btnClass = `btn-primary-hollow ${
						backBtnStatus.btnLabel.length < 6 ? 'tw-w-24' : 'tw-w-auto'
					}`;

					primaryFunctionBtnStatus.isVisible = !isTaskRunning(taskDetailStatus.value);
					secondaryFunctionBtnStatus.isVisible = isTaskRunning(taskDetailStatus.value);

					primaryFunctionBtnStatus.btnAction = () => {
						// running nmTask
						const id = store.state.nmTask.taskSelected.id;
						if (id !== undefined) {
							store.dispatch('nmTask/actionTaskRunning', { taskId: id, action: 'start' });
							setTimeout(() => {
								emit('updateTaskList');
							}, 1000);
						}
					};
					secondaryFunctionBtnStatus.btnAction = () => {
						// running nmTask
						const id = store.state.nmTask.taskSelected.id;
						if (id !== undefined) {
							store.dispatch('nmTask/actionTaskRunning', { taskId: id, action: 'stop' });
							setTimeout(() => {
								emit('updateTaskList');
							}, 1000);
						}
					};
					break;
				case `RealTimeTaskEdit`:
					btnReset();
					backBtnStatus.isVisible = true;
					backBtnStatus.btnAction = () => {
						router.push({ name: 'RealTimeTaskList' });
					};
					nextBtnStatus.btnLabel = 'Save';
					nextBtnStatus.isVisible = true;
					nextBtnStatus.btnAction = '';
					nextBtnStatus.isDisabled = true;

					break;
				case `BatchTaskEdit`:
					btnReset();
					backBtnStatus.isVisible = true;
					backBtnStatus.btnAction = () => {
						router.push({ name: 'BatchTaskList' });
					};
					nextBtnStatus.btnLabel = 'Save';
					nextBtnStatus.isVisible = true;
					nextBtnStatus.btnAction = '';
					nextBtnStatus.isDisabled = true;

					break;
				default:
					btnReset();
					nextBtnStatus.isVisible = false;
					backBtnStatus.isVisible = false;
					break;
			}
		}
		function isTaskRunning(taskStatus) {
			const flag = (taskStatus !== undefined) &&
				(taskStatus.nm_status === 'preparing' ||
				taskStatus.nm_status === 'launching' ||
				taskStatus.nm_status === 'ready' ||
				taskStatus.nm_status === 'terminating')
				? true
				: false;
			return flag;
		}

		watchEffect(() => {
			nextBtnStatus.isDisabled = !store.state.dataSet.isFormValid;
		});
		watchEffect(() => {
			currentPath.value = route.name;
			handleBtnStatus();
		});
		watchEffect(() => {
			if (
				currentPath.value === 'BatchTaskList' ||
				currentPath.value === `GetDetailBatchTask` ||
				currentPath.value === 'RealTimeTaskList' ||
				currentPath.value === `GetDetailRealTime` ||
				currentPath.value === `Dashboard`
			)
				return (actionBtnStatus.isVisible = true);
			actionBtnStatus.isVisible = false;
		});
		return {
			isUpdateVisible,
			secondaryFunctionBtnStatus,
			primaryFunctionBtnStatus,
			actionBtnStatus,
			taskSelected,
			nmTask,
			icon,
			backBtnStatus,
			nextBtnStatus,
			currentPath,
			editRef,
		};
	},
};
</script>
