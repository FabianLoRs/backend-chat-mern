import HTTP_STATUS from 'http-status-codes';

export class NotFoundError extends Error {
	statusCode = HTTP_STATUS.NOT_FOUND;
	status = 'error';

	constructor(message: string) {
		super(message);
	}
}
