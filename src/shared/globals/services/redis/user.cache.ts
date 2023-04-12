import { BaseCache } from './base.cache';
import { IUserDocument } from '@user/interfaces/userDocument.interface';
import Logger from 'bunyan';
import { logger } from '@configs/configLogs';
import { ServerError } from '@helpers/errors/serverError';
import { Generators } from '@helpers/generators/generators';

const log: Logger = logger.createLogger('userCache');

export class UserCache extends BaseCache {
	constructor() {
		super('useCache');
	}

	public async saveToUserCache(key: string, userId: string, createUser: IUserDocument): Promise<void> {
		const createAt = new Date();
		const {
			_id,
			uId,
			username,
			email,
			avatarColor,
			blocked,
			blockedBy,
			postsCount,
			profilePicture,
			followersCount,
			followingCount,
			notifications,
			work,
			location,
			school,
			quote,
			bgImageVersion,
			bgImageId,
			social
		} = createUser;

		// Transform of data to redis object
		const dataToSave = {
			_id: `${_id}`,
			uId: `${uId}`,
			username: `${username}`,
			email: `${email}`,
			avatarColor: `${avatarColor}`,
			createdAt: `${createAt}`,
			postsCount: `${postsCount}`,
			blocked: JSON.stringify(blocked),
			blockedBy: JSON.stringify(blockedBy),
			profilePicture: `${profilePicture}`,
			followersCount: `${followersCount}`,
			followingCount: `${followingCount}`,
			notifications: JSON.stringify(notifications),
			social: JSON.stringify(social),
			work: `${work}`,
			location: `${location}`,
			school: `${school}`,
			quote: `${quote}`,
			bgImageVersion: `${bgImageVersion}`,
			bgImageId: `${bgImageId}`
		};

		try {
			if (!this.client.isOpen) {
				await this.client.connect();
			}

			await this.client.ZADD('user', { score: parseInt(userId, 10), value: `${key}` });
			for (const [itemKey, itemValue] of Object.entries(dataToSave)) {
				await this.client.HSET(`users: ${key}`, `${itemKey}`, `${itemValue}`);
			}
		} catch (error) {
			log.error(error);
			throw new ServerError('Server Redis error. Try again.');
		}
	}

	// public async getUsersFromCache(userId: string): Promise<IUserDocument | null> {
	// 	try {
	// 		if (!this.client.isOpen) {
	// 			await this.client.connect();
	// 		}
	// 		// Pending IMPLEMENTATION
	// 		return null;
	// 	} catch (error) {
	// 		throw new ServerError('Server Redis error. Try again.');
	// 	}
	// }

}
