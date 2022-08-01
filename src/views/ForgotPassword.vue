<template>
	<div :key="reRender" class="tw-flex h-screen--20 tw-bg-white tw-items-start">
		<div class="background tw-w-2/5">
			<BlueLayout />
		</div>
		<div
			v-if="!showOtp && !isCodeVerified"
			class="tw-w-3/5 tw-mt-8 tw-flex tw-flex-col tw-justify-center tw-items-center tw-gap-8"
		>
			<h1 class="h3-bold">Forgot password?</h1>
			<p class="tw-text-sm tw-font-semibold tw-w-1/2 tw-text-center">
				Please enter the email address associated with your account to receive a verification code.
			</p>
			<VerifyPasswordForm
				class="tw-w-full"
				v-if="!store.state.authenticated"
				@getVerificationCode="getVerificationCode"
				goBackName="Signin"
			/>
		</div>
		<div
			v-if="showOtp && !isCodeVerified"
			class="tw-w-3/5 tw-mt-8 tw-flex tw-flex-col tw-justify-center tw-items-center tw-gap-5"
		>
			<h1 class="h3-bold">Verification</h1>
			<p class="tw-text-sm tw-font-semibold tw-w-2/3 tw-text-center">
				Enter the verification code we just sent to
				<span class="tw-font-bold">
					{{ `“${userData.userEmail}”` }}
				</span>
				If you didn’t receive the code please check your spam box first and then try again. The code
				will be expired after 10 minutes.
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
			class="tw-w-3/5 tw-mt-8 tw-flex tw-flex-col tw-justify-center tw-items-center tw-gap-8"
			v-if="showOtp && isCodeVerified"
		>
			<h1 class="h3-bold">Please choose your new password</h1>
			<EditPassword @changePassword="changePassword" />
		</div>
	</div>
</template>
<script>
import VerifyPasswordForm from '../components/VerifyPasswordForm.vue';
import EditPassword from '../components/ForgotPasswordEditPassword.vue';
import BlueLayout from '../components/BlueLayout.vue';
import { useStore } from 'vuex';
import Otp from '@/components/VerifyPasswordOtp.vue';
import { ref, computed, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
export default {
	//TODO: create captcha for the forms
	name: 'Signin',
	components: {
		EditPassword,
		VerifyPasswordForm,
		BlueLayout,
		Otp,
	},
	setup() {
		const store = useStore();
		const router = useRouter();
		const reRender = ref(0);
		const resendDisabled = ref(false);
		const resendCounter = ref(1);
		const resendTimeOutValue = computed(() => resendCounter.value * 20000);
		const resendTimeOutValueCountDown = ref(20);
		const showOtp = computed(() => store.state.isVerificationCodeSent);
		const isCodeVerified = computed(() => store.state.isCodeVerified);
		let resendTimeOut;
		let resendTimeCounter;
		const userData = ref({
			userEmail: '',
			userCode: '',
			newPassword: '',
			action: 'forget_password',
		});

		async function changePassword(newPassword) {
			userData.value.newPassword = newPassword;
			await store.dispatch('changePassword', userData.value);
		}
		async function verifyCode(userCode) {
			userData.value.userCode = userCode;
			await store.dispatch('verifyUserCode', {
				vcode: userData.value.userCode,
				email: userData.value.userEmail,
				action: 'forget_password',
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
				action: 'forget_password',
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
			counter,
			resetInputsStyle,
			resendTimeOutValueCountDown,
			resend,
			resendDisabled,
			reRender,
			goToEmail,
			userData,
			changePassword,
			isCodeVerified,
			getVerificationCode,
			verifyCode,
			showOtp,
			store,
		};
	},
};
</script>
