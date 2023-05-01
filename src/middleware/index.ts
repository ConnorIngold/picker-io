import { Request, Response, NextFunction } from 'express'
import { shopifyApi, RestClientParams, Session, ShopifyRestResources } from '@shopify/shopify-api'

import { ShopifySessionModel } from '../db/models/Shop.model'

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

const getSessionFromStorage = async (req: Request, res: Response) => {
	let shop = req.query.shop as string

	const shopifyDBSession = await ShopifySessionModel.findOne({ shop: shop })
	if (shopifyDBSession) {
		console.log('Session found in database:', shopifyDBSession.toObject())
		try {
			let mySession = shopifyDBSession.toObject().id
			console.log('mySession', mySession)
			// Create a new Session object with the required properties
			const restClientParams: RestClientParams = {
				session: {
					id: shopifyDBSession.id,
					shop: shopifyDBSession.shop,
					state: shopifyDBSession.state,
					isOnline: shopifyDBSession.isOnline,
					scope: shopifyDBSession.scope,
					expires: shopifyDBSession.expires,
					accessToken: shopifyDBSession.accessToken,
				} as Session,
			}

			return restClientParams
		} catch (error) {
			return
		}
	}
}

export { notFound, errorHandler, respondError422, getSessionFromStorage }
