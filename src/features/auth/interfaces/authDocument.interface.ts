import { Document } from 'mongoose';
import { ObjectId } from 'mongodb';

export interface IAuthDocument extends Document {
	_id: string | ObjectId;
	uId: string;
	username: string;
	email: string;
	password?: string;
	avatarColor: string;
	createAt: Date;
	comparePassword(password: string): Promise<boolean>;
	hashPassword(password: string): Promise<string>;
}
