import filterXSS from 'xss'; // I will use this function to send clean text to server
import * as yup from 'yup';
import { ref, reactive, onMounted, computed } from 'vue';
import { useStore } from 'vuex';

export default function useDatasetInputValidation(props) {
	const store = useStore();
	const errors = reactive({
		name: '',
		description: '',
	});
	const dataSets = ref([]);
	const isNameUnique = ref(true);
	const formData = computed({
		get: () => store.state.dataSet.userData,
		set: (newUserData) => store.commit('dataSet/SET_USER_DATA', newUserData),
	});
	const Regex = /^[a-zA-Z]+[a-zA-Z0-9_\-\s]*$/;
	const formSchema = yup.object().shape({
		name: yup
			.string()
			.nullable()
			.required()
			.min(5)
			.max(64)
			.matches(
				Regex,
				'Please only use letters, numbers, underscore and hyphen. The name must start with a letter.'
			)
			.label('Dataset name'),
		description: yup.string().nullable().max(200).label('Dataset description'),
	});

	function purifyForm() {
		//xss cleaning the form and if valid committing to store
		formData.value.name = filterXSS(formData.value.name);
		formData.value.description = filterXSS(formData.value.description);
	}

	function checkIsNameUnique() {
		isNameUnique.value = true;
		dataSets.value.forEach((dataset) => {
			if (dataset.name === formData.value.name) {
				if (dataset.id === props.id * 1) {
					// "*1" is for converting id to number
					//if user does not want to chang the name so wont get an error
					isNameUnique.value = true;
					errors.name = '';
					return;
				}
				errors.name = 'Please use unique name';
				isNameUnique.value = false;
				return;
			}
		});
	}
	function validate(field) {
		if (isNameUnique.value)
			formSchema
				.validateAt(field, { [field]: formData.value[field] })
				.then(() => (errors[field] = ''))
				.catch((err) => {
					errors[field] = err.errors[0];
				});
	}
	async function handleValidation() {
		if ((await formSchema.isValid(formData.value)) && isNameUnique.value)
			return store.commit('dataSet/SET_IS_FORM_VALID', true);
		store.commit('dataSet/SET_IS_FORM_VALID', false);
	}
	async function formUploadCheck(field?) {
		purifyForm();
		field && validate(field);
		checkIsNameUnique();
		handleValidation();
		if (store.state.dataSet.isFormValid) {
			store.commit('dataSet/SET_USER_DATA', formData.value);
		}
	}
	onMounted(() => {
		formData.value = store.state.dataSet.userData;
		dataSets.value = store.getters['dataSet/userDatasets'].dataSets;
		formUploadCheck();
	});

	return {
		formUploadCheck,
		errors,
		validate,
		formData,
		dataSets,
	};
}
