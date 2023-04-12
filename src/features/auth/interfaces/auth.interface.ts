import { Document } from 'mongoose';
import { ObjectId } from 'mongodb';
import { IUserDocument } from '@user/interfaces/userDocument.interface';

declare global {
	namespace Express {
		interface Request {
			currentUser?: AuthPayload;
		}
	}
}

export interface AuthPayload {
	userId: string;
	uId: string;
	email: string;
	username: string;
	avatarColor: string;
	iat?: number; // Expiration time token
}

export interface IAuthDocument extends Document {
	_id: string | ObjectId;
	uid: string;
	username: string;
	password?: string;
	avatarColor: string;
	createAt: Date;
	comparePassword(password: string): Promise<boolean>;
	hashPassword(password: string): Promise<string>;
}

export interface ISignUpData {
	_id: ObjectId;
	uid: string;
	email: string;
	username: string;
	password: string;
	avatarColor: string;
}

export interface IAuthJob { // Permite identificar procesos para los workers
	value?: string | IAuthDocument | IUserDocument;

}
