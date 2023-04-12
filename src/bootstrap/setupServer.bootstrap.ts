import { Application, json, urlencoded, Request, Response, NextFunction } from 'express';
import http from 'http';
import cors from 'cors';
import helmet from 'helmet';
import hpp from 'hpp';
import compression from 'compression';
import cookieSession from 'cookie-session';
import Logger from 'bunyan';
import 'express-async-errors';
import HTTP_STATUS from 'http-status-codes';
import { Server } from 'socket.io';
import { createClient } from 'redis';
import { createAdapter } from '@socket.io/redis-adapter';
// import { config } from '../configs/configEnvs';
import { config } from '@configs/configEnvs';
// import { logger } from '../configs/configLogs';
import { logger } from '@configs/configLogs';
import { CustomError } from '@helpers/errors/customError';
import { IErrorResponse } from '../shared/globals/helpers/errors/errorResponse.interface';

const log: Logger = logger.createLogger('server');

// Design Pattern Singleton: https://refactoring.guru/es/design-patterns/singleton
export class ChatServer {
	private app: Application;

	constructor(app: Application) {
		this.app = app;
	}

	public start(): void {
		this.securityMiddleware(this.app);
    this.standardMiddleware(this.app);
    this.globalErrorHandler(this.app);
    this.startServer(this.app);
	}

	private securityMiddleware(app: Application): void {
		// Design Pattern Synchronizer Token Pattern: https://medium.com/@kaviru.mihisara/synchronizer-token-pattern-e6b23f53518e

		// cookie session
		app.use(
			cookieSession({
				name: 'session',
				keys: [config.SECRET_KEY_ONE!, config.SECRET_KEY_TWO!],
				maxAge: 24 * 7 * 360000, // 24 dias
				secure: config.NODE_ENV !== 'development'
			})
		);
		app.use(hpp());
		app.use(helmet());
		app.use(
			cors({
				origin: config.CLIENT_URL, // '*': Esto me permite habilitar mi sarver a cualquier cliente
				credentials: true, // Configuración obligatoria para producción para credentials en ambientes clouds
				optionsSuccessStatus: 200,
				methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
			})
		);
	}

	private standardMiddleware(app: Application): void {
		app.use(compression());
		app.use(json({ limit: '50mb' }));
		app.use(urlencoded({ extended: true, limit: '50mb' }));
	}

	private globalErrorHandler(app: Application): void {
		app.all('*', (req: Request, res: Response) => {
			res.status(HTTP_STATUS.NOT_FOUND).json({ message: `${req.originalUrl} not found.` });
		});
		app.use((error: IErrorResponse, _req: Request, res: Response, next: NextFunction) => {
			log.error(error);
			if (error instanceof CustomError) {
				return res.status(error.statusCode).json(error.serializeErrors);
			}
			next();
		});
	}

	private async startServer(app: Application): Promise<void> {
		try {
			const httpServer: http.Server = new http.Server(app);
			const socketIO: Server = await this.createSocketIO(httpServer);
			this.startHttpServer(httpServer);
			this.socketIOConnections(socketIO);
		} catch (error) {
			log.error(error);
		}
	}

	private startHttpServer(httpServer: http.Server): void {
		log.info(`Server has started with process ${process.pid}.`);
		const PORT = Number(config.SERVER_PORT); // <- se castea
		httpServer.listen(PORT, () => {
			log.info(`Server running at ${config.SERVER_PORT}.`);
		});
	}

	private async createSocketIO(httpServer: http.Server): Promise<Server> {
		const io: Server = new Server(httpServer, {
      cors: {
        origin: config.CLIENT_URL,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
      }
    });
		const pubClient = createClient({ url: config.REDIS_HOST });
		const subClient = pubClient.duplicate();
		await Promise.all([pubClient.connect(), subClient.connect()]);
		io.adapter(createAdapter(pubClient, subClient));
		return io;
	}

	private socketIOConnections(io: Server): void {
    console.log(io);
    log.info('SocketIO Connections Ok.');
  }
}
