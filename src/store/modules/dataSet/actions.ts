import axios from 'axios';
import router from '@/router';
import { axiosApiCall, axiosErrorLogger, uploadPercentCalculator } from '@/helpers/axiosHelper';
import { errorGeneral } from '@/helpers/notificationsStatusObjects';

const ax = axios.create({
	baseURL: process.env.VUE_APP_BASE_URL,
	withCredentials: true,
	headers: {
		Accept: 'application/json',
		'Content-Type': 'application/json',
	},
});
const CancelToken = axios.CancelToken;
let cancel;

export default {
	async cancelRequest({ commit }) {
		cancel('Operation canceled by the user.');
		commit('SET_IS_FILE_UPLOADED', false);
		setTimeout(() => {
			commit('SET_UPLOAD_PERCENT', 0);
		}, 5000);
	},
	async fileUpload({ commit, dispatch }, fromData) {
		//axiosApiCall is custom function for for try and catch and return data in axios response format
		const { data, err } = await axiosApiCall(
			ax.post('/medias/upload', fromData, {
				headers: {
					'Content-Type': 'multipart/form-data',
				},
				onUploadProgress: (progressEvent) => {
					const { loaded, total } = progressEvent;
					commit('SET_UPLOAD_PERCENT', uploadPercentCalculator(loaded, total));
				},
				cancelToken: new CancelToken(function executor(c) {
					// An executor function receives a cancel function as a parameter
					cancel = c;
				}),
			})
		);

		if (data) {
			commit('SET_FILE_UPLOAD_DATA', data);
			commit('SET_IS_FILE_UPLOADED', true);
			commit('SET_UPLOAD_PERCENT', 0);
		} else {
			dispatch('notification/add', errorGeneral('fileUpload', err), { root: true });
			axiosErrorLogger(err, 'fileUpload'); //axios error logger just logs errors in axios format
		}
	},
	//
	async getAllDataSets({ commit, dispatch }) {
		const { data, err } = await axiosApiCall(ax.get('/datasets'));
		if (data) {
			commit('SET_USER_DATASETS', data);
		} else {
			commit('SET_FETCHING_DATASETS_ERROR', true);
			dispatch('notification/add', errorGeneral('getAllDataSets', err), { root: true });
			axiosErrorLogger(err, 'getAllDataSets');
		}
	},
	//
	async dataPreview({ commit, getters }) {
		//I am getting data from fileUploadData
		// this is async for "row " variable
		const { id, owner_id: ownerId, ext_info: extInfo } = getters.fileUploadData;
		const { header, first_n_rows: firstRows } = extInfo;
		const row = await JSON.parse(firstRows);
		const data = {
			id,
			ownerId,
			previewDataRows: row,
			previewDataHeader: header,
		};
		commit('SET_PREVIEW_DATA', data);
	},
	//
	async createDataSet({ commit, getters, dispatch }) {
		const reqData = await JSON.stringify(getters.dataSetData);
		const { data, err } = await axiosApiCall(ax.post('/datasets', reqData));
		if (data) {
			commit('SET_CREATED_DATASET_DATA', data);
			commit('SET_IS_DETAIL_VIEW', true);
			commit('SET_IS_INFO_VIEW', true);
			commit('SET_RESET_USER_DATA'); //this will reset the form
		} else {
			dispatch('notification/add', errorGeneral('getAllDataSets', err), {
				root: true,
			});
			axiosErrorLogger(err, 'createDataSet');
		}
	},
	//
	async deleteDataSet({ commit, dispatch, state }, id) {
		const { data, err } = await axiosApiCall(ax.delete(`/datasets/${id}`));
		if (data) {
			commit(
				'SET_TOAST_STATUS',
				{
					severity: 'info',
					summary: 'DataSet Deleted',
					detail: `DataSet ${
						state.selectedDataSet.name ? state.selectedDataSet.name : `with ID of ${id}`
					} Deleted`,
					life: 3000,
				},
				{ root: true }
			);
			commit('SET_SELECTED_DATASET', {}); //deselect dataset
		} else {
			commit('SET_TOAST_STATUS', {
				severity: 'warn',
				summary: 'Dataset not selected',
				detail: `Please select a dataset to delete`,
				life: 3000,
			});
			dispatch('notification/add', errorGeneral('getAllDataSets', err), {
				root: true,
			});
			axiosErrorLogger(err, 'deleteDataSet');
		}
	},
	async checkDataSetStatsForDelete({ commit, dispatch }, id) {
		const { data, err } = await axiosApiCall(ax.get(`/datasets/${id}/stats`));
		if (data) commit('SET_DATA_SET_STATS_FOR_DELETE', data);
		if (err) {
			dispatch('notification/add', errorGeneral('getAllDataSets', err), {
				root: true,
			});
			axiosErrorLogger(err, 'deleteDataSet');
		}
	},
	//
	async editDataSet({ commit, getters, dispatch }, id) {
		const { data, err } = await axiosApiCall(ax.patch(`/datasets/${id}`, getters.editData));
		if (data) {
			commit('SET_SELECTED_DATASET', {});
			router.replace({ name: 'DataSetList' });
		} else {
			dispatch('notification/add', errorGeneral('editDataSet', err), { root: true });
			axiosErrorLogger(err, 'editDataSet');
		}
	},
	//
	async getDataSetDetail({ commit, dispatch }, id) {
		const { data, err } = await axiosApiCall(ax.get(`/datasets/${id}`));
		if (data) {
			// I am sending only file info to "data.media"
			commit('SET_FILE_UPLOAD_DATA', data.media);
			dispatch('dataPreview');
			commit('SET_DATASET_DETAIL', data);
		} else {
			dispatch('notification/add', errorGeneral('getDataSetDetail', err), { root: true });
			dispatch('notification/add', errorGeneral('editDataSet', err), { root: true });
			axiosErrorLogger(err, 'getDataSetDetail');
		}
	},
};
