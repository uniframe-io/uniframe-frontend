<template>
	<div>
		<div class="advanced-algorithm tw-flex tw-flex-col tw-gap-5 tw-w-full tw-max-w-5xl">
			<div
				class="
					advanced-algorithm-switch
					tw-flex tw-flex-wrap tw-flex-1 tw-items-center tw-justify-between tw-gap-x-10
				"
			>
				<div>
					<p class="tw-font-medium">Case sensitive</p>
					<HelpGuide helpReference="advanced_algo_setup_case_sensitive" icon />
				</div>
				<InputSwitch v-model="preprocessingOptions.case_sensitive" />
			</div>
			<div class="advanced-algorithm-switch tw-flex tw-items-center tw-justify-between tw-gap-10">
				<div>
					<p class="tw-font-medium">Legal name</p>
					<HelpGuide helpReference="advanced_algo_setup_legal_name" icon />
				</div>
				<InputSwitch v-model="preprocessingOptions.company_legal_form_processing" />
			</div>
			<div class="advanced-algorithm-switch tw-flex tw-items-center tw-justify-between tw-gap-10">
				<div>
					<p class="tw-font-medium">Initial abbreviations</p>
					<HelpGuide helpReference="advanced_algo_setup_init_abbreviation" icon />
				</div>
				<InputSwitch v-model="preprocessingOptions.initial_abbr_processing" />
			</div>
			<div class="advanced-algorithm-switch tw-flex tw-items-center tw-justify-between tw-gap-10">
				<div>
					<p class="tw-font-medium">Remove punctuation</p>
					<HelpGuide helpReference="advanced_algo_setup_rm_punct" icon />
				</div>
				<InputSwitch v-model="preprocessingOptions.punctuation_removal" />
			</div>
			<div class="advanced-algorithm-switch tw-flex tw-items-center tw-justify-between tw-gap-10">
				<div>
					<p class="tw-font-medium">Normalize accent character</p>
					<HelpGuide helpReference="advanced_algo_setup_normalize_accent_char" icon />
				</div>
				<InputSwitch v-model="preprocessingOptions.accented_char_normalize" />
			</div>
			<div class="advanced-algorithm-switch tw-flex tw-items-center tw-justify-between tw-gap-10">
				<div>
					<p class="tw-font-medium">Shorthand format processing</p>
					<HelpGuide helpReference="advanced_algo_setup_shorthand" icon />
				</div>
				<InputSwitch v-model="preprocessingOptions.shorthands_format_processing" />
			</div>
			<div class="advanced-algorithm-switch tw-flex tw-items-center tw-justify-between tw-gap-10">
				<div>
					<p class="tw-font-medium">Tokenizer option</p>
					<HelpGuide helpReference="advanced_algo_setup_tokenize_option" icon />
				</div>
				<Dropdown
					v-model="selectedAlgorithmOptionTokenizer"
					:options="algorithmOptionTokenizer"
					class="algorithm-tokenizer tw-w-52 primary-drop-down"
					optionLabel="name"
					optionDisabled="optionDisabled"
					emptyMessage="Select"
				/>
			</div>

			<!-- 
			<div class="advanced-algorithm-switch tw-flex tw-items-center tw-justify-between tw-gap-10">
				<div>
					<p class="tw-font-medium">Cosine match type</p>
					<HelpGuide helpReference="advanced_algo_setup_cosine_match_type" icon />
				</div>
				<Dropdown
					v-model="selectedCosMatchType"
					:options="cosMatchType"
					class="cosine-match tw-w-52 primary-drop-down"
					optionLabel="name"
					optionDisabled="optionDisabled"
					emptyMessage="Select"
				/>
			</div>
			-->
		</div>
	</div>
</template>

