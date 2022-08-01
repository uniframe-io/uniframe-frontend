<template>
	<div class="tw-mx-auto tw-max-w-screen-3xl tw-flex h-screen--20 tw-bg-white tw-items-start">
		<BlueLayout v-if="!isMobileView" class="background tw-w-2/5 tw-h-full" />
		<div
			class="
				md:tw-w-3/5
				tw-w-full tw-flex tw-flex-col tw-justify-center tw-items-center tw-gap-10 tw-mt-8
			"
		>
			<h1 class="h3-bold">Welcome Back!</h1>
			<TheLoginForm class="tw-w-full" v-if="!store.state.authenticated" />
			<h3 v-else class="h3-bold">You have already signed in</h3>
		</div>
	</div>
</template>
<script>
import TheLoginForm from '../components/TheLoginForm.vue';
import BlueLayout from '../components/BlueLayout.vue';
import { useStore } from 'vuex';
import { computed } from 'vue';
export default {
	//TODO: create captcha for the forms
	name: 'Signin',
	components: {
		TheLoginForm,
		BlueLayout,
	},
	setup() {
		const store = useStore();
		return {
			store,
			isMobileView: computed(() => store.state.isMobileView),
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
