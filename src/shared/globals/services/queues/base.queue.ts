import Queue, { Job } from 'bull';
import { logger } from '@configs/configLogs';
import Logger from 'bunyan';
import { ExpressAdapter, createBullBoard, BullAdapter } from '@bull-board/express';
import { config } from '@configs/configEnvs';
import { IAuthJob } from '@auth/interfaces/authJob.interface';
import { IEmailJob } from '@user/interfaces/emailJob.interface';
import { IUserJob } from '@user/interfaces/userJob.interface';

type IBaseJobData = IAuthJob | IEmailJob | IUserJob;

let bullAdapters: BullAdapter[] = [];

export let serverAdapter: ExpressAdapter;

export abstract class BaseQueue {
	queue: Queue.Queue;
	log: Logger;

	constructor(queueName: string) {
		this.queue = new Queue(queueName, `${config.REDIS_HOST}`);
		bullAdapters.push(new BullAdapter(this.queue));
		bullAdapters = [...new Set(bullAdapters)];
		serverAdapter = new ExpressAdapter();
		serverAdapter.setBasePath('/queues');

		createBullBoard({
			queues: bullAdapters,
			serverAdapter
		});

		this.log = logger.createLogger(`${queueName}Queue`);

		// completed: Sirve para limpiar la cola
		this.queue.on('completed', (job: Job) => { // on es para apuntar a un evento.
			//job.remove();
		});

		// global:complete: Sirve para ir entregando las trazas de la cola
		this.queue.on('global:completed', (jobId: string) => {
			this.log.info(`Job ${jobId} completed`);
		});

		// stalled: Hacen referencia a procesos en la cola que se encuentran "atorados"
		this.queue.on('global:stalled', (jobId: string) => {
			this.log.info(`Job ${jobId} is stalled`);
		});
	}

	// addJob
	protected addJob(name: string, data: IBaseJobData): void {
		this.queue.add(name, data, { attempts:  3, backoff: { type: 'fixed', delay: 5000 } });
	}

	// processJob
	protected processJob(name: string, concurrency: number, callback: Queue.ProcessCallbackFunction<void>): void {
		this.queue.process(name, concurrency, callback);
	}
}
