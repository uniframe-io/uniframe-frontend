<template>
	<form class="tw-flex tw-flex-col tw-items-center tw-gap-1">
		<!-- chrome suggestion to have an user =name but hidden -->
		<!-- TODO check for possible issues -->
		<InputText autocomplete="username" class="tw-w-full tw-hidden" />

		<div class="tw-gap-1 tw-flex tw-flex-col tw-h-24 tw-rounded tw-p-2 tw-justify-start">
			<label for="newPassword" class="tw-text-base tw-font-semibold"
				>Please enter new password</label
			>
			<Password
				name="newPassword"
				toggleMask
				v-model="formData.newPassword"
				class="tw-max-w-xl"
				inputStyle="min-width:350px "
				@blur="validate('newPassword')"
			/>
			<div class="tw-m-0 tw-p-0">
				<small v-show="errors.newPassword" class="tw-text-xs tw-p-0 tw-m-0 tw-text-dangerColor">{{
					errors.newPassword
				}}</small>
			</div>
		</div>
		<div class="tw-gap-1 tw-flex tw-flex-col tw-h-24 tw-rounded tw-p-2 tw-justify-start">
			<label for="newPassword" class="tw-text-base tw-font-semibold">Confirm your password</label>

			<Password
				name="confirmNewPassword"
				toggleMask
				:feedback="false"
				v-model="formData.confirmNewPassword"
				class="tw-max-w-xl"
				inputStyle="min-width:350px"
				@blur="validate('confirmNewPassword')"
			/>
			<div class="tw-m-0 tw-p-0">
				<small v-show="errors.confirmNewPassword" class="tw-my-1 tw-text-xs tw-text-dangerColor">{{
					errors.confirmNewPassword
				}}</small>
			</div>
		</div>
		<Button
			class="btn-primary btn-primary-gradient tw-w-44"
			label="Change my password"
			@click="changePassword"
			:disabled="isBtnDisabled"
		/>
	</form>
</template>

<script>
import { computed, reactive } from 'vue';

import Password from '@/components/primevueComponents/Password.vue';
import * as yup from 'yup';

export default {
	name: 'SettingEditPassword',
	emits: ['changePassword'],
	components: {
		Password,
	},
	setup(_, { emit }) {
		const isBtnDisabled = computed(() => {
			if (formSchema.isValidSync(formData) && !errors.confirmNewPassword) return false;
			return true;
		});
		const formData = reactive({
			newPassword: '',
			confirmNewPassword: '',
		});
		const errors = reactive({
			newPassword: '',
			confirmNewPassword: '',
		});

		const formSchema = yup.object().shape({
			newPassword: yup.string().nullable().required().min(6).max(12).label('Password'),
			confirmNewPassword: yup.string().nullable().label('Confirm Password').required(),
		});
		function validate(field) {
			formSchema
				.validateAt(field, { [field]: formData[field] }, { abortEarly: false })
				.then(() => {
					//? I had to check for confirm password manually
					//? for some reason YUP did not work
					if (field === 'confirmNewPassword') {
						if (formData.newPassword !== formData.confirmNewPassword) {
							errors.confirmNewPassword = 'Passwords must match';
						} else {
							errors[field] = '';
						}
					} else {
						errors[field] = '';
					}
				})
				.catch((err) => {
					errors[field] = err.errors[0];
				});
		}
		function changePassword() {
			if (formSchema.isValidSync(formData) && !errors.confirmNewPassword) {
				emit('changePassword', formData.newPassword);
			}
		}

		return {
			isBtnDisabled,
			validate,
			changePassword,
			errors,
			formData,
		};
	},
};
</script>
