<template>
	<div>
		<div class="tw-flex tw-flex-col tw-max-w-5xl tw-gap-5">
			<div class="tw-flex tw-justify-between tw-w-full tw-items-center tw-gap-10">
				<div class="tw-flex-col tw-flex">
					<p class="tw-font-medium">Number of matching results <small>(between 1 - 3)</small></p>
					<HelpGuide class="help" helpReference="matching_options_topn" icon />
				</div>
				<Dropdown
					class="tw-w-20 primary-drop-down search-option-number-drop-down"
					@change="$emit('number-input', numberOfMatchingResult)"
					v-model="numberOfMatchingResult"
					:options="numberOfMatchingResultsArray"
				/>
			</div>
			<div class="tw-flex tw-justify-between tw-w-full tw-items-center tw-gap-10">
				<div class="tw-flex-col tw-flex">
					<p class="tw-font-medium">Similarity threshold <small>(between 0-0.99)</small></p>
					<HelpGuide helpReference="matching_options_threshold" icon />
				</div>
				<div class="tw-flex tw-items-center tw-justify-center tw-gap-x-4 tw-h-16">
					<Slider
						v-model="sliderValue"
						:step="5"
						:min="1"
						:max="99"
						@change="$emit('similarity-threshold', similarityThreshold)"
						class="tw-w-52"
					/>
					<div class="tw-relative">
						<InputNumber
							mode="decimal"
							:minFractionDigits="2"
							:maxFractionDigits="2"
							v-model.number="similarityThreshold"
							:min="0"
							:max="0.99"
							inputStyle="width: 5rem"
							class="similarity-number"
							:class="{
								'p-invalid show-error': similarityThreshold <= 0.001 && similarityThreshold !== 0,
							}"
							@change="$emit('similarity-threshold', similarityThreshold)"
						/>
					</div>
				</div>
			</div>
			<div class="tw-flex tw-justify-between tw-w-full tw-items-center tw-gap-10">
				<div>
					<p class="tw-font-medium">Select columns from ground truth dataSet</p>
					<HelpGuide helpReference="matching_options_extra_columns" icon />
				</div>
				<MultiSelect
					@change="$emit('selected-gt-Columns', selectedGtColumns)"
					v-model="selectedGtColumns"
					:options="gtHeaders"
					display="chip"
					:placeholder="gtColPlaceholder"
					class="tw-text-sm tw-rounded-lg select-gt-column tw-border-primaryColor tw-h-9"
				/>
			</div>
		</div>
	</div>
</template>

<script>
import MultiSelect from 'primevue/multiselect';
import InputNumber from 'primevue/inputnumber';
import Slider from 'primevue/slider';
import { ref, computed } from 'vue';
import { useStore } from 'vuex';

export default {
	name: 'SearchOptions',
	components: {
		Slider,
		MultiSelect,
		InputNumber,
	},
	props: {
		matchNumber: {
			type: Number,
		},
		threshold: {
			type: Number,
		},
		nmHeaders: {
			type: Array,
		},
		gtHeaders: {
			type: Array,
			required: true,
		},
		nmPlaceholder: {
			type: String, //"Select String Matching Header"
		},
		gtPlaceholder: {
			type: String, //"Select Groundtruth Header"
		},
		gtColPlaceholder: {
			type: String, //"Select Groundtruth Header"
		},
		preSelectedGtColumns: {
			type: Array,
		},
		errorsClasses: {
			type: Object,
			required: true,
		},
	},

	setup(props) {
		const store = useStore();
		const selectedGtHeader = ref(null);
		const selectedNmHeader = ref(null);
		//TODO: the value must match stor value
		const numberOfMatchingResult = ref(props.matchNumber || 1);
		//TODO: the value must match stor value
		const similarityThreshold = ref(props.threshold || 0.5);
		const selectedGtColumns = ref(props.preSelectedGtColumns || []);
		const numberOfMatchingResultsArray = [1, 2, 3];
		const sliderValue = computed({
			get: () => similarityThreshold.value * 100,
			set: (convertedThreshold) => (similarityThreshold.value = convertedThreshold / 100),
		});

		return {
			numberOfMatchingResultsArray,
			sliderValue,
			numberOfMatchingResult,
			selectedGtHeader,
			selectedNmHeader,
			similarityThreshold,
			selectedGtColumns,
			props,
			isBatchTask: computed(() => store.state.nmTask.taskState.isBatchTask),
		};
	},
};
</script>
<style lang="scss">
@import '../../style/config';
.similarity-number .p-inputtext {
	color: $primaryColor;
}
.p-slider {
	height: 3px !important;
}
.select-gt-column {
	.p-multiselect-label,
	.p-placeholder,
	.p-multiselect-trigger {
		color: $primaryColor !important;
	}

	display: flex;
	align-items: center;
	justify-content: center;
}
.show-error {
	&::after {
		position: absolute;
		top: -1.5rem;
		left: -4.5rem;
		width: 10rem;
		content: 'Please enter valid Number';
		color: $dangerColor;
		font-size: 0.8rem;
	}
}
</style>
