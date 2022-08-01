export default {
	authenticated: false,
	dashboardIndex: 1,
	formNameValidationGuideForDataset:
		'Maximum of 64 alphanumeric characters. Can include hyphens (-), underscore (_) and space ( ). Must be unique within your Datasets names',
	formNameValidationGuideForTask:
		'Maximum of 64 alphanumeric characters. Can include hyphens (-), underscore (_) and space ( ). Must be unique within your Tasks names',
	formDescriptionValidationGuide: 'Maximum of 200 alphanumeric characters',
	showWindowProgress: true,
	isCredentialCorrect: false,
	toastStatus: {
		severity: '',
		summary: '',
		detail: '',
		closable: true,
		life: 5000,
		removeOthers: false,
	},

	userLoginData: {
		userEmail: '',
		userPassword: '',
	},
	currentUserData: {
		email: '',
		fullName: '',
		id: 0,
		createData: '',
	},

	token: {
		isError: false,
		tokenType: null,
		accessToken: null,
	},
	isBlockUi: false,
	infoConfirm: { isDialogShow: false, tasks: null },
	uiTimeOut: 2000,
	toastLife: 3000,
	isVerificationCodeSent: false,
	isCodeVerified: false,
	emailErrorMessage: null,
	isVerificationCodeCorrect: true,
	isRegisterComplete: false,
	isMobileView:false
};
