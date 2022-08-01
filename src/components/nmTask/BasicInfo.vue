<template>
	<div class="w-full tw-flex tw-flex-col tw-justify-center tw-border tw-border-gray tw-shadow-md">
		<div class="tw-h-20">
			<CardHeader
				showHelp
				helpReference="name_description"
				class="tw-px-5 tw-py-3 tw-bg-tableTitle tw-border-b tw-border-gray"
				:title="`${number ? number : ''}${titleName} Task basic information`"
			/>
		</div>
		<div class="tw-h-auto tw-flex tw-p-5 tw-justify-start tw-items-center">
			<form
				@enter.prevent
				@submit.prevent
				class="form-input tw-flex tw-flex-col tw-gap-10 tw-w-4/5"
			>
				<div class="tw-flex tw-flex-col tw-items-start tw-gap-3">
					<label for="name" class="tw-text-sm">{{ `${titleName} Task Name` }}</label>
					<InputText
						@blur="validate('name')"
						@input="formUploadCheck"
						name="name"
						class="tw-w-full"
						v-model="formData.name"
					/>
					<small v-if="errors.name" class="tw-text-xs tw-px-0 tw-font-medium tw-text-dangerColor">{{
						errors.name
					}}</small>
					<small v-else class="tw-text-xs tw-px-0 tw-font-medium tw-text-gray">{{
						formNameValidationGuideForTask
					}}</small>
				</div>
				<div class="tw-flex tw-flex-col tw-items-start tw-gap-3">
					<label for="description" class="tw-text-sm">{{ `${titleName} Task Description (Optional)` }}</label>

					<Textarea
						@blur="validate('description')"
						@input="formUploadCheck"
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
import filterXSS from 'xss'; // I will use this function to send clean text to server
import { ref, reactive, watch, onMounted, computed, nextTick } from 'vue';
import * as yup from 'yup';
import { useStore } from 'vuex';

export default {
	name: 'BatchTaskBasicInfo',
	components: {},
	props: {
		number: {
			type: String,
		},
		nameValue: {
			type: String,
		},
		descriptionValue: {
			type: String,
		},
	},
	setup(props) {
		const store = useStore();
		const formNameValidationGuideForTask = store.state.formNameValidationGuideForTask;
		const formDescriptionValidationGuide = store.state.formDescriptionValidationGuide;
		const errors = reactive({
			name: '',
			description: '',
		});
		const createdBatchTaskData = computed({
			get: () => store.state.nmTask.createdBatchTaskData,
		});
		const isNameUnique = ref(true);
		const formData = reactive({
			name: props.nameValue || store.state.nmTask.createdBatchTaskData.name || '',
			description:
				props.descriptionValue || store.state.nmTask.createdBatchTaskData.description || '',
		});
		const Regex = /^[a-zA-Z]+[a-zA-Z0-9_\-\s]*$/;
		const formSchema = yup.object().shape({
			name: yup
				.string()
				.nullable()
				.required()
				.min(5)
				.max(32)
				.matches(
					Regex,
					'Please only use letters, numbers, underscore and hyphen. The name must start with a letter.'
				)
				.label('Task name'),
			description: yup.string().nullable().max(200).label('Task description'),
		});

		function validate(field) {
			formSchema
				.validateAt(field, { [field]: formData[field] })
				.then(() => (errors[field] = ''))
				.catch((err) => {
					errors[field] = err.errors[0];
				});
			if (errors.name !== '') return;
			errors.name = isNameUnique.value ? '' : 'Please use unique name';
		}

		function purifyForm() {
			//xss cleaning the form and if valid committing to store
			formData.name = filterXSS(formData.name);
			formData.description = filterXSS(formData.description);
		}
		async function formUploadCheck() {
			isNameUnique.value = true;
			purifyForm();
			//TODO investigate this error when directly call  "nm-batch-task/create"
			await nextTick(() => {
				store.state.nmTask.nmTask.length > 0 &&
					store.state.nmTask.nmTask.forEach((value) => {
						if (value.name === formData.name) {
							isNameUnique.value = false;
						}
					});
			});

			if ((await formSchema.isValid(formData)) && isNameUnique.value) {
				store.commit('nmTask/SET_IS_FORM_VALID', true);
			} else {
				store.commit('nmTask/SET_IS_FORM_VALID', false);
				store.commit('nmTask/SET_IS_TASK_FORM_VALID', false);
			}
		}
		watch(
			formData,
			async () => {
				purifyForm();
				await formUploadCheck();
				if (store.state.nmTask.isFormValid) {
					store.commit('nmTask/SET_TASK', formData);
				}
			},
			{ immediate: true, deep: true }
		);
		watch(
			//this watch is for maintaining user data after refresh
			() => store.state.nmTask.createdBatchTaskData,
			() => {
				formData.name = store.state.nmTask.createdBatchTaskData.name;
				formData.description = store.state.nmTask.createdBatchTaskData.description;
			},
			{ immediate: true, deep: true }
		);

		onMounted(() => {
			formUploadCheck();
		});
		return {
			titleName: computed(() => store.state.nmTask.taskState.title),
			formNameValidationGuideForTask,
			formDescriptionValidationGuide,
			createdBatchTaskData,
			errors,
			validate,
			formData,
			formUploadCheck,
		};
	},
};
</script>
<style lang="scss"></style>
