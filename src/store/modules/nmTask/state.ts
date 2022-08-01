export default () => ({
	toastLife: 3000,
	taskState: { isBatchTask: true, title: 'Batch' }, //check if user on batch Task or realTime task
	isTaskFormValid: false, // Batch task form status
	isInfoView: true,
	userData: { name: '', description: '' },
	isLoading: false, // for show loading animation later
	nmTask: {}, //response from server if call is success
	isFormValid: false, // basic form information
	previewData: {},
	isBatchTaskCreated: false,
	isDetailView: true,
	nmTaskSelected: {},
	groundTruthDatasetSelected: {},
	nameMatchingDatasetSelected: {},
	batchTaskDetail: {},
	realTimeNameMatchingResult: {},
	downloadLink: '',
	batchConfigData: {},
	realTimeConfigData: {},
	cpuConfig: {},
	uiPermission: {},
	//TODO Look for solution without this object
	createdBatchTaskData: {},
	stats: {
		noData: true,
		batch_task: {
			running_count: 0,
			failed_count: 0,
			complete_count: 0,
		},
		realtime_task: {
			running_count: 0,
			failed_count: 0,
			complete_count: 0,
		},
		created_dataset: {
			uploaded_count: 0,
		},
	},
});
