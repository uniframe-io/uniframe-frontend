<template>
	<div
		class="tw-relative tw-w-full tw-flex md:tw-h-28 tw-h-32 tw-mx-auto tw-z-20 tw-overflow-hidden"
		:class="returnMenuColorClass"
	>
		<div
			class="
				tw-flex
				tw-items-center
				tw-h-full
				tw-relative
				tw-justify-between
				tw-overflow-hidden
				tw-w-full
				tw-mx-auto
				tw-gap-5
				md:tw-gap-8
			"
		>
			<router-link
				class="md:tw-ml-5 tw-ml-2 tw-h-4/6 tw-w-32 md:tw-w-72 tw-flex tw-items-center tw-z-20"
				:to="{ name: 'Home' }"
			>
				<div
					class="tw-w-full"
					:class="returnMenuColorClass === 'tw-bg-white' ? 'tw-w-14' : 'tw-w-48  md:tw-w-52'"
				>
					<img
						alt="logo"
						:src="
							returnMenuColorClass === 'tw-bg-white'
								? require('../assets/pure-logo-light-bg.svg')
								: !isMobileView
								? require('../assets/logo-tagline-dark-bg.svg')
								: require('../assets/pure-logo-dark-bg.svg')
						"
						class="tw-p-1 tw-h-full tw-w-full"
					/>
				</div>
			</router-link>
			<div
				class="
					tw-flex tw-h-4/6 tw-flex-col
					md:tw-w-auto
					tw-w-20
					md:tw-justify-between
					tw-justify-start
				"
			>
				<p class="tw-text-white md:tw-text-2xl tw-text-lg tw-font-bold tw-h-8">
					<router-link class="tw-text-white" :to="{ name: 'Contact' }">Contacts</router-link>
				</p>
				<div class="tw-flex tw-mx-auto tw-items-center tw-gap-4 md:tw-gap-6 tw-h-6 md:tw-h-8">
					<p class="tw-text-white tw-h-6 md:tw-text-lg tw-text-base tw-flex tw-gap-2 tw-items-end">
						<a
							class="tw-h-full tw-text-white tw-flex tw-gap-2"
							:href="`mailto:${email}`"
							target="_blank"
							><img
								class="tw-w-6 tw-h-full"
								src="../assets/images/icons/whiteIcons/envelope.svg"
								alt=""
							/>{{ `${isMobileView ? '' : 'Email'}` }}</a
						>
					</p>
					<!-- <p class="tw-text-white tw-h-6 md:tw-text-lg tw-text-base tw-flex tw-gap-2 tw-items-end">
						<a class="tw-h-full tw-text-white tw-flex tw-gap-2" :href="linkedin" target="_blank">
							<img
								class="tw-w-6 tw-h-full"
								src="../assets/images/icons/linkedin-white.svg"
								alt=""
							/>{{ `${isMobileView ? '' : 'Linkedin'}` }}</a
						>
					</p> -->
				</div>
			</div>
			<div class="tw-flex tw-flex-col tw-justify-start tw-gap-3 tw-h-4/6 tw-w-32 md:tw-w-40">
				<router-link
					class="tw-text-white md:tw-text-base tw-text-sm"
					:to="{ name: 'PrivacyPolicy' }"
					target="_blank"
					>Privacy policy</router-link
				>
				<router-link
					class="tw-text-white md:tw-text-base tw-text-sm"
					:to="{ name: 'TermsAndConditions' }"
					target="_blank"
					>Terms and conditions</router-link
				>
			</div>
			<div
				class="
					tw-h-4/6 tw-overflow-hidden tw-flex tw-flex-col
					md:tw-justify-end
					tw-justify-start tw-pr-2
				"
			>
				<small class="tw-text-white tw-text-sm"
					><span class="md:tw-text-lg tw-text-base tw-mr-1">©</span
					><span class="tw-text-xs md:tw-text-base">{{ thisYear }} </span>
					<span class="tw-text-xs md:tw-text-base"> uniframe.io | All Rights Reserved </span>
				</small>
			</div>
		</div>
	</div>
</template>
<script>
import { computed } from 'vue';
import { useStore } from 'vuex';
import { useRoute, useRouter } from 'vue-router';
export default {
	name: 'Footer',

	setup() {
		const route = useRoute();
		const router = useRouter();
		const store = useStore();
		const thisYear = computed(() => {
			let d = new Date();
			return d.getFullYear();
		});
		const showLinksAccordingToRoutes = computed(() => {
			if (
				route.name === 'Home' ||
				route.name === 'About' ||
				route.name === 'Contact' ||
				route.name === '404' ||
				route.name === 'LoginRequired'
			)
				return true;
			return false;
		});
		const returnMenuColorClass = computed(() => {
			if (
				(route.path.includes('dashboard') ||
					route.path.includes('forgot-password') ||
					route.path.includes('signin') ||
					route.path.includes('signup')) &&
				route.name !== '404'
			)
				return 'tw-bg-white';
			return 'tw-bg-primaryColor';
		});

		return {
			isMobileView: computed(() => store.state.isMobileView),
			thisYear,
			showLinksAccordingToRoutes,
			returnMenuColorClass,
			store,
			route,
			router,
			email: process.env.VUE_APP_CONTACT_EMAIL,
			// linkedin: process.env.VUE_APP_CONTACT_LINKEDIN,
		};
	},
};
</script>
<style lang="scss">
@import '@/style/config';
</style>
