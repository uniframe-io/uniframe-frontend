<template>
	<div class="tw-w-full tw-p-4 tw-flex tw-flex-col">
		<div class="tw-flex tw-flex-col">
			<div id="basic-info" class="tw-h-auto">
				<CardHeader
					:title="`Create ${titleName} Task`"
					showHelp
					showTaskButtons
					:helpReference="isBatchTask ? 'batch_matching_task_create' : 'rt_matching_task_create'"
				/>
			</div>
			<Notification loc="createNameMatchingTask" class="tw-fixed tw-top-10 tw-z-10 tw-w-4/5" />
			<div class="tw-w-full tw-min-h-screen tw-flex tw-flex-col tw-gap-5">
				<div class="tw-relative" :class="errorsClasses.name || errorsClasses.description">
					<BatchTaskBasicInfo number="1. " />
				</div>
				<div
					class="
						w-full
						tw-relative tw-flex tw-flex-col tw-justify-center tw-border tw-border-gray tw-shadow-md
					"
					id="gt-dataset"
					:class="errorsClasses.gt_dataset_id"
				>
					<div
						v-if="!isFormValid"
						class="
							tw-absolute tw-inset-0 tw-z-10 tw-bg-white tw-bg-opacity-60 tw-cursor-not-allowed
						"
					></div>
					<div id="gt-dataset" class="tw-h-20">
						<CardHeader
							showHelp
							helpReference="matching_task_select_gt_dataset"
							class="gray-card-header"
							title="2. Select Groundtruth DataSet"
						/>
					</div>

					<DataSetTable :key="tableKey" disabled reference="groundTruth" :showAction="false" />
					<div class="tw-relative tw-py-3" v-show="gtHeaders.length !== 0">
						<PreviewDataSet
							:key="tableKey"
							id="ground-truth-dataset"
							@selected-gt-header="setSelectedGtHeader"
							reference="groundTruth"
							:errorsClasses="errorsClasses"
							title="Groundtruth DataSet"
							v-show="gtHeaders.length !== 0"
							:previewData="gtData"
							:gtHeaders="gtHeaders"
							gtColPlaceholder="Select Groundtruth Header"
							gtPlaceholder="Select Groundtruth Header"
						/>
					</div>
				</div>

				<div
					v-if="isBatchTask"
					class="
						w-full
						tw-relative tw-flex tw-flex-col tw-justify-center tw-border tw-border-gray tw-shadow-md
					"
					id="nm-dataset"
					:class="errorsClasses.nm_dataset_id"
				>
					<div
						v-if="!isFormValid"
						class="
							tw-absolute tw-inset-0 tw-z-10 tw-bg-white tw-bg-opacity-60 tw-cursor-not-allowed
						"
					></div>
					<div class="tw-h-20">
						<CardHeader
							showHelp
							helpReference="matching_task_select_matching_dataset"
							class="gray-card-header"
							title="3. Select Matching DataSet"
						/>
					</div>
					<DataSetTable :key="tableKey" reference="nameMatching" :showAction="false" />
					<div class="tw-relative tw-py-10" v-show="nmHeaders.length !== 0">
						<PreviewDataSet
							:key="tableKey"
							id="name-matching-dataset"
							@selected-nm-header="setSelectedNmHeader"
							reference="nameMatching"
							:errorsClasses="errorsClasses"
							title="Matching DataSet"
							v-show="nmHeaders.length !== 0"
							:previewData="nmData"
							:nmHeaders="nmHeaders"
							gtColPlaceholder="Select Groundtruth Header"
							nmPlaceholder="Select Matching Header"
						/>
					</div>
				</div>
				<div
					class="
						w-full
						tw-relative tw-flex tw-flex-col tw-justify-center tw-border tw-border-gray tw-shadow-md
					"
					id="search-options"
				>
					<div
						v-if="!isSearchKeySelected"
						class="
							tw-absolute tw-inset-0 tw-z-10 tw-bg-white tw-bg-opacity-60 tw-cursor-not-allowed
						"
					></div>
					<div class="tw-h-20">
						<CardHeader
							showHelp
							helpReference="matching_options"
							class="gray-card-header"
							:title="isBatchTask ? '4. Setup search options' : '3. Setup search options'"
						/>
					</div>
					<SearchOptions
						:errorsClasses="errorsClasses"
						class="tw-p-5 tw-shadow"
						@selected-gt-header="setSelectedGtHeader"
						@selected-nm-header="setSelectedNmHeader"
						@number-input="setNumberOfMatchingResult"
						@similarity-threshold="setSimilarityThreshold"
						@selected-gt-Columns="setSelectedGtColumns"
						:threshold="similarityThreshold"
						:gtHeaders="gtHeaders"
						:nmHeaders="nmHeaders"
						gtColPlaceholder="Select Groundtruth Header"
						nmPlaceholder="Select Matching Header"
						gtPlaceholder="Select Groundtruth Header"
					/>
				</div>
				<div
					class="
						w-full
						tw-relative tw-flex tw-flex-col tw-justify-center tw-border tw-border-gray tw-shadow-md
					"
				>
					<div
						v-if="!isSearchKeySelected"
						class="
							tw-absolute tw-inset-0 tw-z-10 tw-bg-white tw-bg-opacity-60 tw-cursor-not-allowed
						"
					></div>
					<div class="tw-h-20">
						<CardHeader
							showHelp
							helpReference="computation_setup"
							class="gray-card-header"
							:title="isBatchTask ? '5. Computation Setup' : '4. Computation Setup'"
						/>
					</div>
					<ComputationOptions class="tw-p-5" />
				</div>
				<div class="tw-relative">
					<div
						v-if="!isSearchKeySelected"
						class="
							tw-absolute tw-inset-0 tw-z-10 tw-bg-white tw-bg-opacity-60 tw-cursor-not-allowed
						"
					></div>
					<Accordion class="algorithm tw-border tw-border-gray tw-shadow-md tw-h-auto">
						<AccordionTab>
							<template #header>
								<div class="tw-flex tw-flex-col tw-gap-0 tw-w-full tw-h-auto">
									<CardHeader
										showHelp
										helpReference="advanced_algo_setup"
										:title="isBatchTask ? '6. Advanced algorithm setup' : '5. Advanced algorithm setup'"
										class="tw-text-sm"
									/>
								</div>
							</template>
							<SetupAdvanceMatchAlgorithm />
						</AccordionTab>
					</Accordion>
				</div>
				<div class="tw-relative" id="privacy">
					<div
						v-if="!isSearchKeySelected"
						class="
							tw-absolute tw-inset-0 tw-z-10 tw-bg-white tw-bg-opacity-60 tw-cursor-not-allowed
						"
					></div>
				</div>
				<div class="btn-wrapper tw-w-full">
					<div class="tw-float-right tw-flex tw-justify-around tw-w-1/3">
						<Button
							label="Cancel"
							icon=""
							type="button"
							class="btn-primary-hollow tw-w-32"
							iconPos="right"
							@click="resetForm"
						/>
						<Button
							:label="`Create ${isBatchTask ? 'Batch' : 'Realtime'} Task`"
							icon=""
							type="button"
							class="btn-primary btn-primary-gradient tw-w-48 tw-ml-6"
							iconPos="right"
							@click="submit"
							:disabled="!isSearchKeySelected || !isFormValid"
						/>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import useValidation from '@/helpers/createdBatchTaskDataValidator';

