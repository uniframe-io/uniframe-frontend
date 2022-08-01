<template>
	<div ref="glassLayout" v-if="isBlockUi" class="glass tw-fixed tw-inset-0 tw-z-20"></div>
	<DesktopNoticeModal :show="showDesktopNotice()" />
	<div
		class="
			tw-shadow-lg
			tw-w-full
			tw-h-20
			tw-mx-auto
			tw-border-b-2
			tw-border-primaryColor
			tw-sticky
			tw--top-0
			tw-z-20
		"
		:class="returnMenuColorClass"
	>
		<div class="tw-max-w-screen-3xl tw-mx-auto tw-h-full tw-z-20 tw-overflow-hidden">
			<div class="tw-flex tw-items-center tw-justify-between tw-h-20">
				<router-link class="tw-z-20" :to="{ name: 'Home' }">
					<div
						@click="refresh"
						class="tw-h-14 tw-flex tw-items-center tw-mx-8"
						:class="returnMenuColorClass === 'tw-bg-white' ? 'tw-w-14' : 'tw-w-36  md:tw-w-48'"
					>
						<img
							alt="logo"
							:src="
								returnMenuColorClass === 'tw-bg-white'
									? require('../assets/pure-logo-light-bg.svg')
									: require('../assets/logo-dark-bg-beta.svg')
							"
							class="tw-p-1"
						/>

						<div
							v-if="returnMenuColorClass === 'tw-bg-white'"
							class="tw-h-full tw-items-end tw-flex"
						>
							<small
								class="tw-text-xs"
								:class="
									returnMenuColorClass === 'tw-bg-white' ? 'tw-text-primaryColor ' : 'tw-text-white'
								"
								>beta</small
							>
						</div>
					</div>
				</router-link>
				<div
					class="tw-w-full tw-flex tw-items-center tw-m-5"
					:class="{
						'tw-justify-between': showLinksAccordingToRoutes,
						'tw-justify-end': !showLinksAccordingToRoutes,
						'tw-flex-row-reverse': isMobileView && showLinksAccordingToRoutes,
					}"
				>
					<div
						v-if="showLinksAccordingToRoutes && !isMobileView"
						class="navbar-links tw-flex tw-items-center tw-gap-4"
					>
						<router-link
							class="
								tw-z-20 tw-w-20 tw-text-center tw-text-base tw-font-semibold
								hover:tw-font-bold
								tw-no-underline tw-h-12 tw-flex tw-justify-center tw-items-center
							"
							:class="{
								'tw-text-white': showLinksAccordingToRoutes,
								'no-underline': item.label === 'Blog' || item.label == 'Github',
							}"
							v-for="(item, i) in primaryItemsForRoute"
							:key="i"
							:to="item.to"
						>
							<span
								:ref="
									(el) => {
										linksElements[i] = el;
									}
								"
								@click="item.click"
							>
								{{ item.label }}

								<i v-if="item.icon" class="tw-ml-1 tw-text-xs" :class="item.icon"></i>
							</span>
						</router-link>
					</div>

					<div class="tw-flex md:tw-gap-4 tw-w-1/2 tw-justify-end md:tw-pr-5">
						<router-link
							class="tw-z-20"
							v-for="(item, i) in authenticationItemsForRoute"
							:key="i"
							:to="item.to"
						>
							<Button
								v-if="!isMobileView"
								:label="item.label"
								@click="item.command"
								:class="item.twClass"
							/>
						</router-link>
						<div class="tw-z-20 tw-flex tw-gap-5">
							<!-- TODO for now this is a button, later will change to Avatar image -->
							<Button
								v-if="handleShowAvatarButton"
								class="
									btn-primary btn-primary-hollow
									focus:tw-outline-none focus:tw-shadow-none
									tw-text-lg tw-p-0 tw-w-12 tw-h-12 tw-rounded-full
								"
								:class="{ 'menu-btn-white': route.name === 'Home' }"
								@click="goToSetting"
								:label="currentUserName.split('', 1)[0]"
								v-tooltip.bottom="'Go to Profile'"
							/>

							<div
								ref="menuBtn"
								v-if="handleShowMenuButton"
								class="
									animate__animated
									menu-btn
									tw-p-0 tw-w-12 tw-h-12 tw-rounded-full
									focus-within:
									tw-flex tw-items-center tw-justify-center
									hover:
									tw-cursor-pointer tw-transition-all tw-duration-500 tw-ease-in-out
								"
								:class="{
									'hover:tw-bg-blue-50': returnMenuColorClass === 'tw-bg-white',
									'': returnMenuColorClass === 'tw-bg-primaryColor',
								}"
								@click="toggle"
							>
								<div
									ref="menuBtnIcon"
									class="animate__animated"
									:class="
										returnMenuColorClass === 'tw-bg-white'
											? 'tw-text-primaryColor'
											: 'tw-text-white'
									"
								>
									<i :class="menuIcon"></i>
								</div>
							</div>
						</div>

						<Menu
							ref="menu"
							:model="layoutMenuItems"
							popup
							class="
								navbar-menu
								tw-bg-primaryColor tw-border-none tw-mt-5 tw-py-5 tw-rounded-lg tw-flex tw-flex-col
							"
						>
							<template #item="{ item }">
								<router-link :to="item.to">
									<span
										@click="item.click"
										:class="{
											'tw-h-20 tw-m-auto  hover:tw-bg-primaryColor hover:tw-text-white tw-text-center':
												item.avatar,
											'hover:tw-text-primaryColor': !item.avatar,
										}"
										class="
											tw-w-full tw-inline-block tw-text-lg tw-rounded-sm
											hover:tw-bg-white
											tw-text-white tw-px-8 tw-py-2
										"
									>
										<div
											v-if="item.avatar"
											class="
												tw-mr-2
												tw-rounded-full
												tw-h-12
												tw-w-12
												tw-align-middle
												tw-bg-white
												tw-inline-flex
												tw-items-center
												tw-content-center
											"
										>
											<img
												class="tw-m-auto tw-h-6 tw-align-middle"
												src="../assets/images/icons/blueIcons/profile.svg"
												alt=""
											/>
										</div>
										{{ item.label }}
										<i class="tw-ml-1 tw-text-xs" :class="item.icon"></i>
										<div
											v-if="item.avatar"
											class="tw-h-px tw-w-full tw-bg-white tw-m-auto tw-mt-5"
										></div>
									</span>
								</router-link>
							</template>
						</Menu>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
