import dotenv from 'dotenv'
dotenv.config()
const port: number = parseInt(process.env.PORT || '8081')
import '@shopify/shopify-api/adapters/node'
import { shopifyApi, LATEST_API_VERSION } from '@shopify/shopify-api'
import express, { Application, Request, Response } from 'express'

const shopify = shopifyApi({
	// The next 4 values are typically read from environment variables for added security
	apiKey: process.env.SHOPIFY_API_KEY || 'APIKeyFromPartnersDashboard',
	apiSecretKey: process.env.SHOPIFY_API_SECRET || 'APISecretKeyFromPartnersDashboard',
	scopes: ['read_products', 'read_orders'],
	hostName: process.env.DEV_HOSTNAME || '',
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

app.get('/', (req: Request, res: Response) => {
	res.json({
		message: '🦄🌈✨Hello World! 🌈✨🦄',
	})
})

app.get('/auth', async (req, res) => {
	// The library will automatically redirect the user
	let shop = req.query.shop as string
	let x = shopify.utils.sanitizeShop(shop, true)
	if (typeof shop === 'string' && x) {
		await shopify.auth.begin({
			shop: x,
			callbackPath: '/auth/callback',
			isOnline: false,
			rawRequest: req,
			rawResponse: res,
		})
	} else {
		// Handle the case where shop is null or an empty string
		res.status(400).send('Invalid shop parameter or worse...')
	}
})

app.get('/auth/callback', async (req, res) => {
	// The library will automatically set the appropriate HTTP headers
	const callbackResponse = await shopify.auth.callback({
		rawRequest: req,
		rawResponse: res,
	})
	// need to save this session to the database
	// const session = callbackResponse.session

	console.log('here', callbackResponse.session)

	// You can now use callback.session to make API requests
	// await addSessionToStorage(callbackResponse.session.toObject())

	res.redirect('/index')
})

app.get('/index', (req: Request, res: Response) => {
	res.send(`
		<h1>Welcome</h1>
		<h2>Scroll to learn more</h2>
	`)
})

app.post('/toto', (req: Request, res: Response) => {
	res.send('Hello toto')
})

app.listen(port, () => {
	console.log(`App is listening on port ${port} !`)
})
