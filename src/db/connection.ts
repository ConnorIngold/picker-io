import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const checkDatabaseConnection = async () => {
	try {
		await prisma.$connect()
		console.log('Connected to the database via Prisma!')
	} catch (error) {
		console.error('Failed to connect to the database:', error)
	} finally {
		await prisma.$disconnect()
	}
}

// Call the function to check the database connection
checkDatabaseConnection()
