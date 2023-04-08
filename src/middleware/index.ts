import { Request, Response, NextFunction } from 'express'

const notFound = (req: Request, res: Response, next: NextFunction) => {
	res.status(404)
	const error = new Error('Not Found - ' + req.originalUrl)
	next(error)
}

const errorHandler = (err: Error, req: Request, res: Response) => {
	res.status(res.statusCode || 500)
	res.json({
		message: err.message,
		stack: err.stack,
	})
}

const respondError422 = (res: Response, next: NextFunction) => {
	res.status(422)
	const error = new Error('Unable to login.')
	next(error)
}

export { notFound, errorHandler, respondError422 }
