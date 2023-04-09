"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShopifySessionModel = void 0;
const mongoose_1 = require("mongoose");
const shopifySessionSchema = new mongoose_1.Schema({
    id: {
        type: String,
        required: true,
    },
    shop: {
        type: String,
        required: true,
    },
    state: {
        type: String,
        required: true,
    },
    isOnline: {
        type: Boolean,
        required: true,
    },
    scope: {
        type: String,
        required: false,
    },
    expires: {
        type: Date,
        required: false,
    },
    accessToken: {
        type: String,
        required: false,
    },
    onlineAccessInfo: {
        accessToken: {
            type: String,
            required: false,
        },
        expiresIn: {
            type: Number,
            required: false,
        },
        url: {
            type: String,
            required: false,
        },
    },
});
exports.ShopifySessionModel = (0, mongoose_1.model)('ShopifySession', shopifySessionSchema);
//# sourceMappingURL=Shop.model.js.map