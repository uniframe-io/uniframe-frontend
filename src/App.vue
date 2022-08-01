<template>
	<div v-if="isBlockUi" class="glass tw-absolute tw-inset-0 tw-z-10"></div>
	<CookieNotice />
	<ProgressBar
		v-if="showWindowProgress"
		mode="indeterminate"
		style="height: 0.25em"
		class="progress-bar tw-w-full tw-top-0 tw-z-20 tw-absolute"
	/>
	<ProgressSpinner
		v-if="isBlockUi"
		animationDuration=".5s"
		class="tw-z-30 tw-fixed tw-right-2/5 tw-top-1/2"
	/>
	<Toast position="top-right" class="tw-z-50" />
	<div class="back-ground">
		<div>
			<Notification loc="testToken" class="tw-w-full tw-z-10" />
			<TheNavBar />
			<router-view />
		</div>
	</div>
</template>
<script>
import { useToast } from 'primevue/usetoast';

import { useStore } from 'vuex';
import { useRoute } from 'vue-router';
import TheNavBar from './components/TheNavBar.vue';
import CookieNotice from '@/components/CookieNoticeModal.vue';
import { onMounted, watch, computed, onUnmounted, ref } from 'vue';
import _ from 'lodash';

export default {
	name: 'App',
	components: {
		TheNavBar,
		CookieNotice,
	},

	setup() {
		const store = useStore();
		const route = useRoute();
		const toast = useToast();
		const isBlockUi = computed(() => store.state.isBlockUi);
		const windowWidth = ref(window.innerWidth);
		const isMobileView = computed({
			get: () => store.state.isMobileView,
			set: (status) => store.commit('SET_IS_MOBILE_VIEW', status),
		});
		const showWindowProgress = computed({
			get: () => store.state.showWindowProgress,
			set: (isShowing) => store.commit('SET_SHOW_WINDOW_PROGRESS', isShowing),
		});

		watch(
			() => store.state.toastStatus,
			() => {
				if (store.state.toastStatus.removeOthers) toast.removeAllGroups();
				toast.add(store.state.toastStatus);
			},
			{ immediate: true }
		);
		watch(
			() => route.path,
			() => {
				if (_.includes(route.path, 'nm-real-time-task'))
					store.commit('nmTask/SET_IS_BATCH_TASK', false);
				if (_.includes(route.path, 'nm-batch-task')) store.commit('nmTask/SET_IS_BATCH_TASK', true);
			}
		);
		const onWidthChange = () => (windowWidth.value = window.innerWidth);
		onMounted(() => window.addEventListener('resize', onWidthChange));
		onUnmounted(() => window.removeEventListener('resize', onWidthChange));
		watch(
			() => windowWidth.value,
			() => (isMobileView.value = windowWidth.value < 768),
			{ immediate: true }
		);
		onMounted(async () => {
			showWindowProgress.value = true; //this starts the progress bar at the top
			//here I am testing the token every time when App reloads
			await store.dispatch('testToken');
			showWindowProgress.value = false;
		});

		return {
			showWindowProgress,
			isBlockUi,
		};
	},
};
</script>

<style lang="scss">
/* cSpell:disable */
@import '@/style/config';
html {
	scroll-behavior: smooth;
}

.p-progress-spinner {
	position: absolute !important;
	margin: auto !important;
}
#app {
	position: relative;
	width: 100%;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
}
</style>
