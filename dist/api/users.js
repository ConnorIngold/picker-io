"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const loggedIn_js_1 = __importDefault(require("../utils/loggedIn.js"));
const User_model_js_1 = __importDefault(require("../db/models/User.model.js"));
const router = express_1.default.Router();
router.get('/', loggedIn_js_1.default, (req, res) => {
    // find user in db by email with findOne and then respond with user info but not password
    User_model_js_1.default.findOne({ email: req.user.email }, '-password')
        .then(user => {
        res.status(200).json(user);
    })
        .catch(err => {
        res.status(400).json({
            message: 'Something went wrong: ' + err,
        });
    });
});
// Update user info (name, email)
router.put('/', loggedIn_js_1.default, (req, res) => {
    // find user in db by email with findOne and then update user info
    User_model_js_1.default.findOneAndUpdate({ email: req.user.email }, { name: req.body.name, email: req.body.email }, { new: true, runValidators: true })
        .then(user => {
        res.status(200).json(user);
    })
        .catch(err => {
        res.status(400).json({
            message: 'Something went wrong: ' + err,
        });
    });
});
// delete user
router.delete('/', loggedIn_js_1.default, (req, res) => {
    // find user in db by email with findOne and then delete user
    User_model_js_1.default.findOneAndDelete({ email: req.user.email })
        .then(user => {
        res.status(200).json(user);
    })
        .catch(err => {
        res.status(400).json({
            message: 'Something went wrong: ' + err,
        });
    });
});
exports.default = router;
//# sourceMappingURL=users.js.map