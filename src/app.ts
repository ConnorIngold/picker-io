import dotenv from 'dotenv'
dotenv.config()

const port: number = parseInt(process.env.PORT || '8081')

import '@shopify/shopify-api/adapters/node'
import { shopifyApi, LATEST_API_VERSION, DeliveryMethod } from '@shopify/shopify-api'

import express, { Application, Request, Response } from 'express'
import path from 'path'

import './db/connection'
import { ShopifySessionModel } from './db/models/Shop.model'
import { getSessionFromStorage } from './middleware/index'

const shopify = shopifyApi({
	// The next 4 values are typically read from environment variables for added security
	apiKey: process.env.SHOPIFY_API_KEY || 'APIKeyFromPartnersDashboard',
	apiSecretKey: process.env.SHOPIFY_API_SECRET || 'APISecretKeyFromPartnersDashboard',
	scopes: ['read_products', 'read_orders'],
	hostName: 'bbad-92-8-111-151.ngrok-free.app' || '',
	apiVersion: LATEST_API_VERSION,
	isEmbeddedApp: true,
})

shopify.webhooks.addHandlers({
	ORDERS_CREATE: {
		deliveryMethod: DeliveryMethod.PubSub,
		pubSubProject: 'installer-io',
		pubSubTopic: 'projects/installer-io/subscriptions/monitor-orders-installer-io-sub',
	},
})

const app: Application = express()

import morgan from 'morgan'

// import cors
import cors from 'cors'

// routes
// import users from './api/users.js'
// import posts from './api/posts.js'

// json express
app.use(express.json())

// add morgan
app.use(morgan('dev'))

// add cors
app.use(cors())

// app.use('/users', users)
// app.use('/posts', posts)

app.use(express.static(path.join(__dirname, 'client/dist')))

app.get('/', async (req: Request, res: Response) => {
	// The library will automatically redirect the user
	let shop = req.query.shop as string
	console.log('getCurrentId', req.query)

	const shopifyDBSession = await ShopifySessionModel.findOne({ shop: shop })
	if (shopifyDBSession) {
		console.log('Session found in database:', shopifyDBSession.toObject())

		if (!shopify.config.scopes.equals(shopifyDBSession.scope)) {
			// Scopes have changed, the app should redirect the merchant to OAuth
			console.log('Session found in database but scopes have changed')
			let x = shopify.utils.sanitizeShop(shop, true)
			if (typeof shop === 'string' && x) {
				await shopify.auth.begin({
					shop: x,
					callbackPath: '/auth/callback',
					isOnline: false,
					rawRequest: req,
					rawResponse: res,
				})
			}
		} else {
			res.sendFile(path.join(__dirname, 'client/dist', 'index.html'))
		}
	} else {
		console.log('Session not found in database')
		console.log('Shop', shop)

		let x = shopify.utils.sanitizeShop(shop, true)
		if (typeof shop === 'string' && x) {
			await shopify.auth.begin({
				shop: x,
				callbackPath: '/callback',
				isOnline: false,
				rawRequest: req,
				rawResponse: res,
			})
		} else {
			// Handle the case where shop is null or an empty string
			res.status(400).send('Invalid shop parameter')
		}
	}
})

app.get('/callback', async (req, res) => {
	console.log('callback', req.query)

	try {
		// The library will automatically set the appropriate HTTP headers
		// including setting the session cookie
		const callbackResponse = await shopify.auth.callback({
			rawRequest: req,
			rawResponse: res,
		})
		// Extract the session object from the callback response
		const session = callbackResponse.session
		console.log('session', session)

		// register webhooks
		const response = await shopify.webhooks.register({
			session,
		})

		if (!response['PRODUCTS_CREATE'][0].success) {
			console.log(`Failed to register PRODUCTS_CREATE webhook: ${response['PRODUCTS_CREATE'][0].result}`)
		}

		// Save the session object to the MongoDB database
		const shopifySession = new ShopifySessionModel(session.toObject())
		await shopifySession
			.save()
			.then(() => {
				console.log('Session saved to database')
				res.redirect('/')
			})
			.catch(err => console.log(err))

		// You can now use callback.session to make API requests
		// await addSessionToStorage(callbackResponse.session.toObject())
	} catch (error) {
		console.error(error)
		res.status(500).send('Error occurred while handling callback')
	}
})

// Process webhooks
app.post('/webhooks', express.text({ type: '*/*' }), async (req, res) => {
	try {
		// Note: the express.text() given above is an Express middleware that will read
		// in the body as a string, and make it available at req.body, for this path only.
		await shopify.webhooks.process({
			rawBody: req.body, // is a string
			rawRequest: req,
			rawResponse: res,
		})
	} catch (error) {
		console.log('error in registering webhook')
		res.status(500).send('Error occurred while registering webhook')
	}
})

app.get('/products', async (req: Request, res: Response) => {
	interface ProductResponse {
		product: {
			id: number
			title: string
			// ...
		}
	}

	let session = await getSessionFromStorage(req, res)

	if (session !== undefined) {
		const client = new shopify.clients.Rest(session)

		const response = await client.get<ProductResponse>({
			path: 'products/8244290257206',
		})

		res.json(response)
	}
})

app.get('/test', (req: Request, res: Response) => {
	res.send('Hello toto')
})

app.listen(port, () => {
	console.log(`App is listening on port ${port} !`, process.env.ENV)
})
