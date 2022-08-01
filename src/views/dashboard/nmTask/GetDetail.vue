<template>
	<div class="tw-w-full tw-p-4">
		<div class="tw-flex tw-flex-col">
			<div class="tw-h-auto">
				<Notification
					loc="getTask"
					:goTo="route.name === 'GetDetailBatchTask' ? 'BatchTaskList' : 'RealTimeTaskList'"
					@isNotification="notificationStatus"
				/>
				<CardHeader
					title="Task Detail"
					:helpReference="isBatchTask ? 'batch_matching_task_detail' : 'rt_matching_task_detail'"
					showHelp
					showTaskButtons
					@updateTaskList="getTaskDetail"
				/>
			</div>

			<div v-if="!isNotification && batchTaskDetail">
				<div v-if="batchTaskDetail" class="tw-flex tw-flex-col tw-gap-4">
					<div class="main-container tw-pb-4">
						<CardHeader
							title="Task Info"
							class="tw-px-5 tw-bg-tableTitle tw-h-11 tw-border-b tw-border-gray"
						/>
						<div
							class="
								grid
								tw-text-sm
								tw-p-5
								tw-grid
								tw-grid-cols-3
								tw-grid-rows-2
								tw-gap-5
								tw-justify-items-stretch
								tw-items-start
								tw-content-start
								tw-mt-2
								tw-w-full
							"
						>
							<div class="tw-flex tw-flex-col tw-h-auto tw-gap-0 tw-w-full">
								<p class="tw-font-bold">{{ `${taskType} Task Name` }}</p>
								<div class="tw-flex tw-justify-between tw-w-3/4 tw-items-center tw-h-auto">
									<span class="tw-flex tw-text-left">{{ batchTaskDetail.name }}</span>
								</div>
							</div>

							<div class="tw-flex tw-flex-col tw-h-auto tw-gap-0 tw-w-full">
								<div class="tw-flex tw-w-3/4 tw-items-center tw-h-auto">
									<p class="tw-font-bold">Status</p>
									<button class="focus:tw-outline-none" @click="getTaskDetail">
										<span
											class="tw-text-sm tw-ml-2 tw-text-primaryColor tw-outline-none"
											:class="isLoading ? 'pi pi-spin pi-spinner' : 'pi pi-refresh'"
										></span>
									</button>
								</div>
								<span
									v-if="batchTaskDetail.ext_info"
									:class="{
										'tw-text-green-500':
											batchTaskDetail.ext_info.nm_status === 'preparing' ||
											batchTaskDetail.ext_info.nm_status === 'launching' ||
											batchTaskDetail.ext_info.nm_status === 'ready' ||
											batchTaskDetail.ext_info.nm_status === 'complete',
										'tw-text-red-500':
											batchTaskDetail.ext_info.nm_status === 'failed' ||
											batchTaskDetail.ext_info.nm_status === 'out-of-memory',
										'tw-text-yellow-600': batchTaskDetail.ext_info.nm_status === 'terminating',
									}"
									class="tw-flex tw-text-left tw-font-semibold"
									>{{ batchTaskDetail.ext_info.nm_status }}</span
								>
							</div>
							<div class="tw-flex tw-flex-col tw-h-auto tw-gap-0 tw-w-full">
								<p class="tw-font-bold">Created Time</p>
								<div class="tw-flex tw-justify-between tw-w-3/4 tw-items-center tw-h-auto">
									<span class="tw-flex tw-text-left">{{
										convertedTime(batchTaskDetail.created_at)
									}}</span>
								</div>
							</div>
							<div class="tw-flex tw-flex-col tw-h-auto tw-gap-0 tw-w-full">
								<p class="tw-font-bold">Description</p>
								<div class="tw-flex tw-justify-between tw-w-3/4 tw-items-center tw-h-auto">
									<span class="tw-flex tw-text-left">{{ batchTaskDetail.description }}</span>
								</div>
							</div>

							<div class="tw-flex tw-flex-col tw-h-auto tw-gap-0 tw-w-full">
								<p class="tw-font-bold">Start time</p>
								<div class="tw-flex tw-justify-between tw-w-3/4 tw-items-center tw-h-auto">
									<span class="tw-flex tw-text-left">{{
										batchTaskDetail.started_at ? convertedTime(batchTaskDetail.started_at) : 'NA'
									}}</span>
								</div>
							</div>
							<div class="tw-flex tw-flex-col tw-h-auto tw-gap-0 tw-w-full">
								<p class="tw-font-bold">End Time</p>
								<div class="tw-flex tw-justify-between tw-w-3/4 tw-items-center tw-h-auto">
									<span class="tw-flex tw-text-left">{{
										batchTaskDetail.finished_at ? convertedTime(batchTaskDetail.finished_at) : 'NA'
									}}</span>
								</div>
							</div>
						</div>
					</div>
					<!-- Result preview -->
					<div :key="tableKey" v-if="!isBatchTask" class="tw-relative main-container">
						<CardHeader
							title="Realtime Matching"
							class="tw-px-5 tw-py-1 tw-bg-tableTitle tw-h-auto tw-border-b tw-border-gray"
							showHelp
							helpReference="rt_matching_task_match"
						/>
						<div class="tw-w-full tw-p-5">
							<Chips
								class="tw-w-full"
								separator="	"
								v-model="realTimeQueryParamArray"
								:max="100"
								addOnEnter
							/>
							<div class="tw-flex tw-gap-4 tw-justify-end tw-w-full tw-mt-3">
								<Button
									@click="runRealTimeNameMatching"
									label="Search"
									class="btn-primary btn-primary-gradient tw-w-auto"
									:disabled="
										batchTaskDetail.ext_info.nm_status !== 'ready' ||
										realTimeQueryParamArray.length === 0
									"
								/>
								<Button
									label="Clear Search"
									class="btn-primary btn-primary-hollow tw-w-auto"
									@click="clearSearch"
								/>
							</div>
						</div>
						<div v-if="!!realTimeNameMatchingResult.query_result" class="tw-p-4">
							<DataTable
								:key="tableKey"
								class="p-datatable-sm tw-border tw-border-gray tw-shadow-lg tw-text-sm"
								:value="realTimeNameMatchingResult.query_result"
								responsiveLayout="scroll"
							>
								<Column
									v-for="(col, i) in realTimeNameMatchingResult.columns"
									:key="i"
									:header="col"
								>
									<template #body="{ data }"> {{ data[i] }} </template>
								</Column>
							</DataTable>
						</div>
					</div>

					<div v-else class="main-container">
						<CardHeader
							title="Batch Task Matching Result"
							class="tw-px-5 tw-bg-tableTitle tw-h-11 tw-border-b tw-border-gray"
						/>

						<div class="tw-flex tw-justify-between tw-items-center tw-p-5">
							<CardHeader
								title="Preview"
								helpReference="batch_matching_task_result_preview"
								showHelp
								class="tw-w-full"
							/>
							<Button
								label="Download"
								class="tw-w-32 tw-h-9 btn-primary btn-primary-gradient"
								:disabled="!btMatchingResults"
								@click="getDownloadLinkAndRedirect"
							/>
						</div>
						<div v-if="btMatchingResults" class="tw-p-4">
							<DataTable
								class="p-datatable-sm tw-border tw-border-gray tw-shadow-lg tw-text-sm"
								:value="JSON.parse(btMatchingResults.first_n_rows)"
								responsiveLayout="scroll"
							>
								<Column v-for="(col, i) in btMatchingResults.header" :key="i" :header="col">
									<template #body="{ data }"> {{ data[col] }}</template>
								</Column>
							</DataTable>
						</div>
					</div>

					<div class="main-container">
						<PreviewDataSet
							@selected-gt-header="setSelectedGtHeader"
							reference="groundTruth"
							title="Groundtruth DataSet"
							@tabOpen="getGtDataSetDetail"
							:gtHeaders="gtHeaders"
							:previewData="gtData"
							class="tw-w-full"
							:errorsClasses="errorsClasses"
							:gtPlaceholder="selectedGtHeader"
							showHelp
							helpReference="matching_task_select_gt_dataset"
						/>
					</div>
					<div v-if="isBatchTask" class="main-container">
						<PreviewDataSet
							reference="nameMatching"
							@selected-nm-header="setSelectedNmHeader"
							@tabOpen="getNmDataSetDetail"
							title="Matching DataSet"
							:previewData="nmData"
							class="tw-w-full"
							:errorsClasses="errorsClasses"
							:nmPlaceholder="selectedNmHeader"
							showHelp
							helpReference="matching_task_select_matching_dataset"
						/>
					</div>

					<div v-if="!isBatchTask" class="main-container">
						<CardHeader
							title="Setup search options"
							class="tw-px-5 tw-py-1 tw-bg-tableTitle tw-h-auto tw-border-b tw-border-gray"
							showHelp
							helpReference="matching_options"
						/>
						<SearchOptions
							:errorsClasses="errorsClasses"
							@selected-gt-header="setSelectedGtHeader"
							@similarity-threshold="setSimilarityThreshold"
							@number-input="setNumberOfMatchingResult"
							@selected-gt-Columns="setSelectedGtColumns"
							:gtPlaceholder="selectedGtHeader"
							:gtHeaders="gtHeaders"
							:threshold="similarityThreshold"
							:matchNumber="numberOfMatchingResult"
							:gtColPlaceholder="selectedGtColumn.length ? '' : 'No column selected'"
							:preSelectedGtColumns="selectedGtColumn"
							class="tw-p-5 tw-shadow"
						/>
					</div>
					<DetailSearchOptions v-else />
					<DetailComputeOptions />
					<DetailAlgorithmOptions />
				</div>
			</div>
			<div></div>
		</div>
	</div>
