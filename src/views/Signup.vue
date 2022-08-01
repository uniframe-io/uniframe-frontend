<template>
	<div
		class="
			tw-flex
			tw-justify-center
			tw-m-0
			tw-w-full
			tw-h-auto
			tw-bg-white
			tw-mx-auto
			tw-max-w-screen-3xl
		"
	>
		<BlueLayout v-if="!isMobileView" class="background tw-w-2/5 tw-h-full" />
		<div
			class="tw-w-11/12 md:tw-w-3/5 tw-flex tw-flex-col tw-justify-start tw-items-center tw-mt-8"
		>
			<Notification v-show="isNotification" loc="register" @isNotification="notificationStatus" />
			<div
				v-if="!showOtp && !isCodeVerified"
				class="tw-w-full tw-flex tw-flex-col tw-justify-center tw-items-center md:tw-gap-8 tw-gap-4"
			>
				<h1 class="h3-bold">Sign up with email</h1>
				<p class="md:tw-w-2/3 tw-w-full tw-text-sm tw-font-semibold tw-text-center">
					Please enter your email address. We will send you an email with a verification code to
					verify your email.
				</p>
				<VerifyPasswordForm
					v-if="!store.state.authenticated"
					@getVerificationCode="getVerificationCode"
					goBackName="Signup"
				/>
			</div>
			<div
				v-if="showOtp && !isCodeVerified"
				class="
					md:tw-w-2/3
					tw-w-full tw-mt-8 tw-flex tw-flex-col tw-justify-center tw-items-center tw-gap-5
				"
			>
				<h1 class="h3-bold">Verification</h1>
				<p class="tw-text-sm tw-font-semibold tw-text-center">
					Enter the verification code we just sent to
					<span class="tw-font-bold">
						{{ `“${userData.userEmail}”` }}
					</span>
					If you didn’t receive the code please check your <strong>spam box</strong> first and then
					try again. The code will be expired after <strong>10 minutes</strong>.
				</p>
				<Otp @goToEmail="goToEmail" @verifyCode="verifyCode" @resetInputsStyle="resetInputsStyle" />
				<p class="tw-text-sm">
					Haven’t received the verification code yet?
					<span
						v-if="!resendDisabled"
						@click="resend"
						class="tw-underline tw-text-primaryColor tw-cursor-pointer"
						:class="{ 'tw-cursor-not-allowed': resendDisabled }"
					>
						Resend</span
					>
					<span v-else>{{
						`Please wait for ${resendTimeOutValueCountDown} sec to resend again`
					}}</span>
				</p>
			</div>
			<div
				v-if="showOtp && isCodeVerified && !isShowForm"
				class="
					md:tw--mt-10
					tw-gap-2
					tw-text-center
					tw-w-full
					tw-h-full
					tw-flex
					tw-flex-col
					tw-justify-center
					tw-items-center
				"
			>
				<p class="tw-text-successColor tw-font-semibold tw-text-lg">
					Your email has been successfully confirmed
					<span class="tw-text-successColor tw-font-bold tw-text-3xl">&#10003;</span>
				</p>
				<p class="tw-font-semibold tw-text-lg">Please continue to create your account</p>
				<Button
					@click="handleShowForme"
					type="submit"
					label="Create account"
					class="btn-primary btn-primary-gradient tw-w-36 tw-mt-8"
				/>
			</div>
			<TheRegisterForm
				v-if="isShowForm && !isRegisterComplete"
				v-show="!isNotification"
				:userEmail="userData.userEmail"
				@register="register"
			/>
			<div
				v-if="isRegisterComplete"
				class="
					tw-text-center
					tw-w-full
					tw-h-full
					tw-flex
					tw-flex-col
					tw-gap-5
					tw-justify-center
					tw-items-center
				"
			>
				<p class="tw-font-semibold tw-text-lg md:tw-w-1/2 tw-w-4/5">Welcome to UniFrame!</p>
				<p class="tw-font-semibold tw-text-md md:tw-w-1/2 tw-w-4/5">
					Your account has been successfully created
				</p>
				<Button
					@click="goToLogin"
					type="submit"
					label="Login"
					class="btn-primary btn-primary-gradient tw-w-32 tw-mt-8"
				/>
			</div>
		</div>
	</div>
</template>
<script>
import TheRegisterForm from '../components/TheRegisterForm.vue';
import Notification from '@/components/Notification.vue';
import BlueLayout from '../components/BlueLayout.vue';
import VerifyPasswordForm from '@/components/VerifyPasswordForm.vue';
import Otp from '@/components/VerifyPasswordOtp.vue';

