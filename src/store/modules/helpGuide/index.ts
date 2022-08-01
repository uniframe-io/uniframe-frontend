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
	namespaced: true,
	state: {
		toastLife: 3000,
		helpGuideData: {
			dataset_list: {
				text: 'The dataset is a 2-dimensional plain text table. It can be created, edited, and deleted by you, and can be used by string matching tasks.',
				link: '/terminology/#dataset',
			},
			dataset_create: {
				text: 'When creating dataset, you can set up dataset name and description, and upload a file. The created dataset can be used by string matching tasks.',
				link: '/manual/#create-dataset',
			},
			dataset_create_upload: {
				text: 'Click "choose file" button to select a local file. Currently we only support CSV and Excel (xls and xlsx) file',
				link: '/manual/#create-dataset',
			},
			dataset_detail: {
				text: 'This page shows the detailed dataset information.',
				link: '/manual/#dataset-detail',
			},
			dataset_preview: {
				text: 'Dataset preview shows the header and the top 5 rows of the file.',
				link: '/manual/#create-dataset',
			},
			dataset_edit: {
				text: 'When editing dataset, you can change the name and description. If you want to upload another file, please create another dataset',
				link: '/manual/#create-dataset',
			},
			rt_matching_task_list: {
				text: 'The real-time matching task matches a small amount string with a groundtruth dataset in a near real-time.',
				link: '/terminology/#real-time-string-matching-task',
			},
			rt_matching_task_create: {
				text: 'Create a managed real-time matching task to match a small amount string with a groundtruth dataset in a near real-time',
				link: '/manual/#create-real-time-string-matching-task',
			},
			batch_matching_task_list: {
				text: 'The batch matching task matches a large matching dataset with a groundtruth dataset.',
				link: '/terminology/#batch-string-matching-task',
			},
			batch_matching_task_create: {
				text: 'Create a managed batch matching task to match a large matching dataset with a groundtruth dataset.',
				link: '/manual/#create-batch-string-matching-task',
			},
			batch_matching_task_result_preview: {
				text: "When batch task complete, the preview data shows the header and the top 5 rows of the matching result.",
				link: "/terminology/#batch-string-matching-task"
			},    	
			matching_task_select_gt_dataset: {
				text: 'Groundtruth dataset is the dataset to be matched. Please select one dataset from your dataset list, and select the match key(s)',
				link: '/terminology/#groundtruth-dataset',
			},
			matching_task_select_matching_dataset: {
				text: 'Matching dataset is the dataset you want to match to the groundtruth dataset. Please select one dataset from your dataset list, and select the match key(s)',
				link: '/terminology/#matching-dataset',
			},
			matching_options: {
				text: 'Matching options decide the matching result',
				link: '/terminology/#matching-options',
			},
			matching_options_topn: {
				text: 'the most similar N (blue color) result for each matching key',
				link: '/terminology/#number-of-matching-result',
			},
			matching_options_threshold: {
				text: 'only similarity score greater than the threshold can be regarded as a matching',
				link: '/terminology/#number-of-matching-result',
			},
			matching_options_extra_columns: {
				text: 'pick up columns from groundtruth dataset in the matching result',
				link: '/terminology/#columns-as-matching-result',
			},
			name_description: {
				text: 'Input a unique name in the name field and any information in description field',
				link: '/terminology/#name-and-description',
			},
			computation_setup: {
				text: 'Select computation resource for string matching task',
				link: '/terminology/#computation-resource',
			},
			computation_setup_resource: {
				text: 'Select a T-shirt size of the computation resource',
				link: '/terminology/#t-shirt-size',
			},
			computation_setup_type: {
				text: 'Select the computation type',
				link: '/terminology/#computation-type',
			},
			advanced_algo_setup: {
				text: 'Adapt the matching algorithm to your dataset',
				link: '/terminology/#advanced-algorithm-options',
			},
			advanced_algo_setup_type: {
				text: 'Select algorithm type, edit distance or vector-based distance',
				link: '/terminology/#algorithm-type',
			},
			advanced_algo_setup_case_sensitive: {
				text: 'Setup case sensitive preprocessing',
				link: '/terminology/#case-sensitive',
			},
			advanced_algo_setup_legal_name: {
				text: 'Normalize company legal form',
				link: '/terminology/#company-legal-form-normalization',
			},
			advanced_algo_setup_init_abbreviation: {
				text: 'Extract initial letter as abbreviation',
				link: '/terminology/#initial-abbreviations',
			},
			advanced_algo_setup_rm_punct: {
				text: 'Remove punctuation',
				link: '/terminology/#remove-punctuation',
			},
			advanced_algo_setup_normalize_accent_char: {
				text: 'Normalize accented characters, e.g., converting Ä, Â, Ă to A',
				link: '/terminology/#normalize-accent-character',
			},
			advanced_algo_setup_shorthand: {
				text: 'Replace string by common used shorthand expression',
				link: '/terminology/#shorthand-format-processing',
			},
			advanced_algo_setup_tokenize_option: {
				text: 'Tokenization method: word or subword',
				link: '/terminology/#vector-based-algorithm',
			},
			advanced_algo_setup_cosine_match_type: {
				text: 'Similarity computation: exact matching or approximately matching',
				link: '/terminology/#vector-similarity',
			},
			defaultHelp: {
				text: 'Get started with our help document',
				link: '/',
			},
		},
	},
	mutations: {
		SET_HELP_GUIDE(state, helpGuideDataFromServer) {
			state.helpGuideData = helpGuideDataFromServer;
		},
	},
	actions: {
		async getHelpGuide({ commit, dispatch }) {
			const { data, err } = await axiosApiCall(ax.get(`config/help-guide`));
			if (data) commit('SET_HELP_GUIDE', data);
			if (err) {
				axiosErrorLogger(err, 'getHelpGuide');
				dispatch('notification/add', errorGeneral('getHelpGuide', err), {
					root: true,
				});
			}
		},
	},
	getters: {},
};
