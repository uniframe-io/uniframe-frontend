import axios from 'axios';
// import router from '@/router';
import { axiosApiCall, axiosErrorLogger } from '@/helpers/axiosHelper';
import { errorGeneral } from '@/helpers/notificationsStatusObjects';

const ax = axios.create({
	baseURL: process.env.VUE_APP_BASE_URL,
	withCredentials: true,
	headers: {
		Accept: 'application/json',
		'Content-Type': 'application/json',
	},
});

export default {
	async getAllTasks({ state, dispatch, commit }) {
		let url = '/tasks/nm';
		if (state.taskState.isBatchTask) url = 'tasks/nm?nm_type=NAME_MATCHING_BATCH';
		if (!state.taskState.isBatchTask) url = 'tasks/nm?nm_type=NAME_MATCHING_REALTIME';

		const { data, err } = await axiosApiCall(ax.get(url));
		if (data) commit('SET_ALL_TASKS', data);
		if (err) {
			dispatch('notification/add', errorGeneral('getAllTasks', err), {
				root: true,
			});
			axiosErrorLogger(err, 'getAllNmTask');
		}
	},
	async getTask({ dispatch, commit }, id) {
		const { data, err } = await axiosApiCall(ax.get(`/tasks/nm/${id}`));
		if (data) commit('SET_TASK_DETAIL', data);
		if (err) {
			dispatch('notification/add', errorGeneral('getTask', err), {
				root: true,
			});
			axiosErrorLogger(err, 'getTask');
		}
	},
	async deleteTask({ state, dispatch, commit }, taskId) {
		const { data, err } = await axiosApiCall(ax.delete(`/tasks/${taskId}`));
		if (data) {
			commit(
				'SET_TOAST_STATUS',
				{
					severity: 'info',
					summary: 'Task Deleted',
					detail: `Task ${
						state.taskSelected.name ? state.taskSelected.name : `with Id of ${taskId}`
					} Deleted`,
					life: 3000,
				},
				{ root: true }
			);
		}
		if (err) {
			// Error handling comment: <Notification :loc="'getAllTasks' || 'deleteTask'" /> doesn't show up
			dispatch('notification/add', errorGeneral('deleteTask', err), {
				root: true,
			});
			commit(
				'SET_TOAST_STATUS',
				{
					severity: 'error',
					summary: 'Task delete failed',
					detail: `Task delete failed: ${err.response.data.message}`,
					closable: true,
					life: 5000,
				},
				{ root: true }
			);			
			axiosErrorLogger(err, 'deleteTask');
		}
	},

	async actionTaskRunning({ dispatch, commit }, { taskId, action }) {
		const { data, err } = await axiosApiCall(ax.post(`tasks/nm/${taskId}/${action}`));
		if (data) {
			commit(
				'SET_TOAST_STATUS',
				{
					severity: 'info',
					summary: `Task ${action}`,
					detail: `String Matching Task ${action === 'start' ? 'started' : 'stopped'} successfully`,
					closable: true,
					life: 3000,
				},
				{ root: true }
			);
		}
		if (err) {
			axiosErrorLogger(err, 'Task Running');
			commit(
				'SET_TOAST_STATUS',
				{
					severity: 'error',
					summary: 'Task did not start',
					detail: err.response.data.message,
					closable: true,
					life: 3000,
				},
				{ root: true }
			);
			dispatch('notification/add', errorGeneral('createNameMatchingTask', err), {
				root: true,
			});
		}
	},

	async createNameMatchingTask({ dispatch, commit }, payload) {
		const jsonPayload = await JSON.stringify(payload);
		const { data, err } = await axiosApiCall(ax.post('/tasks/nm', jsonPayload));
		if (data) {
			commit(
				'SET_TOAST_STATUS',
				{
					severity: 'info',
					summary: 'Task Created',
					detail: `Task ${data.name} created successfully`,
					closable: true,
					life: 3000,
				},
				{ root: true }
			);
			//Will run task 1 sec after creating task
			setTimeout(() => {
				dispatch('actionTaskRunning', { taskId: data.id, action: 'start' });
			}, 1000);
		}
		if (err) {
			axiosErrorLogger(err, 'createNameMatchingTask');
			commit(
				'SET_TOAST_STATUS',
				{
					severity: 'error',
					summary: `${
						payload.type === 'NAME_MATCHING_REALTIME' ? 'Realtime task' : 'Batch task'
					} not created`,
					detail: `${
						payload.type === 'NAME_MATCHING_REALTIME' ? 'Realtime task' : 'Batch task'
					} not created: ${err.response.data.message}`,
					closable: true,
					life: 5000,
				},
				{ root: true }
			);
			dispatch('notification/add', errorGeneral('createNameMatchingTask', err), {
				root: true,
			});
		}
	},

	async nameMatchByRealTimeTask({ commit, dispatch }, { taskId, queryArr, searchOptions }) {
		const { data, err } = await axiosApiCall(
			ax.post(`tasks/nm/${taskId}/match`, {
				query_keys: queryArr,
				search_option: searchOptions,
			})
		);
		if (data) commit('SET_RT_QUERY_RESULT', data);
		if (err) {
			// Error handling comment: why "getDataSetDetail"?
			axiosErrorLogger(err, 'getDataSetDetail');
			commit(
				'SET_TOAST_STATUS',
				{
					severity: 'error',
					summary: `Realtime search error`,
					detail: `Realtime search failed: ${err.response.data.message}`,
					closable: true,
					life: 5000,
				},
				{ root: true }
			);			
			// Error handling comment: why "getDataSetDetail"?
			dispatch('notification/add', errorGeneral('getDataSetDetail', err), {
				root: true,
			});
		}
	},
	async getMatchedDataDownloadLink({ commit, dispatch }, taskId) {
		const { data, err } = await axiosApiCall(ax.get(`tasks/nm/${taskId}/download-batch-result`));
		if (data) commit('SET_DOWNLOAD_LINK', data);
		if (err) {
			axiosErrorLogger(err, 'getDownloadLink');

			commit(
				'SET_TOAST_STATUS',
				{
					severity: 'error',
					summary: `Download matching result error`,
					detail: `Download matching result failed: ${err.response.data.message}`,
					closable: true,
					life: 5000,
				},
				{ root: true }
			);	

			// Error handling comment: there is no notification component called  "getDownloadLink"?
			dispatch('notification/add', errorGeneral('getDownloadLink', err), {
				root: true,
			});
		}
	},
	async getBatchConfig({ commit, dispatch }) {
		const { data, err } = await axiosApiCall(ax.get(`config/defaults/nm/batch`));
		if (data) commit('SET_BATCH_CONFIG', data);
		if (err) {
			axiosErrorLogger(err, 'getBatchConfig');
			dispatch('notification/add', errorGeneral('getBatchConfig', err), {
				root: true,
			});
		}
	},
	async getCpuConfig({ commit, dispatch }) {
		const { data, err } = await axiosApiCall(ax.get(`config/nm-task-cpu-mem-limit`));
		if (data) commit('SET_CPU_CONFIG', data);
		if (err) {
			axiosErrorLogger(err, 'getCpuConfig');
			dispatch('notification/add', errorGeneral('getCpuConfig', err), {
				root: true,
			});
		}
	},
	// TODO move this to main index
	async getUiPermission({ commit, dispatch }) {
		const { data, err } = await axiosApiCall(ax.get(`config/get-ui-permission`));
		if (data) commit('SET_UI_PERMISSION', data);
		if (err) {
			axiosErrorLogger(err, 'getCpuConfig');
			dispatch('notification/add', errorGeneral('getCpuConfig', err), {
				root: true,
			});
		}
	},
	async getRealTimeConfig({ commit, dispatch }) {
		const { data, err } = await axiosApiCall(ax.get(`config/defaults/nm/real-time`));
		if (data) commit('SET_REALTIME_CONFIG', data);

		if (err) {
			axiosErrorLogger(err, 'getRealTimeConfig');
			dispatch('notification/add', errorGeneral('getRealTimeConfig', err), {
				root: true,
			});
		}
	},
	async getStats({ commit, dispatch }) {
		const { data, err } = await axiosApiCall(ax.get(`stats`));
		if (data) commit('SET_STATS', data);
		if (err) {
			axiosErrorLogger(err, 'getStats');
			dispatch('notification/add', errorGeneral('getStats', err), {
				root: true,
			});
		}
	},
};
