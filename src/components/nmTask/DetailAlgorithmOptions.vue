<template>
	<div v-if="batchTaskDetail.ext_info" class="tw-relative main-container">
		<Accordion>
			<AccordionTab>
				<template #header>
					<CardHeader
						title="Algorithm options"
						class="tw-w-full"
						showHelp
						helpReference="advanced_algo_setup"
					/>
				</template>

				<div
					class="
						tw-flex tw-flex-col tw-items-start tw-font-medium tw-gap-5 tw-w-full tw-font-medium
					"
				>
					<div class="detail-search-option-items">
						<p>Algorithm type</p>
						<p class="tw-text-sm tw-font-medium tw-w-5/12">
							{{ batchTaskDetail.ext_info.algorithm_option.type }}
						</p>
					</div>
					<div class="detail-search-option-items">
						<p>Case sensitive</p>
						<p class="tw-text-sm tw-font-medium tw-w-5/12">
							{{
								batchTaskDetail.ext_info.algorithm_option.value.preprocessing_option.case_sensitive
									? 'Yes'
									: 'No'
							}}
						</p>
					</div>
					<div class="detail-search-option-items">
						<p>Legal name</p>
						<p class="tw-text-sm tw-font-medium tw-w-5/12">
							{{
								batchTaskDetail.ext_info.algorithm_option.value.preprocessing_option
									.company_legal_form_processing
									? 'Yes'
									: 'No'
							}}
						</p>
					</div>
					<div class="detail-search-option-items">
						<p>Initial abbreviations</p>
						<p class="tw-text-sm tw-font-medium tw-w-5/12">
							{{
								batchTaskDetail.ext_info.algorithm_option.value.preprocessing_option
									.initial_abbr_processing
									? 'Yes'
									: 'NO'
							}}
						</p>
					</div>
					<div class="detail-search-option-items">
						<p>Remove punctuation</p>
						<p class="tw-text-sm tw-font-medium tw-w-5/12">
							{{
								batchTaskDetail.ext_info.algorithm_option.value.preprocessing_option
									.punctuation_removal
									? 'Yes'
									: 'NO'
							}}
						</p>
					</div>
					<div class="detail-search-option-items">
						<p>Normalize accent character</p>
						<p class="tw-text-sm tw-font-medium tw-w-5/12">
							{{
								batchTaskDetail.ext_info.algorithm_option.value.preprocessing_option
									.accented_char_normalize
									? 'Yes'
									: 'NO'
							}}
						</p>
					</div>
					<div class="detail-search-option-items">
						<p>Shorthand format processing</p>
						<p class="tw-text-sm tw-font-medium tw-w-5/12">
							{{
								batchTaskDetail.ext_info.algorithm_option.value.preprocessing_option
									.shorthands_format_processing
									? 'Yes'
									: 'NO'
							}}
						</p>
					</div>
					<div class="detail-search-option-items">
						<p>Tokenizer option</p>
						<p class="tw-text-sm tw-font-medium tw-w-5/12">
							{{ batchTaskDetail.ext_info.algorithm_option.value.tokenizer_option }}
						</p>
					</div>
					<!-- 
									<div class="detail-search-option-items">
										<p>Cosine match type</p>
										<p class="tw-text-sm tw-font-medium tw-w-5/12">
											{{ batchTaskDetail.ext_info.algorithm_option.value.cos_match_type }}
										</p>
									</div>
					 -->
				</div>
			</AccordionTab>
		</Accordion>
	</div>
</template>

<script>
import Accordion from 'primevue/accordion';
import AccordionTab from 'primevue/accordiontab';
import { useStore } from 'vuex';
import { computed } from 'vue';
export default {
	name: 'DetailAlgorithmOptions',
	components: {
		Accordion,
		AccordionTab,
	},
	setup() {
		const store = useStore();

		return {
			batchTaskDetail: computed(() => store.state.nmTask.batchTaskDetail),
		};
	},
};
</script>

<style lang="scss" scoped></style>
