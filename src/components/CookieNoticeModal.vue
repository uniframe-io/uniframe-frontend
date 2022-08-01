<template>
	<div>
		<Dialog
			:modal="true"
			position="center"
			:closeOnEscape="false"
			:closable="false"
			:draggable="false"
			header="Your data is safe with us!"
			v-model:visible="displayResponsive"
			:style="{ width: '60vw' }"
			:breakpoints="{ '960px': '75vw' }"
			class="tw-fixed tw-top-20vh md:tw-top-50vh tw-max-h-96"
		>
			<p>
				We use cookies and tracking tools like Google-Analytics to provide you with better
				experience using our website and services. By continuing to this website you agree to our
				use of cookies and tracking tools.
				<!-- and accept our
				<router-link :to="{ name: 'PrivacyPolicy' }" target="_blank">
					<span class="tw-underline tw-text-lg tw-text-primaryColorVariant tw-font-medium">
						privacy and policy
					</span>
				</router-link>
				and
				<router-link :to="{ name: 'TermsAndConditions' }" target="_blank">
					<span class="tw-underline tw-text-lg tw-text-primaryColorVariant tw-font-medium">
						terms and conditions
					</span> </router-link
				>. -->
			</p>
			<template #footer>
				<div class="tw-w-full tw-flex tw-justify-center">
					<Button label="Yes, I accept" icon="pi pi-check" @click="closeResponsive" autofocus />
				</div>
			</template>
		</Dialog>
	</div>
</template>

<script>
import { ref } from 'vue';
import { useStore } from 'vuex';
import Cookies from 'js-cookie';
import { useRouter } from 'vue-router';
export default {
	name: 'CookieNotice',

	setup() {
		const store = useStore();
		const router = useRouter();
		const displayResponsive = ref(false);

		const openResponsive = () => {
			document.documentElement.style.overflow = 'hidden';
			store.commit('SET_BLOCKUI_VALUE', true);
			displayResponsive.value = true;
		};

		const closeResponsive = () => {
			Cookies.set('userConsent', 'true', { expires: 7 });
			window[`ga-disable-${process.env.VUE_APP_GOOGLE_ANALYTICS_ID}`] = false;
			displayResponsive.value = false;
			store.commit('SET_BLOCKUI_VALUE', false);
			document.documentElement.style.overflow = 'auto';
		};
		setTimeout(() => {
			if (!Cookies.get('userConsent') || Cookies.get('userConsent') !== 'true') openResponsive();
		}, 300);
		return {
			openResponsive,
			closeResponsive,
			displayResponsive,
			router,
		};
	},
};
</script>

<style lang="scss" scoped></style>
