import dotenv from 'dotenv'
dotenv.config()

const port: number = parseInt(process.env.PORT || '8081')

import '@shopify/shopify-api/adapters/node'
import { shopifyApi, LATEST_API_VERSION } from '@shopify/shopify-api'

import express, { Application, Request, Response } from 'express'
import path from 'path'

import './db/connection'
import { ShopifySessionModel } from './db/models/Shop.model'

const shopify = shopifyApi({
	// The next 4 values are typically read from environment variables for added security
	apiKey: process.env.SHOPIFY_API_KEY || 'APIKeyFromPartnersDashboard',
	apiSecretKey: process.env.SHOPIFY_API_SECRET || 'APISecretKeyFromPartnersDashboard',
	scopes: ['read_products', 'read_orders'],
	hostName: 'bbad-92-8-111-151.ngrok-free.app' || '',
	apiVersion: LATEST_API_VERSION,
	isEmbeddedApp: true,
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

	const shopifySession = await ShopifySessionModel.findOne({ shop: shop })
	if (shopifySession) {
		console.log('Session found in database:', shopifySession.toObject())

		if (!shopify.config.scopes.equals(shopifySession.scope)) {
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

app.get('/products', async (req: Request, res: Response) => {
	interface ProductResponse {
		product: {
			id: number
			title: string
			// ...
		}
	}

	let shop = req.query.shop as string

	const shopifySession = await ShopifySessionModel.findOne({ shop: shop })
	if (shopifySession) {
		console.log('Session found in database:', shopifySession.toObject())
		// ts-disable-next-line
		try {
			let mySession = shopifySession.toObject()
			mySession.isActive = true
			const client = new shopify.clients.Rest(mySession)

			const response = await client.get<ProductResponse>({
				path: 'products/8244290257206',
			})

			res.json(response)
		} catch (error) {
			console.error(error)
			res.status(500).json(error)
		}
	}
})

app.post('/test', (req: Request, res: Response) => {
	res.send('Hello toto')
})

app.listen(port, () => {
	console.log(`App is listening on port ${port} !`, process.env.ENV)
})
