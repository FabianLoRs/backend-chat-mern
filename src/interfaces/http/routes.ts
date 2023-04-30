import { Application, Request, Response } from 'express';
// authRoutes
import { authRoutes } from '@auth/routes/authRoutes';
import { serverAdapter } from '@services/queues/base.queue';
import { config } from '@configs/configEnvs';
import { currentUserRoutes } from '@auth/routes/currentRoutes';
import { authMiddleware } from '@helpers/middlewares/auth-middleware';

// REPASAR!
export default (app: Application) => {
	const routes = () => {
		app.use('/healthcheck', (_req: Request, res: Response) => res.send('Server is OK!'));
		app.use('/queues', serverAdapter.getRouter());
		app.use(config.BASE_PATH!, authRoutes.routes());
		app.use(config.BASE_PATH!, authRoutes.signoutRoute());

		app.use(config.BASE_PATH!, authMiddleware.verufyUser, currentUserRoutes.routes());
	};
	routes();
};
