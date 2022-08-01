<template>
	<form
		ref="otpForm"
		name="verify"
		@submit.prevent
		class="tw-flex tw-flex-col tw-items-center tw-gap-8"
	>
		<div
			class="tw-max-w-lg tw-overflow-hidden tw-flex tw-flex-col tw-items-start md:tw-gap-4 tw-gap-1"
		>
			<h2 class="tw-text-base tw-font-bold">Enter code here</h2>
			<div
				ref="otpInputs"
				class="tw-flex tw-max-w-md tw-justify-center tw-items-center md:tw-gap-5 tw-gap-4"
			>
				<input
					@keydown="returnKeyCode"
					@paste="handlePaste"
					@input="handleInput"
					maxlength="1"
					name="n1"
					type="text"
					class="otp-input"
					:class="{ 'incorrect-otp-input': !isVerificationCodeCorrect }"
				/>
				<input
					@keydown="returnKeyCode"
					@input="handleInput"
					maxlength="1"
					name="n2"
					type="text"
					class="otp-input"
					:class="{ 'incorrect-otp-input': !isVerificationCodeCorrect }"
				/>
				<input
					@keydown="returnKeyCode"
					@input="handleInput"
					maxlength="1"
					name="n3"
					type="text"
					class="otp-input"
					:class="{ 'incorrect-otp-input': !isVerificationCodeCorrect }"
				/>
				<input
					@keydown="returnKeyCode"
					@input="handleInput"
					maxlength="1"
					name="n4"
					type="text"
					class="otp-input"
					:class="{ 'incorrect-otp-input': !isVerificationCodeCorrect }"
				/>
				<input
					@keydown="returnKeyCode"
					@input="handleInput"
					maxlength="1"
					name="n5"
					type="text"
					class="otp-input"
					:class="{ 'incorrect-otp-input': !isVerificationCodeCorrect }"
				/>
				<input
					@keydown="returnKeyCode"
					@input="handleInput"
					maxlength="1"
					name="n6"
					type="text"
					class="otp-input"
					:class="{ 'incorrect-otp-input': !isVerificationCodeCorrect }"
				/>
			</div>
			<small v-show="!isVerificationCodeCorrect" class="tw-h-5 tw-text-sm tw-text-dangerColor"
				>The verification code is wrong or the code is expired. Please try again.</small
			>
		</div>
		<div
			class="md:tw-w-3/5 tw-w-full tw-flex tw-flex-row-reverse tw-justify-center tw-gap-4 tw-mt-8"
		>
			<Button
				@click.prevent="getFormValue"
				label="Verify"
				type="submit"
				class="btn-primary btn-primary-gradient"
				:disabled="isBtnDisabled"
			/>
			<Button
				@click="$emit('goToEmail')"
				label="Re-enter email"
				type="submit"
				class="btn-primary btn-primary-hollow tw-w-auto"
			/>
		</div>
	</form>
</template>

<script>
import { computed, ref } from 'vue';
import { useStore } from 'vuex';
export default {
	name: 'Otp',
	emits: ['verifyCode', 'resetInputsStyle', 'goToEmail'],

	setup(_, { emit }) {
		const otpForm = ref();
		const store = useStore();
		const keyCode = ref(null);
		const otpInputs = ref();
		const userInputsArr = ref([]);
		const emailErrorMessage = computed(() => store.state.emailErrorMessage);
		const isVerificationCodeCorrect = computed(() => store.state.isVerificationCodeCorrect);
		const isBtnDisabled = computed(() => {
			if (userInputsArr.value.length === 6 && !isNaN(userInputsArr.value.join(''))) return false;
			return true;
		});
		const userVcode = ref('');

		function returnKeyCode(e) {
			keyCode.value = e.keyCode;
		}
		function unNeededKey() {
			if (keyCode.value === 37) return false;
			if (keyCode.value === 38) return false;
			if (keyCode.value === 39) return false;
			if (keyCode.value === 40) return false;
			if (keyCode.value === 46) return false;
			return true;
		}
		function handleInput(e) {
			const input = e.target;
			let newUserInputsArr = [];
			otpInputs.value.children.forEach((input) =>
				input.value * 1 >= 0 && input.value !== '' ? newUserInputsArr.push(input.value) : ''
			);
			userInputsArr.value = newUserInputsArr;
			if (input.value !== '' && input.nextElementSibling && unNeededKey()) {
				input.nextElementSibling.focus();
			}
			if (input.value === '' && unNeededKey() && input.previousElementSibling) {
				input.previousElementSibling.focus();
			}
			if (userInputsArr.value.length === 0) emit('resetInputsStyle');
		}

		function handlePaste(e) {
			const vcode = e.clipboardData.getData('text');
			const inputs = otpInputs.value.children;
			if (!isNaN(vcode)) {
				const vcodeArr = vcode.split('');
				inputs.forEach((input, i) => {
					input.value = vcodeArr[i];
				});
				otpInputs.value.children[5].focus();
				userInputsArr.value = vcodeArr;
			}

			return;
		}

		function getFormValue() {
			userVcode.value = userInputsArr.value.join('');
			emit('verifyCode', userVcode.value);
		}
		return {
			returnKeyCode,

			isVerificationCodeCorrect,
			emailErrorMessage,
			isBtnDisabled,
			getFormValue,
			handlePaste,
			handleInput,
			otpForm,
			otpInputs,
		};
	},
};
</script>

<style lang="scss" scoped></style>
