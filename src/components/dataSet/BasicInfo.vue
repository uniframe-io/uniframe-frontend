<template>
	<div class="w-full tw-flex tw-flex-col tw-justify-center tw-border tw-border-gray tw-shadow-md">
		<CardHeader
			showHelp
			helpReference="name_description"
			title="Input Dataset info"
			class="tw-px-5 tw-py-3 tw-bg-tableTitle tw-h-auto tw-border-b tw-border-gray"
		/>
		<div class="tw-h-auto tw-flex tw-p-5 tw-justify-start tw-items-center">
			<form
				@enter.prevent
				@submit.prevent
				class="tw-flex tw-flex-col tw-justify-center tw-gap-6 tw-w-4/5"
			>
				<div class="tw-flex tw-flex-col tw-items-start tw-gap-3">
					<label for="name" class="tw-text-sm">Dataset Name</label>
					<InputText
						@input="formUploadCheck('name')"
						@blur="formUploadCheck('name') && formUploadCheck('description')"
						name="name"
						class="tw-w-full"
						v-model="formData.name"
					/>
					<small v-if="errors.name" class="tw-text-xs tw-px-0 tw-font-medium tw-text-dangerColor">{{
						errors.name
					}}</small>
					<small v-else class="tw-text-xs tw-px-0 tw-font-medium tw-text-gray">{{
						formNameValidationGuideForDataset
					}}</small>
				</div>
				<div class="tw-flex tw-flex-col tw-items-start tw-gap-3">
					<label for="description" class="tw-text-sm">Dataset Description (Optional)</label>

					<Textarea
						@blur="formUploadCheck('description') && formUploadCheck('name')"
						@input="formUploadCheck('description') && formUploadCheck('name')"
						name="description"
						:autoResize="true"
						rows="3"
						cols="30"
						class="tw-w-full"
						v-model="formData.description"
					/>
					<small
						v-if="errors.description"
						class="tw-text-xs tw-px-0 tw-font-medium tw-text-dangerColor"
						>{{ errors.description }}</small
					>
					<small v-else class="tw-text-xs tw-px-0 tw-font-medium tw-text-gray">{{
						formDescriptionValidationGuide
					}}</small>
				</div>
			</form>
		</div>
	</div>
</template>

<script>
import useDatasetInputValidation from '@/helpers/dataSetInputValidator';
import { useStore } from 'vuex';
export default {
	name: 'DataSetBasicInfo',
	components: {},
	props: ['id'],
	setup(props) {
		const store = useStore();
		const formNameValidationGuideForDataset = store.state.formNameValidationGuideForDataset;
		const formDescriptionValidationGuide = store.state.formDescriptionValidationGuide;
		const { formUploadCheck, errors, validate, formData } = useDatasetInputValidation(props);

		return {
			formNameValidationGuideForDataset,
			formDescriptionValidationGuide,
			formUploadCheck,
			errors,
			validate,
			formData,
		};
	},
};
</script>
