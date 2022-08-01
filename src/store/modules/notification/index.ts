let nextId = 1;

export default {
	namespaced: true,
	state: {
		notifications: [],
		errors: {
			// TODO later create central error if needed
			fileUpload: {},
			getAllDataSets: {},
			createDataSet: {},
			deleteDataSet: {},
			editDataSet: {},
			getDataSetDetail: {},
			getTask: {},
		},
		toastLife: 3000,
	},
	mutations: {
		PUSH(state, notification) {
			state.notifications.push({
				id: nextId++,
				...notification,
			});
		},
		DELETE(state, notificationToRemove) {
			state.notifications = state.notifications.filter(
				(notification) => notification.id !== notificationToRemove.id
			);
		},
	},
	actions: {
		add({ commit }, notification) {
			commit('PUSH', notification);
		},
		remove({ commit }, notificationToRemove) {
			commit('DELETE', notificationToRemove);
		},
	},
	getters: {},
};
