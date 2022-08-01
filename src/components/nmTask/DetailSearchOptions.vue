<template>
	<div
		v-if="batchTaskDetail.ext_info"
		class="
			tw-w-full
			main-container
			tw-flex tw-flex-col tw-gap-4 tw-justify-center tw-border tw-border-gray tw-shadow-md
		"
	>
		<CardHeader
			title="Setup search options"
			showHelp
			helpReference="matching_options"
			class="tw-px-5 tw-py-1 tw-h-auto tw-bg-tableTitle tw-border-b tw-border-gray"
		/>
		<div class="tw-p-5 tw-flex tw-flex-col tw-items-start tw-gap-5 tw-font-medium">
			<div class="detail-search-option-items">
				<p>Number of matching results</p>
				<p class="tw-text-sm tw-font-medium tw-w-5/12">
					{{ batchTaskDetail.ext_info.search_option.top_n }}
				</p>
			</div>
			<div class="detail-search-option-items">
				<p>Similarity threshold</p>
				<p class="tw-text-sm tw-font-medium tw-w-5/12">
					{{ batchTaskDetail.ext_info.search_option.threshold }}
				</p>
			</div>
			<div class="detail-search-option-items">
				<p>Selected columns from ground truth dataSet</p>
				<p class="tw-text-sm tw-font-medium tw-w-5/12">
					{{
						batchTaskDetail.ext_info.search_option.selected_cols.length === 0
							? 'none'
							: batchTaskDetail.ext_info.search_option.selected_cols
					}}
				</p>
			</div>
		</div>
	</div>
</template>

<script>
import { useStore } from 'vuex';
import { computed } from 'vue';
export default {
	name: 'DetailSearchOptions',
	components: {},
	setup() {
		const store = useStore();

		return {
			batchTaskDetail: computed(() => store.state.nmTask.batchTaskDetail),
		};
	},
};
</script>

<style lang="scss" scoped></style>
