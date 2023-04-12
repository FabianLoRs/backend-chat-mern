import { IUserDocument } from '../interfaces/userDocument.interface';
import mongoose, { model, Model, Schema } from 'mongoose';

const userSchema: Schema = new Schema({
	authId: { type: mongoose.Schema.Types.ObjectId, ref: 'Auth' },
	profilePicture: { type: String, default: '' },
	postsCount: { type: Number, default: 0 },
	followersCount: { type: Number, default: 0 },
	followingCount: { type: Number, default: 0 },
	passwordResetToken: { type: String, default: '' },
	passwordResetExpires: { type: Number },
	blocked: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
	blockedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
	notificacions: {
		message: { type: Boolean, default: true },
		reactions: { type: Boolean, default: true },
		comments: { type: Boolean, default: true },
		follows: { type: Boolean, default: true },
	},
	social: {
		facebook: { type: String, default: '' },
		instagram: { type: String, default: '' },
		twitter: { type: String, default: '' },
		youtube: { type: String, default: '' },
	},
	work: { type: String, default: '' },
	school: { type: String, defaul: '' },
	location: { type: String, default: '' },
	quote: { type: String, default: '' }
});

const userModel: Model<IUserDocument> = model<IUserDocument>('User', userSchema, 'User');

export { userModel };

// collections: user
// document: userSchema

// collentions: auth
// decument: authSchema

