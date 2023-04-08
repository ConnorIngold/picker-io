import dotenv from 'dotenv'
dotenv.config()

import * as nodemailer from 'nodemailer'
// import nodemailer types

export async function sendEmail(to: string, subject: string, message: string): Promise<nodemailer.SentMessageInfo> {
	// Create a transporter object
	const transporter: nodemailer.Transporter = nodemailer.createTransport({
		host: 'smtp.gmail.com',
		port: 465,
		secure: true,
		auth: {
			user: 'connoringold@gmail.com',
			pass: process.env.EMAIL_PASSWORD,
		},
	})

	try {
		// Send the email
		const info = await transporter.sendMail({
			from: 'connoringold@gmail.com',
			to,
			subject,
			text: message,
		})
		console.log('Message sent: %s', info)
		return true
	} catch (error) {
		console.error('Error sending email: ', error)
		throw error
	}
}
