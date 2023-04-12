import HTTP_STATUS from 'http-status-codes';

export class NotAuthorizedError extends Error {
	statusCode = HTTP_STATUS.UNAUTHORIZED;
	status = 'error';

	constructor(message: string) {
		super(message);
	}
}
