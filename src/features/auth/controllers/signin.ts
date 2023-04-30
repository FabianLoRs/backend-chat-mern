import { Request, Response } from 'express';
import { config } from '@configs/configEnvs';
import JWT from 'jsonwebtoken';
import { joiValidation } from '@decorators/joi-validation.decorators';
import HTTP_STATUS from 'http-status-codes';
import { authService } from '@services/db/auth.service';
import { BadRequestError } from '@helpers/errors/badRequestError';
import { loginSchema } from '@auth/schemes/signin';
import { IAuthDocument } from '../interfaces/authDocument.interface';
//import { mailTransport } from '@services/emails/mail.transport';
//import { forgotPasswordTemplate } from '@services/emails/templates/forgot-password/forgot-password-templete';
import { emailQueue } from '@services/queues/email.queue';
import publicIp from 'ip';
import { IResetPasswordParams } from '@user/interfaces/resetPassword.interface';
import moment from 'moment';
import { resetPasswordTemplate } from '@services/emails/templates/reset-password/reset-password-template';

export class SignIn {
	@joiValidation(loginSchema)
	public async read(req: Request, res: Response): Promise<void> {
		const { username, password } = req.body;
		const existingUser: IAuthDocument = await authService.getAuthUserByUsername(username);
		if (!existingUser) {
			throw new BadRequestError('Invalid credentials.');
		}

		const passwordMatch: boolean = await existingUser.comparePassword(password);
		if (!passwordMatch) {
			throw new BadRequestError('Invalid credentials.');
		}

		// REPASAR!
		const userJwt: string = JWT.sign(
			{
				userId: existingUser._id,
				uId: existingUser.uId,
				email: existingUser.email,
				username: existingUser.username,
				avatarColor: existingUser.avatarColor
			},
			config.JWT_TOKEN!
		);

		// Versión de prueba 1
		// await mailTransport.sendMail('rosalinda.mosciski45@ethereal.email', 'Testing develoment email.', 'This is a email testing purposes.');
		// Versión de prueba 2
		/*const resetLink = `${config.CLIENT_URL}/reset-password?token=2455845663211`;
		const template: string = forgotPasswordTemplate.passwordResetTemplate(existingUser.username, resetLink);
		emailQueue.addEmailJob('forgotPasswordEmail', {
			template,
			receiverEmail: 'rosalinda.mosciski45@ethereal.email',
			subject: 'Reset your email password.'
		});*/
		// Versión de prueba 3
		const templateParams: IResetPasswordParams = {
			username: existingUser.username,
			email: existingUser.email,
			ipaddress: publicIp.address(),
			date: moment().format('DD/MM/YYYY HH:mm')
		};
		const template: string = resetPasswordTemplate.passwordResetConfirmationTemplate(templateParams);
		emailQueue.addEmailJob('forgotPasswordEmail', {
			template,
			receiverEmail: 'melyssa14@ethereal.email',
			subject: 'Password reset confirmation.'
		 });
		req.session = { jwt: userJwt };
		res.status(HTTP_STATUS.OK).json({ message: 'User login succesfully.', user: existingUser, token: userJwt });
	}
}
