import dotenv from 'dotenv'
dotenv.config()

import mongoose from 'mongoose'

mongoose.set('strictQuery', true)

mongoose
	.connect(process.env.DB_STRING || '')
	.then(() => console.log('db connected'))
	.catch(err => console.log(err))
