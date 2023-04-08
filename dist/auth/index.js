"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const express_1 = __importDefault(require("express"));
const crypto_1 = __importDefault(require("crypto"));
const mongoose_1 = __importDefault(require("mongoose"));
const User_model_js_1 = require("../db/models/User.model.js");
require("../db/connection.js");
const joi_1 = __importDefault(require("joi"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const schema = joi_1.default.object({
    // minDomainSegments: example.com (2 segments: "example" and "com")
    email: joi_1.default.string().email({ minDomainSegments: 2, tlds: { allow: false } }),
    password: joi_1.default.string().min(8).required(),
});
const router = express_1.default.Router();
const createTokenSendResponse = (user, res, next) => {
    // create payload
    const payload = {
        _id: user._id,
        email: user.email,
        permissions: user.permissions,
    };
    console.log('secret', process.env.TOKEN_SECRET);
    jsonwebtoken_1.default.sign(payload, process.env.TOKEN_SECRET || '', {
        expiresIn: '7d',
    }, (err, token) => {
        if (err) {
            console.log('Error creating token: ', err);
            res.status(400).json({
                message: 'Something went wrong: ' + err,
            });
        }
        else {
            res.status(200).json({
                token,
            });
        }
    });
};
router.get('/', (req, res, next) => {
    res.status(200).send('Hi auth');
});
router.post('/register', async (req, res) => {
    const { email, password } = req.body;
    const result = schema.validate(req.body);
    if (!result.error) {
        // check if user already exists by email
        const user = await User_model_js_1.User.findOne({ email });
        if (user) {
            return res.status(409).json({
                message: 'User already exists',
            });
        }
        // Generate a confirmation token
        const confirmationToken = crypto_1.default.randomBytes(20).toString('hex');
        // Set the expiration date for the confirmation token
        const confirmationTokenExpiration = Date.now() + 3600000; // 1 hour from now
        bcrypt_1.default.hash(password, 10, async (err, hash) => {
            // create a new user
            const newUser = new User_model_js_1.User({
                email,
                password: hash,
                confirmationToken: {
                    token: confirmationToken,
                    tokenExpiration: confirmationTokenExpiration,
                },
            });
            // save user
            try {
                const savedUser = await newUser.save();
                // Send the confirmation email
                const subject = 'Please confirm your email address';
                const confirmationLink = `http://localhost:3000/confirm?token=${confirmationToken}`;
                const message = `Click the link to confirm your email address: ${confirmationLink}`;
                // sendEmail(email, subject, message)
                // 	.then(success => console.log('Email sent: ', success))
                // 	.catch(error => {
                // 		res.status(500).json({
                // 			message: 'Error sending email' + error,
                // 		})
                // 	})
                res.status(200).json({
                    _id: mongoose_1.default.Types.ObjectId,
                    message: 'User created. Please check your email to confirm your address.',
                    user: savedUser,
                });
            }
            catch (error) {
                res.status(400).json({
                    message: 'Something went wrong: ' + error,
                });
            }
        });
    }
    else {
        res.status(400).json({
            message: result.error.details[0].message,
        });
    }
});
router.post('/login', (req, res, next) => {
    const result = schema.validate(req.body);
    // if no errors
    if (!result.error) {
        User_model_js_1.User.findOne({
            email: req.body.email,
        }).then(user => {
            // if found user in db
            if (user) {
                console.log('user found');
                console.log('Comparing passwords...');
                // password is user input
                // it takes its then hash's it then compares its
                // to the one in the db
                bcrypt_1.default.compare(req.body.password, user.password).then(result => {
                    if (result) {
                        // ps correct
                        console.log('ps correct');
                        createTokenSendResponse(user, res, next);
                    }
                    else {
                        console.log('ps not correct');
                        res.status(401).json({
                            message: 'Incorrect password or email',
                        });
                    }
                });
            }
            else {
                console.log('');
                res.status(404).json({
                    message: 'user not found ',
                });
            }
        });
    }
    else {
        res.status(400).json({
            message: result.error.details[0].message,
        });
    }
});
exports.default = router;
//# sourceMappingURL=index.js.map