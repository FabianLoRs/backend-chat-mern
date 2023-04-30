import nodemmail from 'nodemailer';
import Mail from 'nodemailer/lib/mailer';
import sendGridMail from '@sendgrid/mail';
import Logger from 'bunyan';
import { logger } from '@configs/configLogs';
import { config } from '@configs/configEnvs';
import { BadRequestError } from '@helpers/errors/badRequestError';

const log: Logger = logger.createLogger('mailOptions');
sendGridMail.setApiKey(config.SENDGRID_API_KEY!);

interface IMailOptions {
	from: string;
	to: string;
	subject: string;
	html: string;
}

class MailTransport {
	public async sendMail(receiverEmail: string, subject: string, body: string): Promise<void> {
		if (config.NODE_ENV === 'test' || config.NODE_ENV === 'development') {
			this.developmentEmailSender(receiverEmail, subject, body);
		} else {
			this.productionEmailSender(receiverEmail, subject, body);
		}
	}

	private async developmentEmailSender(receiverEmail: string, subject: string, body: string) {
		const transporter: Mail = nodemmail.createTransport({
			host: 'smtp.ethereal.email',
			port: 587,
			secure: false,
			auth: {
				user: config.SENDER_EMAIL,
				pass: config.SENDER_EMAIL_PASSWORD
			}
		});

		const mailOptions: IMailOptions = {
			from: `Chat App <${config.SENDER_EMAIL}>`,
			to: receiverEmail,
			subject,
			html: body
		};

		try {
			await transporter.sendMail(mailOptions);
			log.info('Development email sent successfully.');
		} catch (error) {
			log.error('Error sending email: ', error);
			throw new BadRequestError('Error sending email.');
		}
	}

	private async productionEmailSender(receiverEmail: string, subject: string, body: string) {
		const mailOptions: IMailOptions = {
			// cambiar a las credenciales de sendgrid
			from: `Chat App <${config.SENDER_EMAIL}>`,
			to: receiverEmail,
			subject,
			html: body
		};

		try {
			await sendGridMail.send(mailOptions);
			log.info('Development email sent successfully.');
		} catch (error) {
			log.error('Error sending email: ', error);
			throw new BadRequestError('Error sending email.');
		}
	}
}

export const mailTransport: MailTransport = new MailTransport();
