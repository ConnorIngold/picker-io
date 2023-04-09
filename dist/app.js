"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const port = parseInt(process.env.PORT || '8081');
require("@shopify/shopify-api/adapters/node");
const shopify_api_1 = require("@shopify/shopify-api");
const express_1 = __importDefault(require("express"));
require("./db/connection");
const Shop_model_1 = require("./db/models/Shop.model");
const shopify = (0, shopify_api_1.shopifyApi)({
    // The next 4 values are typically read from environment variables for added security
    apiKey: process.env.SHOPIFY_API_KEY || 'APIKeyFromPartnersDashboard',
    apiSecretKey: process.env.SHOPIFY_API_SECRET || 'APISecretKeyFromPartnersDashboard',
    scopes: ['read_products', 'read_orders'],
    hostName: process.env.HOSTNAME || '',
    apiVersion: shopify_api_1.LATEST_API_VERSION,
    isEmbeddedApp: true,
});
const app = (0, express_1.default)();
const morgan_1 = __importDefault(require("morgan"));
// import cors
const cors_1 = __importDefault(require("cors"));
// routes
// import users from './api/users.js'
// import posts from './api/posts.js'
// json express
app.use(express_1.default.json());
// add morgan
app.use((0, morgan_1.default)('dev'));
// add cors
app.use((0, cors_1.default)());
// app.use('/users', users)
// app.use('/posts', posts)
app.get('/', async (req, res) => {
    try {
        const sessionId = await shopify.session.getCurrentId({
            isOnline: true,
            rawRequest: req,
            rawResponse: res,
        });
        if (sessionId) {
            // Check if session exists in the database
            const shopifySession = await Shop_model_1.ShopifySessionModel.findOne({ id: sessionId });
            if (shopifySession) {
                console.log('Session found in database:', shopifySession.toObject());
                res.json({
                    message: '🦄🌈✨Hello World! 🌈✨🦄',
                    sessionId: sessionId,
                });
                // You can now use shopifySession.toObject() to make API requests
            }
            else {
                console.log('Session not found in database');
                // Handle case where session not found in database
                res.json({
                    message: '🦄🌈✨Hello World! 🌈✨🦄',
                    sessionId: 'No sessionId',
                });
            }
        }
    }
    catch (error) {
        console.error(error);
        res.status(500).send('No session found');
    }
});
app.get('/auth', async (req, res) => {
    // The library will automatically redirect the user
    let shop = req.query.shop;
    let x = shopify.utils.sanitizeShop(shop, true);
    if (typeof shop === 'string' && x) {
        await shopify.auth.begin({
            shop: x,
            callbackPath: '/auth/callback',
            isOnline: false,
            rawRequest: req,
            rawResponse: res,
        });
    }
    else {
        // Handle the case where shop is null or an empty string
        res.status(400).send('Invalid shop parameter or worse...');
    }
});
app.get('/auth/callback', async (req, res) => {
    try {
        // The library will automatically set the appropriate HTTP headers
        // including setting the session cookie
        const callbackResponse = await shopify.auth.callback({
            rawRequest: req,
            rawResponse: res,
        });
        // Extract the session object from the callback response
        const session = callbackResponse.session;
        // Save the session object to the MongoDB database
        const shopifySession = new Shop_model_1.ShopifySessionModel(session.toObject());
        await shopifySession.save();
        // You can now use callback.session to make API requests
        // await addSessionToStorage(callbackResponse.session.toObject())
        res.redirect('/index');
    }
    catch (error) {
        console.error(error);
        res.status(500).send('Error occurred while handling callback');
    }
});
app.get('/index', (req, res) => {
    res.send(`
		<h1>Welcome</h1>
		<h2>Scroll to learn more</h2>
	`);
});
app.post('/toto', (req, res) => {
    res.send('Hello toto');
});
app.listen(port, () => {
    console.log(`App is listening on port ${port} !`, process.env.ENV);
});
//# sourceMappingURL=app.js.map