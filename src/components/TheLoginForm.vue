<template>
	<div class="flex-col tw-justify-center tw-items-center tw-w-full">
		<Notification loc="authenticate" ref="clearNotification"></Notification>
		<form
			@submit.prevent
			class="
				tw-w-full tw-flex tw-flex-col tw-justify-center tw-items-center
				md:tw-max-w-2xl
				tw-max-w-md tw-mx-auto tw-gap-8
			"
		>
			<small v-show="formData.showInvalidAuth" class="tw-my-1 tw-text-base tw-text-red-500">{{
				formData.formErrMsg
			}}</small>
			<small v-show="formData.isLoading" class="tw-my-1 tw-text-base tw-text-green-500">{{
				formData.loadingMsg
			}}</small>
			<div class="tw-flex tw-justify-center">
				<div class="tw-flex tw-flex-col tw-items-start tw-gap-2">
					<label for="login-email" class="tw-text-base tw-font-semibold">Email</label>
					<InputText
						ref="email"
						autocomplete="username"
						v-model.lazy="formData.email"
						id="login-email"
						type="email"
						placeholder="your-email@example.com"
						class="tw-text-sm md:tw-w-96 tw-w-60 tw-border-primaryColor tw-p-4"
						@focus="clearNotification.clearAllNotifications()"
						data-test-id-email
					/>
				</div>
			</div>
			<div class="tw-flex tw-justify-center tw-w-3/5">
				<div class="tw-flex tw-flex-col tw-items-start tw-gap-2">
					<label for="login-password" class="tw-text-base tw-font-semibold">Password</label>
					<Password
						toggleMask
						:feedback="false"
						autocomplete="current-password"
						v-model="formData.password"
						id="login-password"
						placeholder="password"
						inputClass="tw-border-primaryColor tw-p-4 tw-text-sm md:tw-w-96 tw-w-60"
						@focus="clearNotification.clearAllNotifications()"
						data-test-id-password
					/>
					<router-link
						:to="{ name: 'ForgotPassword' }"
						v-slot="{ href }"
						class="tw-text-xs tw-text-primaryColor tw-underline"
						><a :href="href">Forgot your password?</a>
					</router-link>
				</div>
			</div>
			<div class="md:tw-w-3/5 tw-w-full tw-flex tw-justify-center tw-gap-4">
				<Button
					@click="login"
					type="submit"
					label="Login"
					class="btn-primary btn-primary-gradient"
				/>
				<Button
					@click="router.replace({ name: 'Signup' })"
					type="submit"
					label="Signup"
					class="btn-primary-hollow"
				/>
			</div>
		</form>
		<div class="tw-my-8 tw-w-full tw-flex tw-justify-center tw-items-center">
			<div class="tw-h-px tw-bg-gray tw-w-1/3"></div>
			<b class="tw-mx-4">Or</b>
			<div class="tw-h-px tw-bg-gray tw-w-1/3"></div>
		</div>
		<div class="tw-w-full tw-flex tw-justify-center">
			<Button
				@click="redirectToGithub"
				type="button"
				icon="pi pi-github"
				label="Login with Github account"
				class="btn-primary-hollow tw-w-60"
			/>
		</div>
	</div>
</template>
<script>
import Password from '@/components/primevueComponents/Password.vue';
import { reactive, ref, onMounted } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import { string } from 'yup';
import Cookies from 'js-cookie';

import Notification from '@/components/Notification.vue';

export default {
	name: 'TheLoginForm',
	components: {
		Password,
		Notification,
	},
	setup() {
		const router = useRouter();
		const store = useStore();
		const clearNotification = ref();
		const email = ref();
		const emailSchema = string() //email validation schema
			.email()
			.nullable()
			.required();
		const formData = reactive({
			email: '',
			password: '',
			showInvalidAuth: false,
			formErrMsg: 'There is something wrong with form',
			loadingMsg: 'Loading ...',
			isLoading: false,
		});
		function redirectToGithub() {
			window.location.replace(process.env.VUE_APP_GITHUB_LOGIN_URL);
		}
		const login = async () => {
			// here I am checking for credentials of the user  not authenticate them
			// authentication process  starts when redirecting user for the first time to "Dashboard"
			formData.isLoading = false;
			formData.showInvalidAuth = false;
			// calling this function in Notification component
			clearNotification.value.clearAllNotifications();
			const userLoginData = {
				userEmail: formData.email,
				userPassword: formData.password,
			};
			if (formData.email && emailSchema.isValidSync(formData.email) && formData.password) {
				formData.isLoading = true;
				await store.dispatch('authenticate', userLoginData);
				formData.showInvalidAuth = false;
			} else {
				formData.formErrMsg = 'Please fill all the fields';
				formData.showInvalidAuth = true;
				return;
			}
			// here I am checking if credentials are correct and tokenCookie is present then redirect
			// user to "Dashboard" by this in router guard will call "test-token"
			// then user will be authenticated
			if (store.state.isCredentialCorrect && Cookies.get('Authorization') !== 'undefined') {
				formData.showInvalidAuth = false;
				// when redirected from login to dashboard
				// This can result Two time call test token
				// one  happening in router guard ( refresh, and guard line 105 )
				//the other one after refresh whe app loads again
				//TODO improve in final production
				router.push({ name: 'Dashboard' });
			} else {
				formData.formErrMsg = 'The email or password is not correct';
				formData.isLoading = false;
				formData.showInvalidAuth = true;
			}
		};
		onMounted(() => {
			email.value.$el.focus();
		});

		return {
			email,
			router,
			redirectToGithub,
			clearNotification,
			login,
			formData,
		};
	},
};
</script>
<style lang="scss">
@import '@/style/config';
// I am getting p-password-input from primevue password core component
// this shows something else in documentation

.p-button-icon {
	margin: 0 !important;
	font-size: 1.6rem;
	color: $primaryColor;
}
</style>
