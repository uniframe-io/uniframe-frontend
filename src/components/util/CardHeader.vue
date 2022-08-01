<template>
	<header class="tw-flex tw-items-center tw-justify-between tw-mb-2">
		<div class="tw-text-black tw-flex tw-flex-col tw-items-start tw-justify-center tw-w-4/6">
			<h1 class="h4-bold tw-w-full">{{ title }}</h1>
			<HelpGuide v-if="showHelp" :helpReference="helpReference" />
		</div>
		<div class="tw-self-end tw-flex tw-justify-end tw-w-2/6">
			<DataSetButtons
				v-if="showDatasetButtons"
				@reset="$emit('reset')"
				@updateDataSet="$emit('updateDataSet')"
			/>
			<TaskButtons
				v-if="showTaskButtons"
				@reset="$emit('reset')"
				@updateTaskList="$emit('updateTaskList')"
			/>
		</div>
	</header>
</template>

<script>
import DataSetButtons from '@/components/dataSet/BtnService.vue';
import TaskButtons from '@/components/nmTask/BtnService.vue';
export default {
	components: {
		DataSetButtons, //renamed BtnServices in dataSet
		TaskButtons, //renamed BtnServices in nmTask
	},
	emits: ['updateTaskList', 'reset', 'updateDataSet'],
	props: {
		title: { type: String, required: true },
		helpReference: {
			type: String,
			default: 'defaultHelp',
			required: false,
		},
		showHelp: {
			type: Boolean,
			default: false,
		},
		showDatasetButtons: {
			type: Boolean,
			default: false,
		},
		showTaskButtons: {
			type: Boolean,
			default: false,
		},
	},
	setup() {
		return {};
	},
};
</script>
