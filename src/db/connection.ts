import dotenv from 'dotenv'
dotenv.config()

import mongoose from 'mongoose'

mongoose.set('strictQuery', true)

mongoose
	.connect(process.env.MONGODB_URI || '')
	.then(() => console.log('db connection successful'))
	.catch(err => console.log(err))
