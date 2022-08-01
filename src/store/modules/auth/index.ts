import axios from 'axios';
import router from '@/router';
import Cookies from 'js-cookie';

import { axiosApiCall, axiosErrorLogger } from '@/helpers/axiosHelper';

import { errorGeneral, confirmPasswordChange } from '@/helpers/notificationsStatusObjects';

const ax = axios.create({
	baseURL: process.env.VUE_APP_BASE_URL,
	withCredentials: true,
	headers: {
		Accept: 'application/json',
		'Content-Type': 'application/json',
	},
});

export default {
	actions: {
		//here I am calling test-token and storing user data
		//after that I am setting "authenticated" flag to "true"
		// this flag should only modified to true here, anywhere else modified to "false"
		testToken: async ({ commit, dispatch, state }) => {
			const { data, err } = await axiosApiCall(ax.post('/test-token', ''));
			if (data) {
				const currentUser = {
					email: data.email,
					fullName: data.full_name,
					id: data.id,
					createData: data.created_at,
				};
				commit('SET_CURRENT_USER_DATA', currentUser);
				commit('SET_AUTHENTICATED', true);
				return;
			}

			if (err) {
				// "errorGeneral" gets two arguments
				//first one determines the location of message which is used in component to
				// show proper one
				//  second one is optional and can
				//  be string or axios error object
				if (state.authenticated) {
					// I am showing error message only when user authenticated
					// so it wont show up on login screen
					//TODO should be improved later
					dispatch('notification/add', errorGeneral('testToken', err), {
						root: true,
					});
					axiosErrorLogger(err, 'testToken');
				}
				commit('SET_AUTHENTICATED', false);
				return;
			}
		},
		// TODO: enhance error handling for login and registration
		//This function checks if the credentials are correct by calling '/login' end point
		// if credentials are correct I set "isCredentialCorrect" in state to "true"
		//otherwise show the error
		authenticate: async ({ commit, dispatch }, userLoginData) => {
			const params = new URLSearchParams();
			params.append('username', userLoginData.userEmail);
			params.append('password', userLoginData.userPassword);
			const config = {
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded',
				},
			};
			const { data, err } = await axiosApiCall(ax.post('/login', params, config));
			if (data) {
				commit('SET_IS_CREDENTIAL_CORRECT', true);
			} else {
				commit('SET_AUTHENTICATED', false);
				commit('SET_TOKEN', '');
				dispatch('notification/add', errorGeneral('authenticate', err), {
					root: true,
				});
				axiosErrorLogger(err, 'authenticate');
			}
		},
		register: async ({ commit, dispatch }, credentials) => {
			const { data, err } = await axiosApiCall(ax.post('/signup', credentials));
			if (data) {
				// TODO: improve this code regarding getting token
				const accessToken = await Cookies.get('Authorization');
				const tokenType = 'Bearer';
				commit('SET_TOKEN', { accessToken, tokenType });
				commit('SET_isRegisterComplete', true);
			} else {
				dispatch('notification/add', errorGeneral('register', err), {
					root: true,
				});
				axiosErrorLogger(err);
			}
		},
		// TODO: Deactivate Account -> enhance UI / UX for

		deactivateAccount: async ({ commit }) => {
			const { data, err } = await axiosApiCall(ax.post('/deactivate', ''));
			if (data) commit('SET_AUTHENTICATED', false);
			if (err) axiosErrorLogger(err);
		},

		// TODO add check for old password should not be the same
		// TODO: add error handling to update password later
		updatePassword: async ({ commit }, body) => {
			const { data, err } = await axiosApiCall(ax.post('/reset-password', body));
			if (data) {
				commit('SET_TOAST_STATUS', {
					severity: 'info', // String => success, info, warn, error
					summary: 'Password Updated',
					detail: 'Your password has been updated',
					closable: true,
					life: 3000,
				});
				return;
			} else {
				axiosErrorLogger(err);
			}
		},
		getVerificationCode: async ({ commit }, userData) => {
			const { data, err } = await axiosApiCall(ax.post('/vcode/send', userData));
			if (data) {
				commit('SET_isVerificationCodeSent', true);
				commit('SET_TOAST_STATUS', {
					severity: 'info', // String => success, info, warn, error
					summary: 'Verify your email',
					detail: 'You will receive an email with verification code shortly',
					closable: true,
					//BUG state is undefined here
					life: 2000,
				});
				return;
			}
			if (err) {
				await commit('SET_emailErrorMessage', err.response.data.message);
				axiosErrorLogger('send verification code', err);
			}
		},
		verifyUserCode: async ({ commit }, userData) => {
			const { data, err } = await axiosApiCall(ax.post('/vcode/verify', userData));
			if (data) {
				commit('SET_isCodeVerified', true);
				commit('SET_TOAST_STATUS', {
					severity: 'info', // String => success, info, warn, error
					summary: 'Your code is verified',
					detail: 'Thank you, your verification code is correct',
					closable: true,
					life: 2000,
				});
				return;
			}
			if (err) {
				commit('SET_isVerificationCodeCorrect', false);
				axiosErrorLogger('verified code', err);
			}
		},
		changePassword: async ({ dispatch, commit }, userData) => {
			const { data, err } = await axiosApiCall(
				ax.post('/password/recover', {
					email: userData.userEmail,
					action: 'forget_password',
					vcode: userData.userCode,
					new: userData.newPassword,
				})
			);
			if (data) {
				commit('SET_BLOCKUI_VALUE', true);
				dispatch('notification/add', confirmPasswordChange('changePassword'));
				setTimeout(() => {
					router.replace({ name: 'Signin' });
					setTimeout(() => {
						commit('SET_BLOCKUI_VALUE', false);
						router.go(0);
					}, 1000);
				}, 2000);
				return;
			}
			if (err) {
				axiosErrorLogger('changePassword', err);
			}
		},

		logOut: async ({ commit }) => {
			if (process.env.VUE_APP_ENVIRONMENT !== 'prod') console.log('logout');
			const { data, err } = await axiosApiCall(ax.post('/logout', ''));
			if (data) commit('SET_AUTHENTICATED', false);
			if (err) axiosErrorLogger(err);
		},
	},
};
