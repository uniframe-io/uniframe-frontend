<template>
	<form
		@submit.prevent
		class="
			tw-w-full tw-flex tw-flex-col tw-justify-center tw-items-start tw-max-w-xl tw-mx-auto
			lg:tw-p-9
			tw-p-5 tw-py-4 tw-gap-2 tw-h-auto
		"
	>
		<div
			class="
				full-name-section
				tw-flex tw-flex-col
				lg:tw-flex-row
				tw-justify-between
				lg:tw-items-center lg:tw-gap-4
				tw-w-full tw-overflow-hidden
				lg:tw-px-1
			"
		>
			<div class="first-name tw-flex tw-flex-col tw-gap-1">
				<label
					for="first-name"
					class="tw-text-base tw-font-semibold"
					:class="{ 'tw-text-dangerColor': errors.firstName }"
					>First Name</label
				>

				<InputText
					name="firstName"
					v-model="formData.firstName"
					type="text"
					placeholder="Person"
					class="tw-text-sm tw-border-primaryColor tw-h-11 tw-w-60"
					@blur="validate('firstName')"
				/>
				<div class="error-display tw-h-6">
					<small v-show="errors.firstName" class="tw-my-1 tw-text-xs tw-text-dangerColor">{{
						errors.firstName
					}}</small>
				</div>
			</div>
			<div class="last-name tw-flex tw-flex-col tw-gap-1">
				<label
					for="last-name"
					class="tw-text-base tw-font-semibold"
					:class="{ 'tw-text-dangerColor': errors.lastName }"
					>Last Name</label
				>
				<InputText
					name="lastName"
					v-model="formData.lastName"
					id="last-name"
					type="text"
					placeholder="Doe"
					class="tw-text-sm tw-border-primaryColor tw-h-11 tw-w-60"
					@blur="validate('lastName')"
				/>
				<div class="error-display tw-h-6">
					<small v-show="errors.lastName" class="tw-my-1 tw-text-xs tw-text-dangerColor">{{
						errors.lastName
					}}</small>
				</div>
			</div>
		</div>

		<div class="email-section tw-flex tw-flex-col tw-items-start tw-w-full tw-px-1 tw-gap-1">
			<label
				for="reg-email"
				class="tw-text-base tw-font-semibold"
				:class="{ 'tw-text-dangerColor': errors.email }"
				>Email</label
			>
			<InputText
				name="email"
				autocomplete="username"
				:modelValue="userEmail"
				id="reg-email"
				type="email"
				placeholder="youremail@exaple.com"
				class="lg:tw-w-full tw-w-60 tw-text-sm tw-border-primaryColor tw-h-11"
				@blur="validate('email')"
				disabled
			/>
			<div class="error-display tw-h-6">
				<small v-show="errors.email" class="tw-my-1 tw-text-xs tw-text-dangerColor">{{
					errors.email
				}}</small>
			</div>
		</div>

		<div
			class="
				password-section
				tw-items-star tw-gap-4 tw-px-1 tw-flex tw-flex-col
				lg:tw-flex-row
				tw-justify-between
				lg:tw-items-center
				tw-w-full tw-overflow-hidden
				lg:tw-px-1
			"
		>
			<div class="password tw-flex tw-flex-col tw-items-start tw-gap-1">
				<label
					for="reg-password"
					class="tw-text-base tw-font-semibold"
					:class="{ 'tw-text-dangerColor': errors.password }"
					>Password</label
				>
				<Password
					autocomplete="new-password"
					name="password"
					toggleMask
					v-model="formData.password"
					id="reg-password"
					inputClass="tw-border-primaryColor  tw-text-sm tw-w-60"
					@blur="validate('password')"
				/>
				<div class="error-display tw-h-6">
					<small v-if="!errors.password" class="tw-my-1 tw-text-xs tw-text-gray">
						Use 6 or more characters with a mix of letters, numbers & symbols
					</small>
					<small v-else class="tw-my-1 tw-text-xs tw-text-dangerColor">{{ errors.password }}</small>
				</div>
			</div>
			<div class="confirm-password tw-flex tw-flex-col tw-items-start tw-gap-1">
				<label
					for="confirm-password"
					class="tw-text-base tw-font-semibold"
					:class="{ 'tw-text-dangerColor': errors.confirmPassword }"
					>Confirm Password</label
				>
				<Password
					toggleMask
					name="confirmPassword"
					v-model="formData.confirmPassword"
					id="confirm-password"
					inputClass="tw-border-primaryColor tw-text-sm tw-w-60"
					:feedback="false"
					autocomplete="new-password"
					@blur="validate('confirmPassword')"
				/>
				<div class="error-display tw-h-6">
					<small v-if="errors.confirmPassword" class="tw-my-1 tw-text-xs tw-text-dangerColor">{{
						errors.confirmPassword
					}}</small>
				</div>
			</div>
		</div>
		<div
			class="
				consent-section
				lg:tw-mt-10
				tw-mt-4 tw-flex tw-flex-col tw-justify-center tw-items-start tw-gap-4 tw-w-full
			"
		>
			<div class="tw-flex tw-gap-4">
				<Checkbox id="terms-and-conditions" v-model="termsAndConditionsChecked" :binary="true" />
				<label class="tw-text-xs" for="terms-and-conditions"
					>I have read and accept the
					<router-link
						class="tw-text-primaryColor tw-underline"
						:to="{ name: 'TermsAndConditions' }"
						target="_blank"
						>Terms of Service</router-link
					>
					and the
					<router-link
						class="tw-text-primaryColor tw-underline"
						:to="{ name: 'PrivacyPolicy' }"
						target="_blank"
						>Privacy Policy</router-link
					>
				</label>
			</div>
			<!-- <div class="tw-flex tw-gap-4">
				<Checkbox id="terms-and-conditions" v-model="privacyChecked" :binary="true" />
				<label class="tw-text-xs" for="terms-and-conditions"
					>I have read and accept the
					<router-link
						class="tw-text-primaryColor tw-underline"
						:to="{ name: 'PrivacyPolicy' }"
						target="_blank"
						>Privacy Policy</router-link
					></label
				>
			</div> -->
		</div>
		<div class="button-section tw-mt-10 tw-flex tw-flex-col tw-w-full tw-items-center tw-gap-2">
			<Button
				@click.prevent="register"
				label="Create my account"
				class="btn-primary btn-primary-gradient tw-w-60"
				:disabled="!termsAndConditionsChecked"
			/>
			<div class="tw-my-8 tw-w-full tw-flex tw-justify-center tw-items-center">
				<div class="tw-h-px tw-bg-gray tw-w-1/2"></div>
				<b class="tw-mx-4">Or</b>
				<div class="tw-h-px tw-bg-gray tw-w-1/2"></div>
			</div>
			<div class="tw-w-full tw-flex tw-justify-center">
				<Button
					@click="redirectToGithub"
					type="button"
					icon="pi pi-github"
					label="Continue with GitHub"
					class="btn-primary-hollow tw-w-60"
				/>
			</div>
		</div>
	</form>
