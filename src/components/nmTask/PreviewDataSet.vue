<template>
	<Accordion
		@tab-open="$emit('openTab')"
		:activeIndex="
			route.name === 'BatchTaskCreate' || route.name === 'RealTimeTaskCreate' ? 0 : null
		"
	>
		<AccordionTab>
			<template #header>
				<CardHeader
					:title="`${title}: ${preview.name ? preview.name : 'Click to see detail'}`"
					class="tw-w-full"
					:showHelp="showHelp"
					:helpReference="helpReference"
				/>
			</template>
			<div
				v-if="reference === 'groundTruth'"
				class="tw-flex tw-items-center tw-justify-between tw-gap-20 tw-font-medium tw-p-2"
			>
				<div class="tw-flex tw-items-center tw-gap-10">
					<p>
						{{
							route.name !== 'BatchTaskCreate' && route.name !== 'RealTimeTaskCreate'
								? 'Selected search key for ground truth dataSet'
								: 'Please select search key for ground truth dataSet'
						}}
					</p>
				</div>
				<Dropdown
					@change="$emit('selected-gt-header', selectedGtHeader)"
					v-model="selectedGtHeader"
					:options="gtHeaders"
					:placeholder="gtPlaceholder"
					display="chip"
					class="tw-w-64 primary-drop-down"
					:class="errorsClasses.search_key_gt"
					emptyMessage="Select Groundtruth DataSet"
					:disabled="route.name !== 'BatchTaskCreate' && route.name !== 'RealTimeTaskCreate'"
					ref="gtDropdown"
				/>
			</div>
			<div
				v-if="reference === 'nameMatching'"
				class="tw-flex tw-items-center tw-justify-between tw-gap-20 tw-font-medium tw-p-2"
			>
				<div class="tw-flex tw-items-center tw-gap-10">
					<p>
						{{
							route.name !== 'BatchTaskCreate' && route.name !== 'RealTimeTaskCreate'
								? 'Selected search key for string matching dataSet'
								: 'Please select search key for string matching dataSet'
						}}
					</p>
				</div>
				<Dropdown
					@change="$emit('selected-nm-header', selectedNmHeader)"
					v-model="selectedNmHeader"
					:options="nmHeaders"
					:placeholder="nmPlaceholder"
					display="chip"
					id="detail-dropdown"
					emptyMessage="Select string matching dataSet"
					:class="errorsClasses.search_key_nm"
					class="tw-w-64 primary-drop-down"
					:disabled="route.name !== 'BatchTaskCreate' && route.name !== 'RealTimeTaskCreate'"
					ref="nmDropdown"
				/>
			</div>

			<UploadPreviewData
				:selectedGtHeader="selectedGtHeader || gtPlaceholder"
				:selectedNmHeader="selectedNmHeader || nmPlaceholder"
				:tableData="preview"
			/>
		</AccordionTab>
	</Accordion>
</template>

<script>
import Accordion from 'primevue/accordion';
import AccordionTab from 'primevue/accordiontab';
import UploadPreviewData from '@/components/dataSet/UploadPreviewData.vue';

import { watch, ref, reactive } from 'vue';
import { useRoute } from 'vue-router';
import * as _ from 'lodash';

export default {
	components: {
		Accordion,
		AccordionTab,
		UploadPreviewData,
	},
	props: {
		previewData: {
			type: Object,
			required: true,
		},
		title: {
			type: String,
			required: true,
		},
		errorsClasses: {
			type: Object,
			required: true,
		},
		reference: {
			type: String,
			required: true,
		},
		nmHeaders: {
			type: Array,
		},
		gtHeaders: {
			type: Array,
		},
		nmPlaceholder: {
			type: String, //"Select String Matching Header"
		},
		gtPlaceholder: {
			type: String, //"Select Groundtruth Header"
		},
		showHelp: {
			type: Boolean,
			default: false,
		},
		helpReference: {
			type: String,
			default: 'defaultHelp',
		},
	},

	setup(props) {
		const route = useRoute();
		const data = ref({});
		const gtDropdown = ref();
		const nmDropdown = ref();
		const preview = reactive({
			name: '',
		});
		const selectedGtHeader = ref(null);
		const selectedNmHeader = ref(null);

		watch(
			() => props.previewData,
			async () => {
				selectedGtHeader.value = null;
				selectedNmHeader.value = null;
				if (!_.isEmpty(props.previewData)) {
					data.value = props.previewData;
					preview.name = data.value.name;
					preview.id = data.value.id;
					preview.ownerId = data.value.owner_id;
					preview.row = await JSON.parse(data.value.media.ext_info.first_n_rows);
					preview.header = data.value.media.ext_info.header;
				}
				//Setting focus and animation for dataset dropdown
				gtDropdown.value && gtDropdown.value.$el.children[0].children[0].focus();
				nmDropdown.value && nmDropdown.value.$el.children[0].children[0].focus();
				setTimeout(() => {
					if (route.name !== 'GetDetailRealTime' && route.name !== 'GetDetailBatchTask') {
						gtDropdown.value &&
							gtDropdown.value.$el.classList.add('animate__animated', 'animate__bounceIn');
						nmDropdown.value &&
							nmDropdown.value.$el.classList.add('animate__animated', 'animate__bounceIn');
					}
				}, 1000);
				setTimeout(() => {
					if (route.name !== 'GetDetailRealTime' && route.name !== 'GetDetailBatchTask') {
						gtDropdown.value &&
							gtDropdown.value.$el.classList.remove('animate__animated', 'animate__bounceIn');
						nmDropdown.value &&
							nmDropdown.value.$el.classList.remove('animate__animated', 'animate__bounceIn');
					}
				}, 3000);
			},
			{ deep: true, immediate: true }
		);
		return {
			gtDropdown,
			nmDropdown,
			preview,
			selectedGtHeader,
			selectedNmHeader,
			route,
		};
	},
};
</script>
<style lang="scss">
#detail-dropdown {
	cursor: not-allowed !important;
}
</style>
