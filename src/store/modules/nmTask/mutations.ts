export default {
	SET_SELECTED_GROUND_TRUTH_DATASET(state, selectedDataset) {
		state.groundTruthDatasetSelected = selectedDataset;
	},
	SET_SELECTED_NAME_MATCHING_DATASET(state, selectedDataset) {
		state.nameMatchingDatasetSelected = selectedDataset;
	},
	SET_USER_DATA(state, newUserData) {
		state.userData = { ...state.userData, ...newUserData };
	},
	SET_ALL_TASKS(state, allNmTaskFormServer) {
		state.nmTask = allNmTaskFormServer;
	},
	SET_TASK(state, data) {
		state.createdBatchTaskData = { ...state.createdBatchTaskData, ...data };
	},

	SET_TASK_DETAIL(state, data) {
		state.batchTaskDetail = { ...state.batchTaskDetail, ...data };
	},
	SET_IS_TASK_FORM_VALID(state, status) {
		state.isTaskFormValid = status;
	},
	SET_IS_FORM_VALID(state, status) {
		state.isFormValid = status;
	},
	SET_BATCH_TASK_SELECTED(state, selectedTask) {
		state.taskSelected = selectedTask;
	},
	SET_IS_BATCH_TASK(state, status) {
		state.taskState.isBatchTask = status;
		status ? (state.taskState.title = 'Batch') : (state.taskState.title = 'Realtime');
	},
	SET_RT_QUERY_RESULT(state, realTimeQueryResult) {
		state.realTimeNameMatchingResult = realTimeQueryResult;
	},
	SET_DOWNLOAD_LINK(state, downloadLink) {
		state.downloadLink = downloadLink;
	},

	// TODO check for this if we can delete it and only use SET_TASK
	SET_CREATED_BATCH_TASK_DATA(state, createdBatchTaskData) {
		state.createdBatchTaskData = createdBatchTaskData;
	},
	SET_REALTIME_CONFIG(state, realTimeConfigData) {
		state.realTimeConfigData = realTimeConfigData;
		state.realTimeConfigData.name = '';
		state.realTimeConfigData.description = '';
	},
	SET_BATCH_CONFIG(state, batchConfigData) {
		state.batchConfigData = batchConfigData;
		state.batchConfigData.name = '';
		state.batchConfigData.description = '';
	},
	SET_STATS(state, statsDataFromServer) {
		state.stats = statsDataFromServer;
	},
	SET_CPU_CONFIG(state, cpuConfig) {
		state.cpuConfig = cpuConfig;
	},
	SET_UI_PERMISSION(state, uiPermission) {
		state.uiPermission = uiPermission;
	},
};
