import { Schema, Document, model } from 'mongoose'

export interface IUser extends Document {
	name: string
	email: string
	username: string
	password: string
	referral_code: string
	permissions: 'developer' | 'admin' | 'user'
	date: Date
}

const UserSchema = new Schema({
	name: {
		type: String,
		required: true,
	},
	email: {
		type: String,
		required: true,
		unique: true,
	},
	username: {
		type: String,
		required: false,
		unique: true,
	},
	password: {
		type: String,
		required: true,
	},
	referral_code: {
		type: String,
		required: true,
		unique: true,
		default: (): string => Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15),
	},
	permissions: {
		type: String,
		enum: ['developer', 'admin', 'user'],
		default: 'user',
		required: true,
	},
	date: {
		type: Date,
		default: Date.now,
		required: true,
	},
})

const User = model<IUser>('User', UserSchema)

export default User
