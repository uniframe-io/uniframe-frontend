export default () => ({
	toastLife: 3000,
	isInfoView: true,
	userData: { name: '', description: '' },
	isLoading: false, // for show loading animation later
	fileUploadData: {}, //response from server if call is success
	getAllDataSets: {}, //response from server if call is success
	isFileUploaded: false,
	uploadPercent: 0,
	createdDataSetData: {},
	isFormValid: false, // basic form information
	previewData: {
		id: null,
		ownerId: null,
		previewDataRows: [],
		previewDataHeader: [],
	},
	isDataSetCreated: false,
	isDetailView: true,
	userDataSets: {
		dataSets: [],
	},
	selectedDataSet: {},
	dataSetDetail: {},
	dataSetStatsForDelete: {},
});
