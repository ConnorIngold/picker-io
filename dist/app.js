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
const shopify = (0, shopify_api_1.shopifyApi)({
    // The next 4 values are typically read from environment variables for added security
    apiKey: process.env.SHOPIFY_API_KEY || 'APIKeyFromPartnersDashboard',
    apiSecretKey: process.env.SHOPIFY_API_SECRET || 'APISecretKeyFromPartnersDashboard',
    scopes: ['read_products', 'read_orders'],
    hostName: process.env.DEV_HOSTNAME || '',
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
app.get('/', (req, res) => {
    res.json({
        message: '🦄🌈✨Hello World! 🌈✨🦄',
    });
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
    // The library will automatically set the appropriate HTTP headers
    const callbackResponse = await shopify.auth.callback({
        rawRequest: req,
        rawResponse: res,
    });
    // need to save this session to the database
    // const session = callbackResponse.session
    console.log('here', callbackResponse.session);
    // You can now use callback.session to make API requests
    // await addSessionToStorage(callbackResponse.session.toObject())
    res.redirect('/index');
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
    console.log(`App is listening on port ${port} !`);
});
//# sourceMappingURL=app.js.map