<template>
	<form class="tw-flex tw-flex-col tw-items-center tw-gap-5">
		<!-- chrome suggestion to have an user =name but hidden -->
		<!-- TODO check for possible issues -->
		<InputText autocomplete="username" class="tw-w-full tw-hidden" />
		<div class="tw-gap-2 tw-flex tw-flex-col tw-h-auto tw-rounded tw-p-2">
			<label for="oldPassword" class="">Please enter old password</label>
			<small v-show="errors.oldPassword" class="tw-my-1 tw-text-xs tw-text-red-500">{{
				errors.oldPassword
			}}</small>
			<Password
				autocomplete="old-password"
				name="oldPassword"
				toggleMask
				:feedback="false"
				v-model="formData.oldPassword"
				class="tw-max-w-xl"
				inputStyle="min-width:250px "
			/>
		</div>
		<div class="tw-gap-2 tw-flex tw-flex-col tw-h-auto tw-rounded tw-p-2">
			<label for="newPassword" class="">Please enter new password</label>
			<small v-show="errors.newPassword" class="tw-my-1 tw-text-xs tw-text-red-500">{{
				errors.newPassword
			}}</small>
			<Password
				autocomplete="new-password"
				name="newPassword"
				toggleMask
				v-model="formData.newPassword"
				class="tw-max-w-xl"
				inputStyle="min-width:250px "
				@blur="validate('newPassword')"
			/>
		</div>
		<div class="tw-gap-2 tw-flex tw-flex-col tw-h-auto tw-rounded tw-p-2">
			<label for="newPassword" class="">Confirm your password</label>
			<small v-show="errors.confirmNewPassword" class="tw-my-1 tw-text-xs tw-text-red-500">{{
				errors.confirmNewPassword
			}}</small>
			<Password
				autocomplete="new-password"
				name="confirmNewPassword"
				toggleMask
				:feedback="false"
				v-model="formData.confirmNewPassword"
				class="tw-max-w-xl"
				inputStyle="min-width:250px"
				@blur="validate('confirmNewPassword')"
			/>
		</div>
		<Button
			class="btn-primary btn-primary-gradient tw-w-44"
			label="Update Password"
			@click="updatePassword"
		/>
	</form>
</template>

<script>
import { reactive } from 'vue';
import { useStore } from 'vuex';

import Password from '@/components/primevueComponents/Password.vue';
import * as yup from 'yup';

export default {
	name: 'SettingEditPassword',
	components: {
		Password,
	},
	setup() {
		const store = useStore();
		const formData = reactive({
			oldPassword: '',
			newPassword: '',
			confirmNewPassword: '',
		});
		const errors = reactive({
			oldPassword: '',
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
		const updatePassword = () => {
			if (formSchema.isValidSync(formData) && !errors.confirmNewPassword) {
				store.dispatch(
					'updatePassword',
					`{
					"old_password": ${formData.oldPassword},
					"new_password": ${formData.newPassword}
						}`
				);
			}
		};

		return {
			validate,
			updatePassword,
			errors,
			formData,
		};
	},
};
</script>
