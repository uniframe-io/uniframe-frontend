<template>
	<div class="detail-container">
		<div class="">
			<Notification
				loc="getDataSetDetail"
				goTo="DataSetList"
				@isNotification="notificationStatus"
			/>
			<div class="tw-h-auto">
				<CardHeader
					title="DataSet details"
					helpReference="dataset_detail"
					showHelp
					showDatasetButtons
				/>
			</div>
			<div
				class="
					tw-w-full
					main-container
					tw-flex
					tw-flex-col
					tw-gap-4w-full
					tw-justify-center
					tw-border
					tw-border-gray
					tw-shadow-md
					tw-pb-5
				"
			>
				<CardHeader
					title="Dataset info"
					class="tw-px-5 tw-bg-tableTitle tw-h-11 tw-border-b tw-border-gray"
				/>
				<div
					class="
						tw-text-sm
						tw-p-5
						tw-w-full
						tw-grid
						tw-grid-cols-3
						tw-gap-4
						tw-justify-items-stretch
						tw-items-start
						tw-content-start
						tw-mt-2
					"
				>
					<div class="tw-flex tw-flex-col tw-h-auto tw-gap-0">
						<p class="tw-font-bold">Dataset Name</p>
						<div class="tw-flex tw-justify-between tw-w-3/4 tw-items-center tw-h-auto">
							<span class="tw-flex tw-text-left">{{ dataSetDetail.name }}</span>
							<Button
								@click="edit"
								icon="pi pi-pencil"
								class="tw-h-2 tw-p-0 p-button-text p-button-rounded p-button-sm"
								:disabled="store.state.dataSet.selectedDataSet.ownership_type !== 'private'"
							/>
						</div>
					</div>
					<div class="tw-flex tw-flex-col tw-h-auto tw-gap-2">
						<p class="tw-font-bold">File Type</p>
						<span class="tw-flex tw-text-left">{{ dataSetDetail.fileType }}</span>
					</div>
					<div class="tw-flex tw-flex-col tw-h-auto tw-gap-2">
						<p class="tw-font-bold">Location</p>
						<span class="tw-flex tw-text-left">{{ dataSetDetail.na }}</span>
					</div>
					<div class="tw-flex tw-flex-col tw-h-auto tw-gap-0">
						<p class="tw-font-bold">Description</p>
						<div class="tw-flex tw-justify-between tw-w-3/4 tw-items-center tw-h-auto">
							<span class="tw-flex tw-text-left h-auto">{{ dataSetDetail.description }}</span>
							<Button
								@click="edit"
								icon="pi pi-pencil"
								class="tw-h-2 tw-p-0 p-button-text p-button-rounded p-button-sm"
								:disabled="store.state.dataSet.selectedDataSet.ownership_type !== 'private'"
							/>
						</div>
					</div>
					<div class="tw-flex tw-flex-col tw-h-auto tw-gap-2">
						<p class="tw-font-bold">Owner</p>
						<span class="tw-flex tw-text-left">{{ dataSetDetail.owner_id }}</span>
					</div>
					<div class="tw-flex tw-flex-col tw-h-auto tw-gap-2">
						<p class="tw-font-bold">Created at</p>
						<span class="tw-flex tw-text-left">{{ dataSetDetail.createdAt }}</span>
					</div>
				</div>
			</div>
			<div class="">
				<UploadPreviewData :tableData="previewData" class="tw-h-auto tw-mt-2" />
			</div>
		</div>
	</div>
</template>

<script>
import UploadPreviewData from '@/components/dataSet/UploadPreviewData';
//
import Notification from '@/components/Notification.vue';
//
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import { ref, onMounted, reactive, watch, computed } from 'vue';
//

export default {
	name: 'GetDetailDataSet',
	props: ['id'],

	components: { Notification, UploadPreviewData },

	setup(props) {
		const store = useStore();
		const router = useRouter();
		const dataSetDetail = computed(() => store.state.dataSet.dataSetDetail);
		const previewData = reactive({});
		const isNotification = ref(false);
		const notifications = ref([]);

		async function getDataSetDetail() {
			await store.dispatch('dataSet/getDataSetDetail', props.id);
			store.commit('dataSet/SET_SELECTED_DATASET', dataSetDetail.value);
			store.commit('dataSet/SET_USER_DATA', {
				name: dataSetDetail.value.name,
				description: dataSetDetail.value.description,
			});
		}
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
		function notificationStatus([status, notification]) {
			isNotification.value = status;
			notifications.value = notification;
		}
		onMounted(() => {
			getDataSetDetail();
			previewData.header = store.getters['dataSet/previewData'].previewDataHeader;
			previewData.row = store.getters['dataSet/previewData'].previewDataRows;
		});

		watch(
			() => store.getters['dataSet/previewData'],
			() => {
				previewData.header = store.getters['dataSet/previewData'].previewDataHeader;
				previewData.row = store.getters['dataSet/previewData'].previewDataRows;
			}
		);

		return { store, notificationStatus, dataSetDetail, previewData, isNotification, edit };
	},
};
</script>
