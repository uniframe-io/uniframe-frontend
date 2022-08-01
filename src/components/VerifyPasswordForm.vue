<template>
	<div class="tw-flex flex-col tw-justify-start tw-items-center tw-w-full">
		<Notification loc="authenticate" ref="clearNotification"></Notification>
		<form
			@submit.prevent
			class="
				tw-w-full
				tw-flex
				tw-flex-col
				tw-justify-center
				tw-items-center
				tw-max-w-2xl
				tw-mx-auto
				tw-gap-1
			"
		>
			<small
				v-show="!emailErrorMessage && formData.isLoading"
				class="tw-my-1 tw-text-base tw-text-green-500"
				>{{ formData.loadingMsg }}</small
			>
			<div class="tw-flex tw-flex-col tw-justify-start tw-items-center tw-h-24 tw-gap-2">
				<div class="tw-flex tw-flex-col tw-items-start tw-gap-2">
					<label for="login-email" class="tw-text-base tw-font-semibold">Email</label>
					<InputText
						ref="email"
						autocomplete="username"
						v-model.lazy="formData.email"
						id="login-email"
						type="email"
						placeholder="your-email@example.com"
						class="tw-text-sm tw-w-72 md:tw-w-96 tw-border-primaryColor tw-p-4"
						@focus="clearNotification.clearAllNotifications()"
						data-test-id-email
					/>
				</div>
				<small
					v-show="emailErrorMessage || formData.showInvalidEmail"
					class="tw-text-sm tw-text-dangerColor tw-text-left tw-w-full"
					>{{ emailErrorMessage || formData.formErrMsg }}</small
				>
			</div>
			<div
				v-if="route.name === 'Signup'"
				class="button-section tw-my-10 tw-flex tw-flex-col tw-w-full tw-items-center tw-gap-2"
			>
				<Button
					type="button"
					label="Send my verification code"
					class="btn-primary btn-primary-gradient tw-w-60"
					@click="verify"
				/>
				<div class="tw-my-5 tw-w-full tw-flex tw-justify-center tw-items-center">
					<div class="tw-h-px tw-bg-gray tw-w-1/2"></div>
					<b class="tw-mx-4">Or</b>
					<div class="tw-h-px tw-bg-gray tw-w-1/2"></div>
				</div>
				<div class="tw-w-full tw-flex tw-justify-center">
					<Button
						@click="redirectToGithub"
						type="button"
						icon="pi pi-github"
						label="Signup with Github"
						class="btn-primary-hollow tw-w-60"
					/>
				</div>
			</div>
			<div v-else class="tw-w-3/5 tw-flex tw-flex-row-reverse tw-justify-center tw-gap-4 tw-mt-8">
				<Button
					@click="verify"
					type="submit"
					label="Send"
					class="btn-primary btn-primary-gradient"
				/>
				<Button @click="goBack" type="submit" label="Back" class="btn-primary-hollow" />
			</div>
		</form>
	</div>
</template>
<script>
import { reactive, ref, computed, onMounted } from 'vue';
import { useRouter, onBeforeRouteLeave, useRoute } from 'vue-router';
import { string } from 'yup';

import Notification from '@/components/Notification.vue';
import { useStore } from 'vuex';

export default {
	name: 'VerifyPasswordForm',
	emits: ['getVerificationCode'],
	props: {
		goBackName: { type: String, default: 'Signin' },
	},

	components: {
		Notification,
	},
	setup(props, { emit }) {
		const store = useStore();
		const router = useRouter();
		const route = useRoute();
		const clearNotification = ref();
		const email = ref();
		const emailErrorMessage = computed({
			get: () => store.state.emailErrorMessage,
			set: (value) => store.commit('SET_emailErrorMessage', value),
		});

		const emailSchema = string() //email validation schema
			.email()
			.nullable()
			.required();
		const formData = reactive({
			email: '',
			showInvalidEmail: false,
			formErrMsg: 'Please enter correct email',
			loadingMsg: 'Sending ...',
			isLoading: false,
		});

		const verify = async () => {
			formData.isLoading = false;
			formData.showInvalidEmail = false;
			clearNotification.value.clearAllNotifications();
			const userLoginData = {
				userEmail: formData.email,
			};
			if (formData.email && emailSchema.isValidSync(formData.email)) {
				formData.isLoading = true;
				store.commit('SET_SHOW_WINDOW_PROGRESS');
				emit('getVerificationCode', userLoginData);
			} else {
				formData.showInvalidEmail = true;
				return;
			}
		};
		function redirectToGithub() {
			window.location.replace(process.env.VUE_APP_GITHUB_LOGIN_URL);
		}
		onBeforeRouteLeave(() => (emailErrorMessage.value = null));
		function goBack() {
			emailErrorMessage.value = null;
			router.replace({ name: props.goBackName });
		}
		onMounted(() => {
			email.value.$el.focus();
			emailErrorMessage.value = null;
		});

		return {
			route,
			redirectToGithub,
			goBack,
			emailErrorMessage,
			email,
			router,
			clearNotification,
			verify,
			formData,
		};
	},
};
</script>
<style lang="scss">
@import '@/style/config';
// I am getting p-password-input from primevue password core component
// this shows something else in documentation
.p-password-input,
.p-inputtext {
	border-radius: 8px;
	height: 2rem;
}
</style>
