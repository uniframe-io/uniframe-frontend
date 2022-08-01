import convertToLocalObject from '@/helpers/convertToLocalObject';

export default {
	SET_IS_INFO_VIEW(state, status: boolean): void {
		state.isInfoView = status; //Whether to show Basic information in dataset
	},
	SET_USER_DATA(state, newUserData) {
		state.userData = { ...state.userData, ...newUserData };
	},
	SET_RESET_USER_DATA(state) {
		state.userData = { name: '', description: '' };
	},
	SET_FILE_UPLOAD_DATA(state, payload) {
		state.fileUploadData = payload;
	},
	SET_CREATED_DATASET_DATA(state, payload) {
		state.createdDataSetData = payload;
	},
	SET_PREVIEW_DATA(state, payload) {
		state.previewData = payload;
	},
	SET_IS_FILE_UPLOADED(state, payload) {
		state.isFileUploaded = payload;
	},
	SET_IS_DATASET_CREATED(state, payload) {
		state.isDataSetCreated = payload;
	},
	SET_USER_DATASETS(state, payload) {
		state.userDataSets.dataSets = payload;
	},

	SET_IS_DETAIL_VIEW(state, payload) {
		state.isDetailView = payload;
	},
	SET_IS_FORM_VALID(state, payload) {
		state.isFormValid = payload;
	},
	SET_SELECTED_DATASET(state, payload) {
		state.selectedDataSet = payload;
	},
	SET_DATASET_DETAIL(state, payload) {
		state.dataSetDetail = convertToLocalObject([payload])[0];
	},
	RESET_SELECTED_DATA(state) {
		state.selectedDataSet = {};
	},
	SET_FETCHING_DATASETS_ERROR(state, payload) {
		state.isFetchingDatasetsError = payload;
	},
	SET_UPLOAD_PERCENT(state, uploadedPercent) {
		state.uploadPercent = uploadedPercent;
	},
	SET_DATA_SET_STATS_FOR_DELETE(state, statsFromServer) {
		state.dataSetStatsForDelete = statsFromServer;
	},
};
