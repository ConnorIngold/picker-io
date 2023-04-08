// import express, { Request, Response } from 'express'
// import Posts, { IPost, Emojis } from '../db/models/Posts.model'
// import loggedIn from '../utils/loggedIn'
// const router = express.Router()

// // Find all posts
// router.get('/all', loggedIn, async (req: Request, res: Response) => {
// 	try {
// 		const posts = await Posts.find()
// 		res.json(posts)
// 	} catch (error) {
// 		res.status(400).json({
// 			message: 'Something went wrong: ' + error,
// 		})
// 	}
// })

// router.put('/posts/:id', async (req: Request, res: Response) => {
// 	const acceptedEmojis: Emojis[] = ['👍', '👎', '😍', '😔', '🤬']
// 	const postData: Partial<IPost> = req.body
// 	const { id } = req.params

// 	// Check if emojis are accepted
// 	if (postData.reactions) {
// 		const emojisAreAccepted = postData.reactions.every(reaction => acceptedEmojis.includes(reaction.emoji))
// 		if (!emojisAreAccepted) {
// 			res.status(400).send({ error: 'Invalid emojis' })
// 			return
// 		}
// 	}

// 	const updatedPost = await Posts.findByIdAndUpdate(id, postData, { new: true })
// 	res.send(updatedPost)
// })

// router.patch('/:postId/reactions', loggedIn, async (req: Request, res: Response) => {
// 	const acceptedEmojis: Emojis[] = ['👍', '👎', '😍', '😔', '🤬']
// 	const postData: Partial<IPost> = req.body
// 	const { postId } = req.params
// 	const { userId } = req as any // userId is added to req by the verifyToken middleware
// 	const { emoji } = req.body

// 	// Check if emojis are accepted
// 	if (postData.reactions) {
// 		const emojisAreAccepted = postData.reactions.every(reaction => acceptedEmojis.includes(reaction.emoji))
// 		if (!emojisAreAccepted) {
// 			res.status(400).send({ error: 'Invalid emojis' })
// 			return
// 		}
// 	}

// 	const updateReactions = async (postId: string, userId: string, emoji: string) => {
// 		await Posts.updateOne(
// 			{ _id: postId },
// 			{ $inc: { [`reactionCount.${emoji}.count`]: 1 }, $addToSet: { [`reactionCount.${emoji}.userIds`]: userId }, $push: { reactions: { userId, emoji } } }
// 		)
// 	}

// 	try {
// 		await updateReactions(postId, userId, emoji)
// 		res.status(200).json({ message: 'Reactions updated' })
// 	} catch (err) {
// 		res.status(500).json({ message: 'Something went wrong' })
// 	}
// })

// export default router
