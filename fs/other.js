const internalError = "There was an internal error, please reopen the extension";

const errorhandler = err => {
	console.error(err);
};
const catchHandler = error => {
	let { errorType = "log", errorMsg = internalError } = error;
	console[errorType](errorMsg);
};
const rejectHandler = (rej, errType, errMsg) => {
	return rej({ errorType: errType, errorMsg: errMsg });
};

const callFS = handler => window.webkitRequestFileSystem(PERSISTENT, 1024 * 1024 * 128, handler, errorhandler);