<script>
import { ref, computed } from 'vue';
import { useStore } from 'vuex';
import InputSwitch from 'primevue/inputswitch';
export default {
	name: 'SetupAdvanceMatchAlgorithm',
	components: {
		InputSwitch,
	},

	// TODO code can be improved put everything in one object
	setup() {
		const store = useStore();
		const cosMatchType = ref([{ name: 'EXACT' }, { name: 'APPROXIMATE', optionDisabled: true }]);
		const selectedCosMatchType = computed({
			get: () => ({
				name: store.state.nmTask.createdBatchTaskData.ext_info.algorithm_option.value
					.cos_match_type,
			}),
			set: (selectedType) => {
				store.commit('nmTask/SET_TASK', {
					ext_info: {
						...store.state.nmTask.createdBatchTaskData.ext_info,
						algorithm_option: {
							...store.state.nmTask.createdBatchTaskData.ext_info.algorithm_option,
							value: {
								...store.state.nmTask.createdBatchTaskData.ext_info.algorithm_option.value,
								cos_match_type: selectedType.name,
							},
						},
					},
				});
			},
		});
		const algorithmOptionTokenizer = ref([{ name: 'WORD' }, { name: 'SUBWORD' }]);
		const selectedAlgorithmOptionTokenizer = computed({
			get: () => ({
				name: store.state.nmTask.createdBatchTaskData.ext_info.algorithm_option.value
					.tokenizer_option,
			}),
			set: (selectedType) => {
				store.commit('nmTask/SET_TASK', {
					ext_info: {
						...store.state.nmTask.createdBatchTaskData.ext_info,
						algorithm_option: {
							...store.state.nmTask.createdBatchTaskData.ext_info.algorithm_option,
							value: {
								...store.state.nmTask.createdBatchTaskData.ext_info.algorithm_option.value,
								tokenizer_option: selectedType.name,
							},
						},
					},
				});
			},
		});

		const algorithmOptionsType = ref([
			{ name: 'VECTOR_BASED' },
			{ name: 'EDIT_DISTANCE', optionDisabled: true },
		]);
		const selectedAlgorithmOptionType = computed({
			get: () => ({
				name: store.state.nmTask.createdBatchTaskData.ext_info.algorithm_option.type,
			}),
			set: (selectedType) => {
				store.commit('nmTask/SET_TASK', {
					ext_info: {
						...store.state.nmTask.createdBatchTaskData.ext_info,
						algorithm_option: {
							...store.state.nmTask.createdBatchTaskData.ext_info.algorithm_option,
							type: selectedType.name,
						},
					},
				});
			},
		});

		const preprocessingOptions = computed({
			get: () =>
				store.state.nmTask.createdBatchTaskData.ext_info.algorithm_option.value
					.preprocessing_option,
			set: (preprocessingOptionsNewValue) => {
				store.commit('nmTask/SET_TASK', {
					ext_info: {
						...store.state.nmTask.createdBatchTaskData.ext_info,
						algorithm_option: {
							...store.state.nmTask.createdBatchTaskData.ext_info.algorithm_option,
							value: {
								...store.state.nmTask.createdBatchTaskData.ext_info.algorithm_option.value,
								preprocessing_option: {
									case_sensitive: preprocessingOptionsNewValue.case_sensitive,
									company_legal_form_processing:
										preprocessingOptionsNewValue.companyLegalFormProcessing,
									initial_abbr_processing: preprocessingOptionsNewValue.initial_abbr_processing,
									punctuation_removal: preprocessingOptionsNewValue.punctuation_removal,
									accented_char_normalize: preprocessingOptionsNewValue.accented_char_normalize,
									shorthands_format_processing:
										preprocessingOptionsNewValue.shorthands_format_processing,
								},
							},
						},
					},
				});
			},
		});

		return {
			algorithmOptionsType,
			selectedAlgorithmOptionType,
			preprocessingOptions,
			algorithmOptionTokenizer,
			selectedAlgorithmOptionTokenizer,
			cosMatchType,
			selectedCosMatchType,
		};
	},
};
</script>
<style lang="scss">
@import '@/style/config';

.advanced-algorithm-switch {
	.p-inputswitch,
	.p-inputswitch-slider {
		height: 1.25rem;
		width: 3rem;
	}
	.p-inputswitch .p-inputswitch-slider:before {
		height: 1.125rem;
		width: 1.125rem;
		margin-top: -0.5625rem;
	}
}
</style>
