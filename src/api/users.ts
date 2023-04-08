import express, { Request, Response } from 'express'
import loggedIn from '../utils/loggedIn.js'
import User, { IUser } from '../db/models/User.model.js'

const router = express.Router()

router.get('/', loggedIn, (req: Request, res: Response) => {
	// find user in db by email with findOne and then respond with user info but not password
	User.findOne({ email: (req as any).user.email }, '-password')
		.then(user => {
			res.status(200).json(user)
		})
		.catch(err => {
			res.status(400).json({
				message: 'Something went wrong: ' + err,
			})
		})
})

// Update user info (name, email)
router.put('/', loggedIn, (req: Request, res: Response) => {
	// find user in db by email with findOne and then update user info
	User.findOneAndUpdate({ email: (req as any).user.email }, { name: req.body.name, email: req.body.email }, { new: true, runValidators: true })
		.then(user => {
			res.status(200).json(user)
		})
		.catch(err => {
			res.status(400).json({
				message: 'Something went wrong: ' + err,
			})
		})
})

// delete user
router.delete('/', loggedIn, (req: Request, res: Response) => {
	// find user in db by email with findOne and then delete user
	User.findOneAndDelete({ email: (req as any).user.email })
		.then(user => {
			res.status(200).json(user)
		})
		.catch(err => {
			res.status(400).json({
				message: 'Something went wrong: ' + err,
			})
		})
})

export default router
