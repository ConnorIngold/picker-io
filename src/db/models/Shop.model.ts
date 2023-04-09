import { Document, model, Schema } from 'mongoose'

export interface ShopifySession extends Document {
	id: string
	shop: string
	state: string
	isOnline: boolean
	scope?: string
	expires?: Date
	accessToken?: string
	onlineAccessInfo?: {
		accessToken: string
		expiresIn: number
		url: string
	}
}

const shopifySessionSchema = new Schema({
	id: {
		type: String,
		required: true,
	},
	shop: {
		type: String,
		required: true,
	},
	state: {
		type: String,
		required: true,
	},
	isOnline: {
		type: Boolean,
		required: true,
	},
	scope: {
		type: String,
		required: false,
	},
	expires: {
		type: Date,
		required: false,
	},
	accessToken: {
		type: String,
		required: false,
	},
	onlineAccessInfo: {
		accessToken: {
			type: String,
			required: false,
		},
		expiresIn: {
			type: Number,
			required: false,
		},
		url: {
			type: String,
			required: false,
		},
	},
})

export const ShopifySessionModel = model<ShopifySession>('ShopifySession', shopifySessionSchema)
