import store from '@/store';
import router from '@/router';
export async function axiosApiCall(fn) {
	store.commit('SET_SHOW_WINDOW_PROGRESS', true);
	const response = { data: null, err: null };
	try {
		const { data } = await fn;
		response.data = data;
		store.commit('SET_SHOW_WINDOW_PROGRESS', false);
	} catch (error) {
		//TODO: later check this function if server change the message
		const shouldLoginAgain = error.response?.data.message //add ? to check for respond first
			? error.response.data.error_domain == 'API__INVALID_AUTHORIZATION_SCHEMA'
			: false;
		if (shouldLoginAgain && store.state.authenticated) {
			if (process.env.VUE_APP_ENVIRONMENT !== 'prod') console.log(error.response.data.message);
			store.dispatch('logOut');
			router.push({ name: 'Signin' });
		}
		response.err = error;
		setTimeout(() => {
			store.commit('SET_SHOW_WINDOW_PROGRESS', false);
		}, 5000);
	}
	return response;
}
export function axiosErrorLogger(err, reference?) {
	console.warn('axios error in ', reference, 'see the logs below');
	if (err.response) {
		if (process.env.VUE_APP_ENVIRONMENT !== 'prod') console.log('res.data', err.response.data);
	} else if (err.request) {
		if (process.env.VUE_APP_ENVIRONMENT !== 'prod') console.log('req', err.request);
	} else {
		if (process.env.VUE_APP_ENVIRONMENT !== 'prod') console.log('Error message', err.message);
	}
	if (err.config && process.env.VUE_APP_ENVIRONMENT !== 'prod') console.log('config', err.config);
}
export function uploadPercentCalculator(loaded, total) {
	return Math.floor((loaded * 100) / total);
}