import BatchTaskBasicInfo from '@/components/nmTask/BasicInfo.vue';
import PreviewDataSet from '@/components/nmTask/PreviewDataSet.vue';
import DataSetTable from '@/components/dataSet/DataSetTable.vue';
import Notification from '@/components/Notification';
import SearchOptions from '@/components/nmTask/SearchOptions.vue';
import ComputationOptions from '@/components/nmTask/ComputationOptions.vue';
import SetupAdvanceMatchAlgorithm from '@/components/nmTask/SetupAdvanceMatchAlgorithm';

import { ref, computed, watch, onMounted } from 'vue';
import { useStore } from 'vuex';
import { useRouter, useRoute, onBeforeRouteLeave } from 'vue-router';
import _ from 'lodash';

import Accordion from 'primevue/accordion';
import AccordionTab from 'primevue/accordiontab';
export default {
	name: 'BatchTaskCreate',
	components: {
		PreviewDataSet,
		// SetupAdvancePrivacy,
		SetupAdvanceMatchAlgorithm,
		Accordion,
		AccordionTab,
		Notification,
		BatchTaskBasicInfo,
		DataSetTable,
		SearchOptions,
		ComputationOptions,
	},
	async setup() {
		const store = useStore();
		const router = useRouter();
		const route = useRoute();
		const tableKey = ref(1); // for re-rendering component
		const gtData = ref({}); // this is for preview section
		const nmData = ref({}); // this is for preview section
		// this flag is for enable and disable dataset and search options
		const isFormValid = computed(() => store.state.nmTask.isFormValid);
		const isSearchKeySelected = computed(() => {
			if (isBatchTask.value) {
				if (!!selectedGtHeader.value && !!selectedNmHeaders.value) return true;
				return false;
			} else {
				if (selectedGtHeader.value) return true;
				return false;
			}
		});
		const isBatchTask = computed({
			get: () => store.state.nmTask.taskState.isBatchTask,
			set: (value) => store.commit('nmTask/SET_IS_BATCH_TASK', value),
		});
		const titleName = computed(() => store.state.nmTask.taskState.title);
		const resetBatchData = computed(() => store.state.nmTask.batchConfigData);
		const resetRealTimeData = computed(() => store.state.nmTask.realTimeConfigData);
		const { errors, errorsClasses, resetErrors, validateArr, showToastAndScroll } = useValidation();

		//TODO it is a temporary debug for not showing create batch task after real time detail page
		resetForm();

		onMounted(async () => {
			route.name === 'BatchTaskCreate' ? (isBatchTask.value = true) : (isBatchTask.value = false);
			//creating rest objects
			store.commit(
				'nmTask/SET_TASK',
				isBatchTask.value
					? store.state.nmTask.batchConfigData
					: store.state.nmTask.realTimeConfigData
			);

			//resetting form onMounted
			resetForm();
		});
		onBeforeRouteLeave(() => {
			if (isSearchKeySelected.value || isFormValid.value) {
				const answer = window.confirm('Do you really want to leave? you have unsaved changes!');
				if (answer) return;
				return false;
			}
		});
		function resetForm() {
			if (isBatchTask.value) store.commit('nmTask/SET_TASK', { ...resetBatchData.value });
			if (!isBatchTask.value) {
				store.commit('nmTask/SET_TASK', { ...resetRealTimeData.value });
			}
			store.commit('nmTask/SET_SELECTED_GROUND_TRUTH_DATASET', []);
			store.commit('nmTask/SET_SELECTED_NAME_MATCHING_DATASET', []);
			gtData.value = {};
			nmData.value = {};
			//TODO change it to vue scroll
			document.body.scrollTop = 0; // For Safari
			document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
			tableKey.value++;
			resetErrors();
		}
		//Watchers
		//this watch is for preview Groundtruth
		watch(
			() => store.state.nmTask.groundTruthDatasetSelected,
			async () => {
				if (!_.isEmpty(store.state.nmTask.groundTruthDatasetSelected)) {
					gtData.value = store.state.nmTask.groundTruthDatasetSelected;
				}
			},
			{ deep: true, immediate: true }
		);
		//this watch is for preview String Matching
		watch(
			() => store.state.nmTask.nameMatchingDatasetSelected,
			async () => {
				nmData.value = store.state.nmTask.nameMatchingDatasetSelected;
			}
		);
		await store.dispatch('nmTask/getUiPermission');
		await store.dispatch('nmTask/getCpuConfig');
		await store.dispatch('nmTask/getBatchConfig');
		await store.dispatch('nmTask/getRealTimeConfig'); //creating rest objects
		store.commit(
			'nmTask/SET_TASK',
			isBatchTask.value ? store.state.nmTask.batchConfigData : store.state.nmTask.realTimeConfigData
		);
		//TODO Add validation to submit
		function validationArr() {
			let errorArr = [];
			validateArr.value.forEach((element) => {
				element(store.state.nmTask.createdBatchTaskData);
			});
			for (const [error, val] of Object.entries(errors.value)) {
				if (val) {
					errorArr.push(error);
				}
			}

			return errorArr;
		}
		function submit() {
			resetErrors();
			let arr = validationArr();
			arr.length && showToastAndScroll(arr[0]);
			if (arr.length === 0) {
				store.commit('SET_BLOCKUI_VALUE', true);
				store.dispatch('nmTask/createNameMatchingTask', store.state.nmTask.createdBatchTaskData);
				setTimeout(() => {
					isBatchTask.value
						? router.push({ name: 'BatchTaskList' })
						: router.push({ name: 'RealTimeTaskList' });
					store.commit('SET_BLOCKUI_VALUE', false);
				}, store.state.uiTimeOut);
				resetForm();
			}
		}
		//Here I am binding these values with store main object
		const computationType = ref([
			{ name: 'multi-thread' },
			{ name: 'single-tread', optionDisabled: true },
		]);
		const selectedComputationType = computed({
			//this logic is for adapting to primevue object in order to
			// show proper view
			get: () => {
				return {
					name: store.state.nmTask.createdBatchTaskData.ext_info.computation_resource
						.computation_type,
				};
			},

			set: (selectedType) => {
				store.commit('nmTask/SET_TASK', {
					ext_info: {
						...store.state.nmTask.createdBatchTaskData.ext_info,
						computation_resource: {
							...store.state.nmTask.createdBatchTaskData.ext_info.computation_resource,
							computation_type: selectedType.name,
						},
					},
				});
			},
		});
		//TODO check this section
		const selectedGtHeader = computed({
			get: () => store.state.nmTask.createdBatchTaskData.ext_info.gt_dataset_config.search_key,
			set: (selectedHeader) => {
				store.commit('nmTask/SET_TASK', {
					ext_info: {
						...store.state.nmTask.createdBatchTaskData.ext_info,
						gt_dataset_config: {
							...store.state.nmTask.createdBatchTaskData.ext_info.gt_dataset_config,
							search_key: selectedHeader,
						},
					},
				});
			},
		});
		const selectedNmHeaders = computed({
			get: () => store.state.nmTask.createdBatchTaskData.ext_info.nm_dataset_config.search_key,
			set: (selectedHeader) => {
				store.commit('nmTask/SET_TASK', {
					ext_info: {
						...store.state.nmTask.createdBatchTaskData.ext_info,
						nm_dataset_config: {
							...store.state.nmTask.createdBatchTaskData.ext_info.nm_dataset_config,
							search_key: selectedHeader,
						},
					},
				});
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

		return {
			tableKey,
			store,
			isFormValid,
			isSearchKeySelected,
			isBatchTask,
			titleName,
			validationArr,
			gtData,
			nmData,
			errors,
			errorsClasses,
			selectedGtHeader,
			selectedNmHeaders,
			numberOfMatchingResult,
			similarityThreshold,
			selectedGtColumn,
			computationType,
			selectedComputationType,
			submit,
			resetForm,
			setSelectedGtHeader: (value) => (selectedGtHeader.value = value),
			setSelectedNmHeader: (value) => (selectedNmHeaders.value = value),
			setNumberOfMatchingResult: (value) => (numberOfMatchingResult.value = value),
			setSimilarityThreshold: (value) => (similarityThreshold.value = value),
			setSelectedGtColumns: (value) => (selectedGtColumn.value = value),
			isDetailView: computed(() => store.state.nmTask.isDetailView),
			isInfoView: computed(() => store.state.nmTask.isInfoView),
			gtHeaders: computed(() => {
				//this value can't be undefined
				//gt_dataset_id will set in "DataStTable" component when selected
				if (!_.isEmpty(store.state.nmTask.groundTruthDatasetSelected)) {
					return store.state.nmTask.groundTruthDatasetSelected.media.ext_info.header;
				}
				return [];
			}),
			nmHeaders: computed(() => {
				//this value can't be undefined
				//nm_dataset_id will set in "DataStTable" component when selected
				if (!_.isEmpty(store.state.nmTask.nameMatchingDatasetSelected)) {
					return store.state.nmTask.nameMatchingDatasetSelected.media.ext_info.header;
				}
				return [];
			}),
		};
	},
};
</script>
