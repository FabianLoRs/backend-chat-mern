import { logger } from '@configs/configLogs';
import { DoneCallback, Job } from 'bull';
import { mailTransport } from '@services/emails/mail.transport';
import Logger from 'bunyan';

const log: Logger = logger.createLogger('emailWorker');

class EmailWorker {
	async addNotificationEmail(job: Job, done: DoneCallback): Promise<void> {
		try {
			const { receiverEmail, subject, template} = job.data;
			await mailTransport.sendMail(receiverEmail, subject, template);
			job.progress(100);
			done(null, job.data);
		} catch (error) {
			log.error(error);
			done(error as Error);
		}
	}
}

export const emailWorker: EmailWorker = new EmailWorker();
