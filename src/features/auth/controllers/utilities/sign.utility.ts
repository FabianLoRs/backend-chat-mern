import { ObjectId } from 'mongodb';
import JWT from 'jsonwebtoken';
import { IAuthDocument } from '@auth/interfaces/authDocument.interface';
import { config } from '@configs/configEnvs';
import { ISignUpData } from '@auth/interfaces/signUpData.interface';
import { Generators } from '@helpers/generators/generators';
import { IUserDocument } from '@user/interfaces/userDocument.interface';

export abstract class SignUpUtility {
	protected signToken(data: IAuthDocument, userObjectId: ObjectId): string {
		return JWT.sign(
			{
				userId: userObjectId,
				uId: data.uId,
				email: data.email,
				username: data.username,
				avatarColor: data.avatarColor
			},
			config.JWT_TOKEN!
		);
	}

	protected signUpData(data: ISignUpData): IAuthDocument {
		const { _id, uId, username, email, password, avatarColor } = data;
		return {
			_id,
			uId,
			username: Generators.firstLetterUppercase(username),
			email: Generators.lowerCase(email),
			password,
			avatarColor,
			createAt: new Date()
		} as unknown as IAuthDocument;
	}

	protected userData(data: IAuthDocument, userObjectId: ObjectId): IUserDocument {
		const { _id, username, email, uId, password, avatarColor } = data;

		return {
			_id: userObjectId,
			authId: _id,
			uId,
			username: Generators.firstLetterUppercase(username),
			email,
			password,
			avatarColor,
			profilePicture: '',
			blocked: [],
			blockedBy: [],
			work: '',
			location: '',
			school: '',
			quote: '',
			bgImageId: '',
			bgImageVersion: '',
			followersCount: 0,
			followingCount: 0,
			postsCount: 0,
			notifications: {
				messages: true,
				reactions: true,
				follows: true
			},
			socials: {
				facebook: '',
				instagram: '',
				twitter: '',
				youtube: ''
			}
		} as unknown as IUserDocument;
	}
}