import { computed, ref, watch } from 'vue';
import { useStore } from 'vuex';
import { useRoute, useRouter } from 'vue-router';
import DesktopNoticeModal from '@/components/DesktopNoticeModal.vue';
export default {
	name: 'TheNavbar',
	components: { DesktopNoticeModal },
	setup() {
		// const router = useRouter();
		const route = useRoute();
		const router = useRouter();
		const store = useStore();
		const currentUserName = computed(() => store.state.currentUserData.fullName);
		const navLink = ref();
		const menuBtn = ref();
		const menuBtnIcon = ref();
		const glassLayout = ref();
		const isBlockUi = ref(false);
		const isMenuOpen = ref(false);
		const isMobileView = computed(() => store.state.isMobileView);
		const showLinksAccordingToRoutes = computed(() => {
			if (
				route.name === 'Home' ||
				route.name === 'About' ||
				route.name === 'Contact' ||
				route.name === '404' ||
				route.name === 'LoginRequired' ||
				route.name === 'Blog'
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
		const handleShowMenuButton = computed(() => {
			if (
				store.state.authenticated &&
				(route.path.includes('dashboard') || showLinksAccordingToRoutes) &&
				(route.name !== '404' || route.name === 'LoginRequired')
			)
				return true;
			if (!store.state.authenticated && isMobileView.value) return true;
			return false;
		});
		const handleShowAvatarButton = computed(() => {
			if (store.state.authenticated) return true;
			return false;
		});
		//Changing  menu Icon here
		const menuIcon = computed(() => {
			if (isMenuOpen.value) return 'animate__animated pi pi-times tw-text-2xl';
			return 'animate__animated pi pi-bars tw-text-2xl';
		});
		const linksElements = ref([]);
		const menu = ref();
		const primaryItems = computed(() => [
			{
				label: 'Home',
				to: { name: 'Home' },
				visible: true,
			},
			{
				label: 'Dashboard',
				to: { name: 'Dashboard' },
				visible: store.state.authenticated,
			},

			{
				label: 'Contact',
				to: { name: 'Contact' },
				visible: true,
			},
			{
				label: 'Blog',
				to: { name: 'Home' },
				visible: true,
				icon: 'pi pi-external-link',
				click: () => window.open('https://uniframe.medium.com/'),
			},
			{
				label: 'Github',
				to: { name: 'Home' },
				visible: true,
				icon: 'pi pi-external-link',
				click: () => window.open('https://github.com/uniframe-io/'),
			},			
		]);
		const layoutMenuItems = computed(() => [
			{
				label: currentUserName.value,
				to: { name: 'Setting' },
				visible: true,
				avatar: true,
			},
			...primaryItems.value,
			{
				label: 'Logout',
				to: { name: 'Home' },
				visible: store.state.authenticated,
				click: async () => {
					await store.dispatch('logOut');
					router.push({ name: 'Home' });
					router.go(0);
				},
			},
			{
				label: 'Signup',
				to: { name: 'Signup' },
				visible: !store.state.authenticated,
				twClass: 'tw-w-50 tw-w-24 tw-h-9 btn-primary-hollow tw-z-20',
			},
			{
				label: 'Login',
				to: { name: 'Signin' },
				visible: !store.state.authenticated,
				twClass: 'tw-w-50 tw-w-24 tw-h-9 btn-primary tw-border-2 tw-border-white tw-z-20',
			},
		]);

		const toggle = (event) => {
			menu.value.toggle(event);

			menuBtnIcon.value.classList.add('animate__flipInX');
			setTimeout(() => {
				menuBtnIcon.value.classList.remove('animate__flipInX');
			}, 500);
		};
		// for handling menu icon
		watch(
			() => {
				if (menu.value) return menu.value.overlayVisible;
			},
			() => {
				if (menu.value) {
					isBlockUi.value = Boolean(menu.value.overlayVisible);
					isMenuOpen.value = Boolean(menu.value.overlayVisible);
				}
			}
		);

		//for disable BlockUi
		watch(
			() => route.name,
			() => {
				isBlockUi.value = false;
				menu.value.hide();
			}
		);

		const authenticationItems = computed(() => [
			{
				label: 'Signup',
				to: { name: 'Signup' },
				visible: !store.state.authenticated,
				twClass: 'tw-w-50 tw-w-24 tw-h-9 btn-primary-hollow tw-z-20',
			},
			{
				label: 'Login',
				to: { name: 'Signin' },
				visible: !store.state.authenticated,
				twClass: 'tw-w-50 tw-w-24 tw-h-9 btn-primary tw-border-2 tw-border-white tw-z-20',
			},
		]);
		function refresh() {
			if (route.name !== 'Home') return router.push({ name: 'Home' });
			setTimeout(() => {
				if (route.name === 'Home') return router.go(0);
			}, 50);
		}
		function showDesktopNotice() {
			if (route.path.includes('dashboard') && isMobileView.value) return true;
			return false;
		}
		const goToSetting = () => {
			router.push({ name: 'Setting' });
		};
		//will show only the items with correspond to the route
		const primaryItemsForRoute = computed(() => primaryItems.value.filter((item) => item.visible));
		const authenticationItemsForRoute = computed(() =>
			authenticationItems.value.filter((item) => item.visible)
		);
		return {
			showDesktopNotice,
			DesktopNoticeModal,
			isMobileView,
			refresh,
			showLinksAccordingToRoutes,
			returnMenuColorClass,
			menuBtnIcon,
			glassLayout,
			menuBtn,
			handleShowAvatarButton,
			currentUserName,
			goToSetting,
			isBlockUi,
			handleShowMenuButton,
			menuIcon,
			isMenuOpen,
			layoutMenuItems,
			toggle,
			menu,
			store,
			route,
			linksElements,
			navLink,
			primaryItemsForRoute,
			authenticationItemsForRoute,
		};
	},
};
</script>
<style lang="scss">
@import '@/style/config';

.navbar-menu {
	background-color: $primaryColor !important;
	width: auto !important;
	min-width: 15rem !important;
}

.navbar-links {
	.router-link-exact-active {
		display: flex;
		align-items: center;
		justify-content: center;
		height: 3rem;
		border-bottom: $white solid 2px;
	}
}
.no-underline {
	border-bottom: none !important;
}
.p-tooltip-text {
	color: $white !important;
}
</style>
