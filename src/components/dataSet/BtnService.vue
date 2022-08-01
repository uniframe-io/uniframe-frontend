<template>
	<div data-testId="list-action" class="tw-flex tw-gap-3">
		<ListAction
			:toastEdit="editRef"
			:disabled="actionBtnStatus.isDisabled"
			v-if="actionBtnStatus.isVisible"
			@updateDataSet="$emit('updateDataSet')"
		/>
		<Button
			:label="backBtnStatus.btnLabel"
			:disabled="backBtnStatus.isDisabled"
			:icon="backBtnStatus.btnIcon"
			type="button"
			class="btn-primary tw-rounded-full"
			:class="backBtnStatus.btnClass"
			iconPos="left"
			@click="backBtnStatus.btnAction"
			v-if="backBtnStatus.isVisible"
		/>
		<Button
			:label="nextBtnStatus.btnLabel"
			:disabled="nextBtnStatus.isDisabled"
			:icon="nextBtnStatus.btnIcon"
			:class="nextBtnStatus.btnClass"
			type="button"
			class="btn-primary tw-rounded-full"
			iconPos="right"
			@click="nextBtnStatus.btnAction"
			v-if="nextBtnStatus.isVisible"
		/>
	</div>
</template>

<script>
import { ref, reactive, watchEffect, watch } from 'vue';
import { useStore } from 'vuex';
import { useRoute, useRouter } from 'vue-router';
import ListAction from '@/components/dataSet/ListAction.vue';
export default {
	components: { ListAction },
	emits: ['updateDataSet', 'reset', 'updateDataSetList'],

	setup(_, { emit }) {
		const store = useStore();
		const dataSets = ref(null);
		const selectedDataSet = ref(null);
		const icon = ref('pi pi-angle-double-right');
		const router = useRouter();
		const route = useRoute();
		const currentPath = ref('');
		const editRef = ref(true);
		const actionBtnStatus = reactive({
			btnClass: '-warning',
			btnAction: '',
			btnIcon: '',
			btnLabel: 'Back',
			isVisible: true, // I have a watch function for this!!
			isDisabled: false,
		});
		const nextBtnStatus = reactive({
			btnAction: '',
			btnIcon: '',
			btnClass: '',
			btnLabel: 'Next',
			isVisible: true,
			isDisabled: false,
		});
		const backBtnStatus = reactive({
			btnAction: '',
			btnIcon: '',
			btnClass: '',
			btnLabel: 'Back',
			isVisible: true,
			isDisabled: false,
		});
		function btnReset() {
			nextBtnStatus.btnAction = '';
			nextBtnStatus.btnIcon = '';
			nextBtnStatus.btnLabel = 'Next';
			nextBtnStatus.isVisible = true;
			nextBtnStatus.isDisabled = false;
			backBtnStatus.btnAction = '';
			backBtnStatus.btnIcon = '';
			backBtnStatus.btnLabel = 'Back';
			backBtnStatus.btnClass = 'btn-primary-hollow tw-w-auto';
			backBtnStatus.isVisible = true;
			backBtnStatus.isDisabled = false;
		}
		async function createDataSet() {
			await store.dispatch('dataSet/createDataSet');
			store.commit('dataSet/SET_IS_FILE_UPLOADED', false);
			store.commit('dataSet/SET_RESET_USER_DATA');
			store.commit('SET_BLOCKUI_VALUE', true);
			setTimeout(() => {
				router.push({ name: 'DataSetList' });
				store.commit('SET_BLOCKUI_VALUE', false);
			}, 1000);
		}
		function watchUpload() {
			watch(
				() => store.state.dataSet.isInfoView,
				() => {
					if (store.state.dataSet.isFileUploaded) {
						store.dispatch('dataSet/dataPreview');
						nextBtnStatus.isDisabled = !store.state.dataSet.isFileUploaded;
					}
				}
			);
			watch(
				() => store.state.dataSet.isFileUploaded,
				() => {
					if (store.state.dataSet.isFileUploaded) {
						store.dispatch('dataSet/dataPreview');
						nextBtnStatus.isDisabled = !store.state.dataSet.isFileUploaded;
					}
				}
			);
		}
		function unWatchUpload() {
			watch(
				() => store.state.dataSet.isInfoView,
				() => {
					return;
				}
			);
			watch(
				() => store.state.dataSet.isFileUploaded,
				() => {
					return;
				}
			);
		}

		function handleBtnStatus() {
			switch (currentPath.value) {
				case '/dashboard/datasets':
					btnReset();
					backBtnStatus.isVisible = false;
					nextBtnStatus.btnAction = () => {
						router.push({ name: 'CreateDataSet' });
						emit('reset');
					};
					nextBtnStatus.btnLabel = 'Create Dataset';
					nextBtnStatus.isVisible = true;
					nextBtnStatus.btnClass = `btn-primary-gradient ${
						nextBtnStatus.btnLabel.length < 6 ? 'tw-w-24' : 'tw-w-36'
					}`;

					break;

				case `/dashboard/datasets/${route.params.id}`:
					btnReset();
					backBtnStatus.isVisible = true;
					nextBtnStatus.isVisible = false;
					backBtnStatus.btnClass = `btn-primary-hollow ${
						backBtnStatus.btnLabel.length < 6 ? 'tw-w-24' : 'tw-w-36'
					}`;
					nextBtnStatus.btnClass = `btn-primary-gradient ${
						nextBtnStatus.btnLabel.length < 6 ? 'tw-w-24' : 'tw-w-36'
					}`;
					nextBtnStatus.btnAction = () => {
						store.commit('dataSet/SET_USER_DATA', {
							name: '',
							description: '',
						});

						store.commit('dataSet/SET_SELECTED_DATASET', {});
						router.push({ name: 'CreateDataSet' });
					};
					backBtnStatus.btnAction = () => {
						router.push({ name: 'DataSetList' });
						store.commit('dataSet/SET_SELECTED_DATASET', {});
					};
					break;

				case `/dashboard/datasets/${route.params.id}/edit`:
					btnReset();
					backBtnStatus.isVisible = true;
					backBtnStatus.btnAction = () => {
						router.push({ name: 'DataSetList' });
						store.commit('dataSet/SET_SELECTED_DATASET', {});
					};
					nextBtnStatus.btnLabel = 'Save';
					backBtnStatus.btnClass = `btn-primary-hollow ${
						backBtnStatus.btnLabel.length < 6 ? 'tw-w-24' : 'tw-w-36'
					}`;
					nextBtnStatus.isVisible = true;
					nextBtnStatus.btnIcon = '';
					nextBtnStatus.btnClass = `btn-primary-gradient ${
						nextBtnStatus.btnLabel.length < 6 ? 'tw-w-24' : 'tw-w-36'
					} `;
					nextBtnStatus.btnAction = async () => {
						await store.dispatch('dataSet/editDataSet', store.state.dataSet.selectedDataSet.id);
						editRef.value = !editRef.value;
					};
					break;

				case '/dashboard/datasets/create':
					btnReset();
					nextBtnStatus.isVisible = false;
					backBtnStatus.btnLabel = 'Back';
					backBtnStatus.btnClass = `btn-primary-hollow ${
						backBtnStatus.btnLabel.length < 6 ? 'tw-w-24' : 'tw-w-36'
					}`;
					backBtnStatus.btnAction = () => {
						//TODO: add notification for back btn
						if (!store.state.dataSet.isInfoView) {
							store.commit('dataSet/SET_IS_INFO_VIEW', true);
							nextBtnStatus.isDisabled = !store.state.dataSet.isFormValid;
							nextBtnStatus.btnLabel = 'Next';
							backBtnStatus.btnLabel = 'Cancel';
							backBtnStatus.btnIcon = 'pi pi-times';
						} else {
							router.push({ name: 'DataSetList' });
							unWatchUpload();
							store.commit('dataSet/SET_RESET_USER_DATA');
							store.state.dataSet.isFileUploaded &&
								store.commit('dataSet/SET_IS_FILE_UPLOADED', false);
						}
					};
					nextBtnStatus.btnAction = async () => {
						if (store.state.dataSet.isInfoView) {
							nextBtnStatus.isDisabled = true;
							backBtnStatus.btnLabel = 'Edit';
							backBtnStatus.btnIcon = 'pi pi-angle-double-left';
							nextBtnStatus.btnLabel = 'Create Dataset';
							store.commit('dataSet/SET_IS_INFO_VIEW', false);
							watchUpload();
						} else if (
							!store.state.dataSet.isInfoView &&
							store.state.dataSet.isFileUploaded &&
							store.state.dataSet.isFormValid
						) {
							await createDataSet();
							//TODO see why this is not working
							setTimeout(() => {
								emit('updateDataSetList');
							}, store.state.uiTimeOut);
							unWatchUpload();
						}
					};
					break;

				default:
					btnReset();
					nextBtnStatus.isVisible = false;
					backBtnStatus.isVisible = false;
					break;
			}
		}

		watchEffect(() => {
			nextBtnStatus.isDisabled = !store.state.dataSet.isFormValid;
		});

		watchEffect(() => {
			currentPath.value = route.path;
			handleBtnStatus();
		});
		watchEffect(() => {
			if (
				currentPath.value === '/dashboard/datasets' ||
				currentPath.value === `/dashboard/datasets/${route.params.id}`
			)
				return (actionBtnStatus.isVisible = true);
			actionBtnStatus.isVisible = false;
		});

		function goToCreate() {
			store.commit('dataSet/SET_IS_DETAIL_VIEW', false);
		}

		return {
			actionBtnStatus,
			selectedDataSet,
			dataSets,
			goToCreate,
			icon,
			backBtnStatus,
			nextBtnStatus,
			currentPath,
			editRef,
			items: [{ label: 'Action' }],
		};
	},
};
</script>

<style lang="scss" scoped></style>
