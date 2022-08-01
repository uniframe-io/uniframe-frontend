<template>
	<div class="tw-w-full tw-p-4 tw-flex tw-flex-col tw-pb-9">
		<Notification loc="editDataSet" goTo="DataSetList" />
		<div class="tw-h-auto">
			<CardHeader
				title="Edit dataSet details"
				helpReference="dataset_edit"
				showHelp
				showDatasetButtons
			/>
		</div>
		<div
			class="
				tw-w-full
				main-container
				tw-flex tw-flex-col tw-gap-4 tw-justify-center tw-border tw-border-gray tw-shadow-md
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
				<div class="tw-flex tw-flex-col tw-h-auto tw-gap-2">
					<p class="tw-font-bold">Dataset Name</p>
					<InputText
						@input="formUploadCheck('name')"
						@blur="formUploadCheck('name') && formUploadCheck('description')"
						name="name"
						class="tw-w-2/3"
						v-model="formData.name"
					/>
					<div class="tw-h-3">
						<small
							v-if="errors.name"
							class="tw-text-xs tw-px-0 tw-font-medium tw-text-dangerColor"
							>{{ errors.name }}</small
						>
					</div>
				</div>
				<div class="tw-flex tw-flex-col tw-h-auto tw-gap-2">
					<p class="tw-font-bold">File type</p>
					<span class="tw-flex tw-text-left">{{ dataSetDetail.fileType }}</span>
				</div>
				<div class="tw-flex tw-flex-col tw-h-auto tw-gap-2">
					<p class="tw-font-bold">Location</p>
					<span class="tw-flex tw-text-left">{{ dataSetDetail.na }}</span>
				</div>
				<div class="tw-flex tw-flex-col tw-h-auto tw-gap-2">
					<p class="tw-font-bold">Description</p>
					<Textarea
						@blur="formUploadCheck('description') && formUploadCheck('name')"
						@input="formUploadCheck('description') && formUploadCheck('name')"
						name="description"
						:autoResize="true"
						rows="3"
						class="tw-w-2/3"
						v-model="formData.description"
					/>
					<div class="h-3">
						<small
							v-if="errors.description"
							class="tw-text-xs tw-px-0 tw-font-medium tw-text-dangerColor"
							>{{ errors.description }}</small
						>
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
	</div>
</template>

<script>
import Notification from '@/components/Notification.vue';
import { useStore } from 'vuex';
import { ref, computed, onMounted } from 'vue';
//
import useDatasetInputValidation from '@/helpers/dataSetInputValidator';

export default {
	name: 'CreateDataSet',
	props: ['id'],
	components: {
		Notification,
	},

	setup(props) {
		const store = useStore();
		const { formUploadCheck, errors, validate, formData } = useDatasetInputValidation(props);
		const isInfoView = ref(computed(() => store.state.dataSet.isInfoView));
		const isNotification = ref(false);
		const dataSetDetail = computed(() => store.state.dataSet.dataSetDetail);
		// I am creating this function to call for edit data if they are not present
		onMounted(async () => {
			if (props.id && !store.state.dataSet.dataSetDetail.name) {
				await store.dispatch('dataSet/getDataSetDetail', props.id);
				const userData = {
					name: store.state.dataSet.dataSetDetail.name,
					description: store.state.dataSet.dataSetDetail.description,
				};
				store.commit('dataSet/SET_USER_DATA', userData);
				store.commit('dataSet/SET_SELECTED_DATASET', store.state.dataSet.dataSetDetail);
			}
		});

		return {
			isInfoView,
			isNotification,
			formUploadCheck,
			errors,
			validate,
			formData,
			dataSetDetail,
			dashboardIndex: computed(() => store.state.dashboardIndex),
		};
	},
};
</script>
