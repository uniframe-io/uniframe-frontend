<template>
	<div class="tw-w-full tw-p-4 tw-flex tw-flex-col tw-gap-4">
		<div class="">
			<Notification loc="createDataSet" />
			<div class="tw-h-auto tw-mb-1">
				<CardHeader
					title="Create Dataset"
					helpReference="dataset_create"
					showHelp
					showDatasetButtons
				/>
			</div>
			<div class="tw-w-full tw-flex tw-flex-col tw-justify-center tw-gap-4">
				<DataSetBasicInfo v-if="isInfoView" />
				<DataSetUpload />
			</div>
		</div>
		<div class="tw-flex tw-justify-end">
			<Button
				:disabled="!store.state.dataSet.isFileUploaded || !store.state.dataSet.isFormValid"
				label="Create dataset"
				class="btn-primary tw-w-auto"
				@click="submit"
			/>
		</div>
	</div>
</template>

<script>
import DataSetUpload from '@/components/dataSet/Upload.vue';
import DataSetBasicInfo from '@/components/dataSet/BasicInfo.vue';
import { useStore } from 'vuex';
import { useRouter, onBeforeRouteLeave } from 'vue-router';
import { ref, computed } from 'vue';
import Notification from '@/components/Notification';
export default {
	name: 'CreateDataSet',

	components: {
		Notification,
		DataSetUpload,
		DataSetBasicInfo,
	},
	async setup() {
		const store = useStore();
		const router = useRouter();
		const isDetailView = ref(computed(() => store.state.dataSet.isDetailView));
		const isInfoView = ref(computed(() => store.state.dataSet.isInfoView));
		async function createDataSet() {
			await store.dispatch('dataSet/createDataSet');
			store.commit('dataSet/SET_IS_FILE_UPLOADED', false);
			store.commit('dataSet/SET_IS_FORM_VALID', false);
			store.commit('dataSet/SET_RESET_USER_DATA');
			store.commit('SET_BLOCKUI_VALUE', true);
			setTimeout(() => {
				router.push({ name: 'DataSetList' });
				store.commit('SET_BLOCKUI_VALUE', false);
			}, store.state.uiTimeOut);
		}
		async function submit() {
			if (store.state.dataSet.isFileUploaded && store.state.dataSet.isFormValid) {
				await createDataSet();
			}
		}
		onBeforeRouteLeave(() => {
			if (store.state.dataSet.isFileUploaded || store.state.dataSet.isFormValid) {
				const answer = window.confirm('Do you really want to leave? you have unsaved changes!');
				if (answer) return;
				return false;
			}
		});
		await store.dispatch('nmTask/getUiPermission');

		return {
			submit,
			createDataSet,
			store,
			isDetailView,
			isInfoView,
		};
	},
};
</script>
