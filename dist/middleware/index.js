"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSessionFromStorage = exports.respondError422 = exports.errorHandler = exports.notFound = void 0;
const client_1 = require("@prisma/client");
// import { ShopifySessionModel } from '../db/models/Shop.model'
const notFound = (req, res, next) => {
    res.status(404);
    const error = new Error('Not Found - ' + req.originalUrl);
    next(error);
};
exports.notFound = notFound;
const errorHandler = (err, req, res) => {
    res.status(res.statusCode || 500);
    res.json({
        message: err.message,
        stack: err.stack,
    });
};
exports.errorHandler = errorHandler;
const respondError422 = (res, next) => {
    res.status(422);
    const error = new Error('Unable to login.');
    next(error);
};
exports.respondError422 = respondError422;
const getSessionFromStorage = async (req, res) => {
    let shop = req.query.shop;
    const prisma = new client_1.PrismaClient();
    const shopifyDBSession = await prisma.shopifySession.findFirst({
        where: {
            shop: shop,
        },
    });
    if (shopifyDBSession) {
        console.log('Session found in database:', shopifyDBSession);
        try {
            let mySession = shopifyDBSession.id;
            console.log('mySession', mySession);
            // Create a new Session object with the required properties
            const restClientParams = {
                session: {
                    id: shopifyDBSession.id,
                    shop: shopifyDBSession.shop,
                    state: shopifyDBSession.state,
                    isOnline: shopifyDBSession.isOnline,
                    scope: shopifyDBSession.scope,
                    expires: shopifyDBSession.expires,
                    accessToken: shopifyDBSession.accessToken,
                },
            };
            return restClientParams;
        }
        catch (error) {
            return;
        }
    }
};
exports.getSessionFromStorage = getSessionFromStorage;
//# sourceMappingURL=index.js.map