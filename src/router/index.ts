import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import store from '../store/index';
import Home from '../views/Home.vue';
import PageNotFound from '../views/PageNotFound.vue';
import NetworkError from '../views/NetworkError.vue';
import LoginRequired from '../views/LoginRequired.vue';
import dataSetRoutes from './dataSetRoutes';
import batchTaskRoutes from './batchTaskRoutes';
import realTimeTaskRoutes from './realTimeTaskRoutes';

const routes: Array<RouteRecordRaw> = [
	{
		path: '/',
		name: 'Home',
		component: Home,
	},
	{
		path: '/about',
		name: 'About',
		// route level code-splitting
		// this generates a separate chunk (about.[hash].js) for this route
		// which is lazy-loaded when the route is visited.
		component: () => import(/* webpackChunkName: "about" */ '../views/About.vue'),
	},
	{
		path: '/contact',
		name: 'Contact',
		component: () => import(/* webpackChunkName: "contact" */ '../views/Contact.vue'),
	},
	{
		path: '/help',
		name: 'Help',
		component: () => import(/* webpackChunkName: "help" */ '../views/Help.vue'),
	},
	{
		path: '/',
		name: 'Blog',
		component: Home,
	},
	{
		path: '/signup',
		name: 'Signup',
		component: () => import(/* webpackChunkName: "signUp" */ '../views/Signup.vue'),
		beforeEnter: () => {
			if (store.state.authenticated) return false;
		},
	},
	{
		path: '/terms-and-conditions',
		name: 'TermsAndConditions',
		component: () =>
			import(/* webpackChunkName: "TermsAndConditions" */ '../views/TermsAndConditions.vue'),
	},
	{
		path: '/privacy-policy',
		name: 'PrivacyPolicy',
		component: () => import(/* webpackChunkName: "PrivacyPolicy" */ '../views/PrivacyPolicy.vue'),
	},
	{
		// secure route
		path: '/dashboard',
		props: true,
		name: 'Dashboard',
		component: () => import(/* webpackChunkName: "dashboard" */ '../views/dashboard/Dashboard.vue'),
		meta: { requiresAuth: true },
		children: [
			{
				path: 'setting',
				name: 'Setting',
				component: () => import(/* webpackChunkName: "setting" */ '../views/dashboard/Setting.vue'),
			},
			dataSetRoutes,
			realTimeTaskRoutes,
			batchTaskRoutes,
		],
	},
	{
		path: '/signin',
		name: 'Signin',
		component: () => import(/* webpackChunkName: "Signin" */ '../views/Signin.vue'),
		beforeEnter: () => {
			if (store.state.authenticated) return false;
		},
	},
	{
		path: '/forgot-password',
		name: 'ForgotPassword',
		component: () => import(/* webpackChunkName: "ForgotPassword" */ '../views/ForgotPassword.vue'),
	},
	{
		path: '/404/:resource',
		name: '404Resource',
		component: PageNotFound,
	},
	{
		path: '/network-error',
		name: 'NetworkError',
		component: NetworkError,
	},
	{
		path: '/login-required',
		name: 'LoginRequired',
		component: LoginRequired,
	},
	{
		path: '/:pathMatch(.*)',
		name: '404',
		component: PageNotFound,
	},
];

const router = createRouter({
	history: createWebHistory(process.env.BASE_URL),
	routes,
	scrollBehavior() {
		// always scroll to top
		return { top: 0 };
	},
});

// Guard section

router.afterEach((to, from) => {
	//here if user is authenticated and navigates to login they will redirected to dashboard after 1s
	if (to.name === 'Signin' && store.state.authenticated === true) {
		setTimeout(() => {
			router.push({ name: 'Dashboard' });
		}, 1000);
	}
	setTimeout(() => {
		// this is top progress bar for better UI/UX
		// this is set to "true" on each navigation turn it off here after 300ms to be seen by user
		store.commit('SET_SHOW_WINDOW_PROGRESS', false);
	}, 300);
	// here I redirect user after login to Dashboard
	// when user redirected from  (only) "Signin" to "Dashboard" I am showing some primary UI
	if (to.name === 'Dashboard' && from.name === 'Signin') {
		store.commit('SET_BLOCKUI_VALUE', true);
		// I refresh browser when we go from login to dashboard
		// this is behavior can change later
		// will call test token on refresh
		setTimeout(() => {
			router.go(0);
			store.commit('SET_BLOCKUI_VALUE', false);
		}, store.state.uiTimeOut);
	}
});

// This is main authentication logic
// If route needs to be authenticated before entering the route I am calling "test-token"
router.beforeResolve(async (to) => {
	if (to.name) store.commit('SET_SHOW_WINDOW_PROGRESS', true);
	// here if user once authenticated then I wont call "test-token" again
	// So first time I am checking and testing the token,
	// "authenticated" flag is being set in "testToken" function at 'store/modules/auth/index.ts'
	// Second time if user is not authenticated wont allowed to the page
	if (to.meta.requiresAuth && !store.state.authenticated) {
		await store.dispatch('testToken');
	}
	if (to.meta.requiresAuth && !store.state.authenticated) {
		router.push({ name: 'LoginRequired' });
		return false;
	}
});

export default router;
