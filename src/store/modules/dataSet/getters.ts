export default {
	fileUploadData(state) {
		return state.fileUploadData;
	},
	dataSetData(state) {
		const data = {
			name: state.userData.name,
			description: state.userData.description,
			media_id: state.previewData.id * 1,
		};
		return data;
	},
	previewData(state) {
		return state.previewData;
	},
	userDatasets(state) {
		return state.userDataSets;
	},
	editData(state) {
		const data = {
			name: state.userData.name,
			description: state.userData.description,
		};
		return data;
	},
};
