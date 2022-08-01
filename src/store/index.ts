import { createStore } from 'vuex';
import dataSet from './modules/dataSet/';
import nmTask from './modules/nmTask';
import serviceAuth from './modules/auth/';
import notification from './modules/notification/';
import helpGuide from './modules/helpGuide/';
import state from './state';

export default createStore({
	modules: { dataSet, serviceAuth, notification, nmTask, helpGuide },
	state,
	//TODO: remove if no needed
	getters: {
		authToken: (state) =>
			state.token.accessToken ? `${state.token.tokenType} ${state.token.accessToken}` : null,
	},
	mutations: {
		SET_AUTHENTICATED(state, status: boolean): void {
			state.authenticated = status;
		},
		SET_USE_LOGIN_DATA(state, userLoginData) {
			state.userLoginData = userLoginData;
		},
		SET_TOKEN(state, status) {
			state.token = status;
		},
		SET_CURRENT_USER_DATA(state, currentUser) {
			state.currentUserData = currentUser;
		},
		SET_IS_CREDENTIAL_CORRECT(state, payload) {
			state.isCredentialCorrect = payload;
		},
		SET_TOAST_STATUS(state, toastDetails) {
			state.toastStatus = toastDetails;
		},
		SET_SHOW_WINDOW_PROGRESS(state, isShowing) {
			state.showWindowProgress = isShowing;
		},
		SET_BLOCKUI_VALUE(state, isBlockUiValue) {
			state.isBlockUi = isBlockUiValue;
		},
		SET_INFO_CONFIRM(state, dialogStatus) {
			state.infoConfirm = { ...dialogStatus };
		},
		SET_isVerificationCodeSent(state, status) {
			state.isVerificationCodeSent = status;
		},
		SET_isCodeVerified(state, status) {
			state.isCodeVerified = status;
		},
		SET_emailErrorMessage(state, message) {
			state.emailErrorMessage = message;
		},
		SET_isVerificationCodeCorrect(state, status) {
			state.isVerificationCodeCorrect = status;
		},
		SET_isRegisterComplete(state, status) {
			state.isRegisterComplete = status;
		},
		SET_IS_MOBILE_VIEW(state, status) {
			state.isMobileView = status;
		},
	},
});