</template>

<script>
import PreviewDataSet from '@/components/nmTask/PreviewDataSet';
import DetailSearchOptions from '@/components/nmTask/DetailSearchOptions';

import SearchOptions from '@/components/nmTask/SearchOptions';
import DetailComputeOptions from '@/components/nmTask/DetailComputeOptions';
import DetailAlgorithmOptions from '@/components/nmTask/DetailAlgorithmOptions';

import useValidation from '@/helpers/createdBatchTaskDataValidator';
//

import Chips from 'primevue/chips';
//

import { useStore } from 'vuex';
import { ref, onMounted, reactive, computed, watch } from 'vue';
import { useRoute } from 'vue-router';

import { convertedTime } from '@/helpers/convertToLocalObject.ts';
import _ from 'lodash';
//

export default {
	name: 'GetDetailBatchTask',
	props: ['id'],
	components: {
		SearchOptions,
		PreviewDataSet,
		Chips,
		DetailSearchOptions,
		DetailComputeOptions,
		DetailAlgorithmOptions,
	},
	setup(props) {
		const store = useStore();
		const route = useRoute();
		const tableKey = ref(1); // for re-rendering component
		const isLoading = ref(false);
		const batchTaskDetail = ref();
		const previewData = reactive({});
		const isNotification = ref(false);
		const notifications = ref([]);
		const downloadLink = computed(() => store.state.nmTask.downloadLink);
		const { errorsClasses } = useValidation();
		const btMatchingResults = computed({
			get: () => {
				if (store.state.nmTask.batchTaskDetail.ext_info.matching_result)
					return store.state.nmTask.batchTaskDetail.ext_info.matching_result.ext_info;
				return null;
			},
		});

		const gtHeaders = ref([]);
		const gtData = ref({});
		const nmData = ref({});
		const taskType = ref('Batch');
		const realTimeQueryParamArray = ref([]);
		const realTimeNameMatchingResult = computed({
			get: () => store.state.nmTask.realTimeNameMatchingResult,
		});

		const selectedGtHeader = computed({
			get: () => {
				if (store.state.nmTask.createdBatchTaskData.ext_info)
					return store.state.nmTask.createdBatchTaskData.ext_info.gt_dataset_config.search_key;
				return null;
			},
		});
		const selectedNmHeader = computed({
			get: () => {
				if (store.state.nmTask.createdBatchTaskData.ext_info)
					return store.state.nmTask.createdBatchTaskData.ext_info.nm_dataset_config.search_key;
				return null;
			},
		});
		const numberOfMatchingResult = computed({
			get: () => store.state.nmTask.createdBatchTaskData.ext_info.search_option.top_n,
			set: (number) => {
				store.commit('nmTask/SET_TASK', {
					ext_info: {
						...store.state.nmTask.createdBatchTaskData.ext_info,
						search_option: {
							...store.state.nmTask.createdBatchTaskData.ext_info.search_option,
							top_n: number,
						},
					},
				});
			},
		});
		const similarityThreshold = computed({
			get: () => store.state.nmTask.createdBatchTaskData.ext_info.search_option.threshold,
			set: (threshold) => {
				store.commit('nmTask/SET_TASK', {
					ext_info: {
						...store.state.nmTask.createdBatchTaskData.ext_info,
						search_option: {
							...store.state.nmTask.createdBatchTaskData.ext_info.search_option,
							threshold: threshold,
						},
					},
				});
			},
		});
		const selectedGtColumn = computed({
			get: () => store.state.nmTask.createdBatchTaskData.ext_info.search_option.selected_cols,
			set: (value) => {
				store.commit('nmTask/SET_TASK', {
					ext_info: {
						...store.state.nmTask.createdBatchTaskData.ext_info,
						search_option: {
							...store.state.nmTask.createdBatchTaskData.ext_info.search_option,
							selected_cols: value,
						},
					},
				});
			},
		});
		async function getTaskDetail() {
			isLoading.value = true;
			await store.dispatch('nmTask/getTask', props.id);
			batchTaskDetail.value = store.state.nmTask.batchTaskDetail;
			store.commit('nmTask/SET_BATCH_TASK_SELECTED', batchTaskDetail.value);
			store.commit('nmTask/SET_CREATED_BATCH_TASK_DATA', batchTaskDetail.value);
			if (!_.includes(batchTaskDetail.value.type, 'BATCH')) {
				taskType.value = 'Realtime';
			}
			setTimeout(() => {
				isLoading.value = false;
			}, store.state.uiTimeOut);
		}
		watch(
			() => batchTaskDetail.value,
			() => {
				const nmStatus = ['preparing', 'launching', 'terminating'];
				// TODO improve error handling
				if (
					!isNotification.value &&
					nmStatus.some((stat) => stat === batchTaskDetail.value?.ext_info.nm_status)
				) {
					setTimeout(() => {
						getTaskDetail();
					}, 10000);
				}
			}
		);
		async function getGtDataSetDetail() {
			if (batchTaskDetail.value.ext_info) {
				const gtId = batchTaskDetail.value.ext_info.gt_dataset_config.dataset_id;
				await store.dispatch('dataSet/getDataSetDetail', gtId);
				gtData.value = store.state.dataSet.dataSetDetail;
			}
		}

		async function getNmDataSetDetail() {
			if (batchTaskDetail.value.ext_info) {
				const nmId = batchTaskDetail.value.ext_info.nm_dataset_config.dataset_id;
				await store.dispatch('dataSet/getDataSetDetail', nmId);
				nmData.value = store.state.dataSet.dataSetDetail;
			}
		}
		async function runRealTimeNameMatching() {
			await store.dispatch('nmTask/nameMatchByRealTimeTask', {
				taskId: props.id,
				queryArr: realTimeQueryParamArray.value,
				searchOptions: store.state.nmTask.createdBatchTaskData.ext_info.search_option,
			});
		}

		function notificationStatus([status, notification]) {
			isNotification.value = status;
			notifications.value = notification;
		}
		function clearSearch() {
			realTimeQueryParamArray.value = [];
			store.commit('nmTask/SET_RT_QUERY_RESULT', {});
		}
		async function getDownloadLinkAndRedirect() {
			await store.dispatch('nmTask/getMatchedDataDownloadLink', props.id);
			window.location.replace(downloadLink.value);
		}

		onMounted(async () => {
			await getTaskDetail();
			await getGtDataSetDetail();
			await store.dispatch('nmTask/getCpuConfig');
			store.commit('nmTask/SET_RT_QUERY_RESULT', {});
			if (route.name === 'GetDetailBatchTask') await getNmDataSetDetail();
			gtHeaders.value = gtData.value.media ? gtData.value.media.ext_info.header : null;
		});

		return {
			route,
			tableKey,
			convertedTime,
			selectedGtColumn,
			numberOfMatchingResult,
			similarityThreshold,
			selectedGtHeader,
			selectedNmHeader,
			errorsClasses,
			gtHeaders,
			downloadLink,
			getDownloadLinkAndRedirect,
			btMatchingResults,
			clearSearch,
			runRealTimeNameMatching,
			realTimeQueryParamArray,
			isLoading,
			getTaskDetail,
			taskType,
			getGtDataSetDetail,
			getNmDataSetDetail,
			notificationStatus,
			batchTaskDetail,
			previewData,
			isNotification,
			gtData,
			nmData,
			isBatchTask: computed(() => store.state.nmTask.taskState.isBatchTask),
			realTimeNameMatchingResult,
			setSelectedGtHeader: (value) => (selectedGtHeader.value = value),
			setSelectedNmHeader: (value) => (selectedNmHeader.value = value),
			setSimilarityThreshold: (value) => (similarityThreshold.value = value),
			setNumberOfMatchingResult: (value) => (numberOfMatchingResult.value = value),
			setSelectedGtColumns: (value) => (selectedGtColumn.value = value),
		};
	},
};
</script>
<style lang="scss">
.p-chips {
	.p-chips-multiple-container {
		display: flex;
		align-items: center;
		padding: 0 2px 0 2px;
		min-height: 2rem;
		height: auto;
		width: 100% !important;
		.p-chips-token {
			height: 1.5rem;
		}
	}
}
</style>