</template>
<script lang="ts">
//primeVue
import Password from '@/components/primevueComponents/Password.vue';
import Checkbox from 'primevue/checkbox';
//

//
import { defineComponent, reactive, ref } from 'vue';
import * as yup from 'yup';
interface RegForm {
	firstName: string | null;
	lastName: string | null;
	email: string | null;
	password: string | null;
	confirmPassword: string;
}
export default defineComponent({
	name: 'TheRegisterForm',
	props: {
		//  this is for hidden input to mange better with autocomplete
		userEmail: {
			type: String,
			required: true,
		},
	},
	emits: ['register'],
	components: {
		Password,
		Checkbox,
	},

	setup(
		_,
		{ emit }
	): {
		validate: (field: string) => void;
		formData: RegForm;
		errors: RegForm;
		register: () => void;
		redirectToGithub: () => void;
		termsAndConditionsChecked;
	} {
		const termsAndConditionsChecked = ref(false);
		const regFormSchema = yup.object().shape({
			firstName: yup
				.string()
				.nullable()
				.required()
				.min(2)
				//because there is no limit in name I added alphabets for safety
				.matches(/^[aA-zZ\s]+$/, 'Only alphabets are allowed for this field ')
				.label('Firs Name'),
			lastName: yup
				.string()
				.nullable()
				.required()
				.min(2)
				.matches(/^[aA-zZ\s]+$/, 'Only alphabets are allowed for this field ')
				.label('Last Name'),
			// email: yup.string().nullable().required().email().label('Email'),
			password: yup.string().required().nullable().min(6).max(12).label('Password'),
			confirmPassword: yup.string().nullable().required().label('Confirm Password'),
			// .oneOf([yup.ref('password'), null], 'Passwords must match'),  //HINT: I let this here to check again
		});
		const formData = reactive<RegForm>({
			//TODO: Move formData and errors to store
			firstName: null,
			lastName: null,
			email: null,
			password: null,
			confirmPassword: null,
		});
		const errors = reactive<RegForm>({
			firstName: '',
			lastName: '',
			email: '',
			password: '',
			confirmPassword: '',
		});

		function validate(field: string): void {
			//TODO: This needs to be tested well
			regFormSchema
				.validateAt(field, { [field]: formData[field] }, { abortEarly: false })
				.then(() => {
					//? I had to check for confirm password manually
					//? for some reason YUP did not work
					if (field === 'confirmPassword') {
						if (formData.password !== formData.confirmPassword) {
							errors.confirmPassword = 'Passwords must match';
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
		// TODO: look into register process and evaluate
		function register() {
			// will add more UX logic here
			if (regFormSchema.isValidSync(formData)) {
				emit('register', formData);
			} else {
				for (const [key] of Object.entries(formData)) {
					validate(key);
				}
			}
		}
		function redirectToGithub() {
			window.location.replace(process.env.VUE_APP_GITHUB_LOGIN_URL);
		}
		return {
			termsAndConditionsChecked,
			redirectToGithub,
			validate,
			formData,
			errors,
			register,
		};
	},
});
</script>
<style lang="scss">
@import '@/style/config';

.p-password-input,
.p-inputtext {
	border-radius: 8px;
	height: 2rem;
}
.p-password-input {
	border: $primaryColor solid 1px;
}

.p-button-icon {
	margin: 0 !important;
	font-size: 1.6rem;
	color: $primaryColor;
}
</style>
