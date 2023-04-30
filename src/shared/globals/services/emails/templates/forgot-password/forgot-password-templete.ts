import fs from 'fs';
import ejs from 'ejs';

class ForgotPasswordTemplate {
	public passwordResetTemplate(username: string, resetLink: string): string {
		return ejs.render(fs.readFileSync(__dirname + '/forgot-password-template.ejs', 'utf-8'), {
			username,
			resetLink,
			image_url:
				'https://w7.pngwing.com/pngs/128/567/png-transparent-computer-icons-padlock-padlock-technic-silhouette-symbol-thumbnail.png'
		});
	}
}

export const forgotPasswordTemplate: ForgotPasswordTemplate = new ForgotPasswordTemplate();