import { computed, ref, onUnmounted } from 'vue';
import { useStore } from 'vuex';
import { useRoute, useRouter } from 'vue-router';

export default {
	name: 'Signup',
	components: { TheRegisterForm, Notification, BlueLayout, VerifyPasswordForm, Otp },

	setup() {
		let resendTimeOut;
		let resendTimeCounter;
		const store = useStore();
		const router = useRouter();
		const route = useRoute();
		const isNotification = ref(false);
		const notifications = ref('');
		const reRender = ref(0);
		const resendDisabled = ref(false);
		const resendCounter = ref(1);
		const resendTimeOutValue = computed(() => resendCounter.value * 20000);
		const resendTimeOutValueCountDown = ref(20);
		const showOtp = computed(() => store.state.isVerificationCodeSent);
		const isCodeVerified = computed(() => store.state.isCodeVerified);
		const isRegisterComplete = computed(() => store.state.isRegisterComplete);
		const isShowForm = ref(false);
		const userData = ref({
			email: '',
			full_name: '',
			password: '',
			userCode: '',
		});
		async function register(formData) {
			await store.dispatch('register', {
				full_name: `${formData.firstName} ${formData.lastName}`,
				email: userData.value.userEmail,
				password: `${formData.password}`,
				vcode: `${userData.value.userCode}`,
				action: 'signup',
			});
		}
		async function goToLogin() {
			store.commit('SET_BLOCKUI_VALUE', true);
			setTimeout(() => {
				router.replace({ name: 'Signin' });
				store.commit('SET_BLOCKUI_VALUE', false);
			}, store.state.uiTimeOut);
		}

		function handleShowForme() {
			if (showOtp.value && isCodeVerified.value) isShowForm.value = true;
		}
		function notificationStatus([status, notification]) {
			isNotification.value = status;
			notifications.value = notification;
		}
		// TODO This is copied code  have to put in some component

		async function verifyCode(userCode) {
			userData.value.userCode = userCode;
			await store.dispatch('verifyUserCode', {
				vcode: userData.value.userCode,
				email: userData.value.userEmail,
				action: 'signup',
			});
		}

		function goToEmail() {
			store.commit('SET_isVerificationCodeSent', false);
			store.commit('SET_isCodeVerified', false);
			store.commit('SET_isVerificationCodeCorrect', true);
			reRender.value++;
		}
		function counter() {
			resendTimeOutValueCountDown.value = resendTimeOutValue.value / 1000;
			resendTimeCounter = setInterval(() => {
				if (resendTimeOutValueCountDown.value > 0)
					resendTimeOutValueCountDown.value = resendTimeOutValueCountDown.value - 1;
			}, 1000);
			setTimeout(() => {
				clearInterval(resendTimeCounter);
			}, resendTimeOutValue.value);
		}

		async function getVerificationCode(userLoginData) {
			userData.value.userEmail = userLoginData.userEmail;
			await store.dispatch('getVerificationCode', {
				email: userData.value.userEmail,
				action: 'signup',
			});
			resendDisabled.value = true;
			counter();
			// this will allow user to  use first resend code after 20sec
			resendTimeOut = setTimeout(() => {
				resendDisabled.value = false;
			}, resendTimeOutValue.value);
		}
		// this will allow user to resend code every 60sec
		async function resend() {
			resendCounter.value++;
			counter();
			if (!resendDisabled.value)
				await store.dispatch('getVerificationCode', userData.value.userEmail);
			resendDisabled.value = true;
			resendTimeOut = setTimeout(() => {
				resendDisabled.value = false;
			}, resendTimeOutValue.value);
		}
		function resetInputsStyle() {
			store.commit('SET_isVerificationCodeCorrect', true);
		}
		onUnmounted(() => {
			//TODO: For now I just refresh it later will reset variables
			setTimeout(() => {
				router.go(0);
			}, 500);
			clearInterval(resendTimeCounter);
			clearTimeout(resendTimeOut);
		});

		return {
			goToLogin,
			isMobileView: computed(() => store.state.isMobileView),

			isRegisterComplete,
			handleShowForme,
			isShowForm,
			register,
			verifyCode,
			userData,
			route,
			router,
			goToEmail,
			getVerificationCode,
			resend,
			resetInputsStyle,
			store,
			reRender,
			resendDisabled,
			resendCounter,
			resendTimeOutValue,
			resendTimeOutValueCountDown,
			showOtp,
			isCodeVerified,
			notifications,
			notificationStatus,
			isNotification,
		};
	},
};
</script>
<style lang="scss">
.background {
	height: auto;
	z-index: 0;
}
</style>
