"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// import jwt from 'jsonwebtoken'
const secret = process.env.TOKEN_SECRET || '';
function loggedIn(req, res, next) {
    if (!req.headers.authorization) {
        return res.status(401).send('Unauthorized request');
    }
    const authorization = req.headers.authorization;
    const token = authorization.split(' ')[1];
    try {
        // const decoded = jwt.verify(token, secret)
        // ;(req as any).user = decoded
        next();
    }
    catch (error) {
        res.status(400).send('Invalid token ' + secret);
    }
}
exports.default = loggedIn;
//# sourceMappingURL=loggedIn.js.map