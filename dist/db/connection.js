"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const mongoose_1 = __importDefault(require("mongoose"));
mongoose_1.default.set('strictQuery', true);
mongoose_1.default
    .connect(process.env.MONGODB_URI || '')
    .then(() => console.log('db connection successful'))
    .catch(err => console.log(err));
//# sourceMappingURL=connection.js.map