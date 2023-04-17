import { hash, compare } from 'bcryptjs';
import { IAuthDocument } from '@auth/interfaces/authDocument.interface';
import { model, Model, Schema } from 'mongoose';
import { config } from '@configs/configEnvs';

//const SALT_ROUND = 10;
// Design Patter AAA (Authorization, Authentication, Auditory) / Security for Design (SbD): https://www.ticportal.es/glosario-tic/seguridad-diseno-sbd

const authSchema: Schema = new Schema(
  {
    username: { type: 'String' },
    uId: { type: 'String' },
    email: { type: 'String' },
    password: { type: 'String' },
    avatarColor: { type: 'String' },
    createdAt: { type: Date, default: Date.now() }
  },
	{
		toJSON: {
			transform(_doc, ret) {
				delete ret.password;
				return ret;
			}
		}
	}
);

// Virtual Methods / spaces methods
authSchema.pre('save', async function (this: IAuthDocument, next: () => void) {
	const hashedPassword: string = await hash(this.password as string, Number(config.SALT_ROUND));
	this.password = hashedPassword;
	next();
});

authSchema.methods.comparePassword = async function (password: string): Promise<boolean> {
	const hashedPassword: string = (this as IAuthDocument).password!;
	return compare(password, hashedPassword);
};

authSchema.methods.hashPassword = async function (password: string): Promise<string> {
	return hash(password, Number(config.SALT_ROUND));
};

const AuthModel: Model<IAuthDocument> = model<IAuthDocument>('Auth', authSchema, 'Auth');
export { AuthModel };

// Transform document
// encrypt
