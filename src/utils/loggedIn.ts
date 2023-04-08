import dotenv from 'dotenv'
dotenv.config()

import { Request, Response, NextFunction } from 'express'
// import jwt from 'jsonwebtoken'

const secret = process.env.TOKEN_SECRET || ''

function loggedIn(req: Request, res: Response, next: NextFunction) {
	if (!req.headers.authorization) {
		return res.status(401).send('Unauthorized request')
	}
	const authorization = req.headers.authorization
	const token = authorization.split(' ')[1]

	try {
		// const decoded = jwt.verify(token, secret)
		// ;(req as any).user = decoded

		next()
	} catch (error) {
		res.status(400).send('Invalid token ' + secret)
	}
}

export default loggedIn
