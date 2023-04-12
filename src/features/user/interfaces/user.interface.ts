import mongoose, { ObjectId } from 'mongoose';
import { INotificationSettings } from './notificationSettings.interface';
import { ISocialLinks } from './socialLinks.interface';

export interface IUser {
	_id: string | ObjectId; // Hash unico ej: 64as6af56asf6asfas5d984f8dfs
	authId: string | ObjectId;
	username: string;
	email: string;
	password?: string;
	avatarColor: string;
	uId: string; // redis
	postCount: number;
	work: string;
	school: string;
	quote: string;
	location: string;
	blocked: mongoose.Types.ObjectId[];
	blockedBy: mongoose.Types.ObjectId[];
	followersCount: number;
	followingCount: number;
	notifications: INotificationSettings;
	social: ISocialLinks;
	bgImageVersion: string;
	bgImageId: string;
	profilePicture: string;
	passwordResetToken?: string;
	passwordResetExpires?: number | string;
	createAt: Date;
}
