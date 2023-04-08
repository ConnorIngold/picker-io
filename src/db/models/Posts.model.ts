// // create a new mongoose schema for Posts

// import { Schema, model } from 'mongoose'

// export type Emojis = '👍' | '👎' | '😍' | '😔' | '🤬'
// export interface Reaction {
// 	userId: Schema.Types.ObjectId
// 	emoji: Emojis
// }

// export interface Comment {
// 	userId: string
// 	text: string
// }

// export interface IPost {
// 	userId: string
// 	title: string
// 	text: string
// 	imageUrl?: string
// 	comments?: Comment[]
// 	reactions?: Reaction[]
// }

// const ReactionSchema = new Schema({
// 	userId: { type: Schema.Types.ObjectId, required: true },
// 	emoji: { type: String, required: true },
// })

// const CommentSchema = new Schema({
// 	userId: { type: Schema.Types.ObjectId, required: true },
// 	text: { type: String, required: true },
// })

// const PostSchema = new Schema({
// 	userId: { type: Schema.Types.ObjectId, required: true },
// 	title: { type: String, required: true },
// 	text: { type: String, required: true },
// 	image: { type: Buffer, default: undefined },
// 	reactions: { type: [ReactionSchema], default: [] }, // store reactions as an array of objects
// 	reactionCount: { type: {}, default: {} }, // store the count and user IDs for each emoji in a separate field
// 	comments: { type: [CommentSchema], default: [] },
// })

// export default model<IPost>('Posts', PostSchema)
