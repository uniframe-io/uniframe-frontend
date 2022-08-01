// TODO: need proper document for this file and how to use it with notification

// I am returning error messages, types, location (can be name) of error with the function
export function errorGeneral(loc, err?) {
	let message = '';

	if (err) {
		if (typeof err !== 'string') {
			if (err.response) {
				//TODO need to check with backend
				const shouldLoginAgain =
					err.response.data.message &&
					err.response.data.error_domain == 'API__INVALID_AUTHORIZATION_SCHEMA'
						? true
						: false;
				if (shouldLoginAgain) {
					message = err.response.data.message;
					return;
				}
				// this is the message will show on error
				message = err.response.data.message;
			} else if (err.request) {
				message = 'There is a network issue';
			} else {
				message = err.message;
			}
		} else message = err;
	} else message = 'We are experiencing some issue';

	return {
		type: 'error', //types  success, info,  warn, error //TODO: add type safety to this
		message,
		loc,
	};
}

export function confirmRegister(loc) {
	return {
		type: 'info', //types  success, info,  warn, error //TODO: add type safety to this
		message:
			'Your account registered successfully. In seconds You will be redirected to the Login page',
		loc,
	};
}
export function confirmPasswordChange(loc) {
	return {
		type: 'info', //types  success, info,  warn, error //TODO: add type safety to this
		message:
			'Your account password has changed successfully. In seconds You will be redirected to the Login page',
		loc,
	};
}
export function networkErrorObj(loc, message?) {
	message = message || 'It seems we are experiencing network issue, Please try again later';
	return {
		type: 'error', //types  success, info,  warn, error //TODO: add type safety to this
		message,
		loc,
	};
}

export function error(loc, message?) {
	message =
		message ||
		'Sorry we are experiencing some issues if this error persists please contact our customer service';
	return {
		type: 'error', //types  success, info,  warn, error //TODO: add type safety to this
		message,
		loc,
	};
}

export function idErrorObj(loc) {
	return {
		type: 'error', //types  success, info,  warn, error //TODO: add type safety to this
		message: 'The dataset does not exist',
		loc,
	};
}
