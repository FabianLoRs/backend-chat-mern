import fs from 'fs';
import ejs from 'ejs';
import { IResetPasswordParams } from '@user/interfaces/resetPassword.interface';

class ResetPasswordTemplate {
	public passwordResetConfirmationTemplate(templateParams: IResetPasswordParams): string {
		const { username, email, ipaddress, date } = templateParams;
		return ejs.render(fs.readFileSync(__dirname + '/reset-password-template.ejs', 'utf-8'), {
			username,
			email,
			ipaddress,
			date,
			image_url:
				'https://w7.pngwing.com/pngs/128/567/png-transparent-computer-icons-padlock-padlock-technic-silhouette-symbol-thumbnail.png'
		});
	}
}

export const resetPasswordTemplate: ResetPasswordTemplate = new ResetPasswordTemplate();
