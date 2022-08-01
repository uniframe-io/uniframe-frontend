import VueScrollTo from 'vue-scrollto';
import { useStore } from 'vuex';
import { ref, computed } from 'vue';

export default function useValidation() {
	const store = useStore();
	const isBatchTask = computed(() => store.state.nmTask.taskState.isBatchTask);
	const errors = ref({
		name: '',
		description: '',
		gt_dataset_id: '',
		nm_dataset_id: '',
		search_key_gt: '',
		search_key_nm: '',
		similarity_threshold: '',
	});
	const errorsClasses = ref({
		name: '',
		description: '',
		gt_dataset_id: '',
		nm_dataset_id: '',
		search_key_gt: '',
		search_key_nm: '',
		similarity_threshold: '',
	});
	function resetErrors() {
		errors.value = {
			name: '',
			description: '',
			gt_dataset_id: '',
			nm_dataset_id: '',
			search_key_gt: '',
			search_key_nm: '',
			similarity_threshold: '',
		};
	}
	const name = (dataObj) => {
		if (!dataObj.name || dataObj.name === '') {
			errors.value.name = `Please enter name and description for ${
				isBatchTask.value ? 'batch' : 'realTime'
			} task`;
			errorsClasses.value.name = 'tw-border-2 tw-border-red-400';
		} else {
			errors.value.name = '';
			errorsClasses.value.name = '';
		}
	};
	// const description = (dataObj) => {
	// 	if (!dataObj.description) {
	// 		errors.value.description = `Please enter name and description for ${
	// 			isBatchTask.value ? 'batch' : 'realTime'
	// 		} task`;
	// 		errorsClasses.value.description = 'tw-border-2 tw-border-red-400';
	// 	} else {
	// 		errors.value.description = '';
	// 		errorsClasses.value.description = '';
	// 	}
	// };
	const gt_dataset_id = (dataObj) => {
		if (
			dataObj.ext_info.gt_dataset_config.dataset_id === null ||
			dataObj.ext_info.gt_dataset_config.dataset_id === 0
		) {
			errors.value.gt_dataset_id = 'Please select Ground-truth DataSet';
			errorsClasses.value.gt_dataset_id = 'tw-border-2 tw-border-red-400';
		} else {
			errors.value.gt_dataset_id = '';
			errorsClasses.value.gt_dataset_id = '';
		}
	};
	const nm_dataset_id = (dataObj) => {
		if (
			dataObj.ext_info.nm_dataset_config.dataset_id === null ||
			dataObj.ext_info.nm_dataset_config.dataset_id === 0
		) {
			errors.value.nm_dataset_id = 'Please select matching dataset';
			errorsClasses.value.nm_dataset_id = 'tw-border-2 tw-border-red-400';
		} else {
			errors.value.nm_dataset_id = '';
			errorsClasses.value.nm_dataset_id = '';
		}
	};
	const search_key_gt = (dataObj) => {
		if (!dataObj.ext_info.gt_dataset_config.search_key) {
			errors.value.search_key_gt = 'Please select Ground-truth Key word';
			errorsClasses.value.search_key_gt = 'p-invalid';
		} else {
			errors.value.search_key_gt = '';
			errorsClasses.value.search_key_gt = '';
		}
	};

	const search_key_nm = (dataObj) => {
		if (!dataObj.ext_info.nm_dataset_config.search_key) {
			errors.value.search_key_nm = 'Please select string matching key word';
			errorsClasses.value.search_key_nm = 'p-invalid';
		} else {
			errors.value.search_key_nm = '';
			errorsClasses.value.search_key_nm = '';
		}
	};

	// this function returns where to scroll
	function scroll(err) {
		switch (err) {
			case 'name':
				return '#basic-info';
			// case 'description':
			// 	return '#basic-info';
			case 'nm_dataset_id':
				return '#nm-dataset';
			case 'gt_dataset_id':
				return '#gt-dataset';
			case 'search_key_gt':
				return '#ground-truth-dataset';
			case 'search_key_nm':
				return '#name-matching-dataset';
			case 'selected_cols':
				return '#search-options';
			default:
				return '#basic-info';
		}
	}
	function summary(err) {
		switch (err) {
			case 'name':
				return `${isBatchTask.value ? 'Batch' : 'Realtime'} info empty`;
			// case 'description':
			// 	return `${isBatchTask.value ? 'Batch' : 'Realtime'} info empty`;
			case 'nm_dataset_id':
				return 'No Name-Match Dataset';
			case 'gt_dataset_id':
				return 'No Ground-Truth Dataset';
			case 'search_key_gt':
				return 'No Ground-Truth Key';
			case 'search_key_nm':
				return 'No Name-Match Key';
		}
	}

	function showToastAndScroll(detail) {
		store.commit('SET_TOAST_STATUS', {
			severity: 'error',
			summary: summary(detail),
			detail: errors.value[detail],
			closable: true,
			life: 3000,
		});
		VueScrollTo.scrollTo(scroll(detail));
	}

	// returning validation errors correspond to realtime or nameMatching
	const validateArr = isBatchTask.value
		? ref([name, gt_dataset_id, nm_dataset_id, search_key_gt, search_key_nm])
		: ref([name, gt_dataset_id, search_key_gt]);

	return {
		showToastAndScroll,
		resetErrors,
		errors,
		validateArr,
		errorsClasses,
	};
}
