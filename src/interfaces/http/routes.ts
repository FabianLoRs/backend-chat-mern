import { Application } from 'express';
// authRoutes
import { authRoutes } from '@auth/routes/authRoutes';
import { serverAdapter } from '@services/queues/base.queue';

const BASE_PATH = '/api/v1';

// REPASAR!
export default (app: Application) => {
	const routes = () => {
		app.use('/queues', serverAdapter.getRouter());
		app.use(BASE_PATH, authRoutes.routes());
	};
	routes();
};
