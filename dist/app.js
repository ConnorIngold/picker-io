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
const path_1 = __importDefault(require("path"));
require("./db/connection");
// import { ShopifySessionModel } from './db/models/Shop.model'
const index_1 = require("./middleware/index");
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const shopify = (0, shopify_api_1.shopifyApi)({
    // The next 4 values are typically read from environment variables for added security
    apiKey: process.env.SHOPIFY_API_KEY || 'APIKeyFromPartnersDashboard',
    apiSecretKey: process.env.SHOPIFY_API_SECRET || 'APISecretKeyFromPartnersDashboard',
    scopes: ['read_products', 'read_orders'],
    hostName: 'picker-io-production.up.railway.app' || '',
    apiVersion: shopify_api_1.LATEST_API_VERSION,
    isEmbeddedApp: true,
});
shopify.webhooks.addHandlers({
    ORDERS_CREATE: {
        deliveryMethod: shopify_api_1.DeliveryMethod.PubSub,
        pubSubProject: 'installer-io',
        pubSubTopic: 'projects/installer-io/subscriptions/monitor-orders-installer-io-sub',
    },
});
const app = (0, express_1.default)();
const morgan_1 = __importDefault(require("morgan"));
// import cors
const cors_1 = __importDefault(require("cors"));
// json express
app.use(express_1.default.json());
// add morgan
app.use((0, morgan_1.default)('dev'));
// add cors
app.use((0, cors_1.default)());
app.use(express_1.default.static(path_1.default.join(__dirname, '..', 'client/dist')));
app.get('/', async (req, res) => {
    // The library will automatically redirect the user
    let shop = req.query.shop;
    console.log('getCurrentId', req.query);
    const shopifyDBSession = await prisma.shopifySession.findFirst({
        where: {
            shop: shop,
        },
    });
    if (shopifyDBSession) {
        console.log('Session found in database:', shopifyDBSession);
        if (shopifyDBSession.scope && !shopify.config.scopes.equals(shopifyDBSession.scope)) {
            // Scopes have changed, the app should redirect the merchant to OAuth
            console.log('Session found in database but scopes have changed');
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
        }
        else {
            res.sendFile(path_1.default.join(__dirname, '..', 'client/dist', 'index.html'));
        }
    }
    else {
        console.log('Session not found in database');
        console.log('Shop', shop);
        prisma.$disconnect();
        let x = shopify.utils.sanitizeShop(shop, true);
        if (typeof shop === 'string' && x) {
            await shopify.auth.begin({
                shop: x,
                callbackPath: '/callback',
                isOnline: false,
                rawRequest: req,
                rawResponse: res,
            });
        }
        else {
            // Handle the case where shop is null or an empty string
            res.status(400).send('Invalid shop parameter');
        }
    }
});
app.get('/callback', async (req, res) => {
    console.log('callback', req.query);
    try {
        // The library will automatically set the appropriate HTTP headers
        // including setting the session cookie
        const callbackResponse = await shopify.auth.callback({
            rawRequest: req,
            rawResponse: res,
        });
        // Extract the session object from the callback response
        const session = callbackResponse.session;
        console.log('🚀 ~ file: app.ts:118 ~ app.get ~ session:', session);
        try {
            const webhookResponse = await shopify.webhooks.register({
                session,
            });
            console.log('🚀 ~ file: app.ts:125 ~ app.get ~ webhookResponse:', webhookResponse);
            if (!webhookResponse['ORDERS_CREATE'][0].success) {
                console.log(`Failed to register ORDERS_CREATE webhook: ${webhookResponse['ORDERS_CREATE'][0].result}`);
            }
        }
        catch (error) {
            console.log('🚀 ~ file: app.ts:XXX ~ app.get ~ webhookError:', error);
            res.status(500).send('Error occurred while registering webhooks');
        }
        // Save the session object to the MongoDB database
        try {
            const shopifySession = await prisma.shopifySession.create({
                data: {
                    ...session,
                },
            });
            console.log('Session saved to database', shopifySession);
            res.redirect('/');
        }
        catch (err) {
            console.log('🚀 ~ file: app.ts:140 ~ app.get ~ err:', err);
        }
        // You can now use callback.session to make API requests
        // await addSessionToStorage(callbackResponse.session.toObject())
    }
    catch (error) {
        console.log('🚀 ~ file: app.ts:146 ~ app.get ~ error:', error);
        res.status(500).send('Error occurred while handling callback');
    }
});
// Process webhooks
app.post('/webhooks', express_1.default.text({ type: '*/*' }), async (req, res) => {
    try {
        // Note: the express.text() given above is an Express middleware that will read
        // in the body as a string, and make it available at req.body, for this path only.
        await shopify.webhooks.process({
            rawBody: req.body,
            rawRequest: req,
            rawResponse: res,
        });
    }
    catch (error) {
        console.log('error in registering webhook');
        res.status(500).send('Error occurred while registering webhook');
    }
});
app.get('/products', async (req, res) => {
    let session = await (0, index_1.getSessionFromStorage)(req, res);
    if (session !== undefined) {
        const client = new shopify.clients.Rest(session);
        const response = await client.get({
            path: 'products/8244290257206',
        });
        res.json(response);
    }
});
app.get('/test', (req, res) => {
    res.send('Hello toto');
});
app.get('/get-user', async (req, res) => {
    try {
        const shopifyUser = await prisma.user.findFirst({
            where: {
                id: 1,
            },
        });
        if (shopifyUser) {
            console.log('shopifyUser: ', shopifyUser);
            res.status(200).json(shopifyUser);
        }
        else {
            console.log('User not found');
            res.status(404).send('User not found');
        }
    }
    catch (error) {
        console.error('An error occurred: ', error);
        res.status(500).send('An error occurred');
    }
});
app.listen(port, () => {
    console.log(`App is listening on port ${port} !`, process.env.ENV);
});
//# sourceMappingURL=app.js.map