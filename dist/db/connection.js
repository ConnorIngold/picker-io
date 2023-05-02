"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const checkDatabaseConnection = async () => {
    try {
        await prisma.$connect();
        console.log('Connected to the database via Prisma!');
    }
    catch (error) {
        console.error('Failed to connect to the database:', error);
    }
    finally {
        await prisma.$disconnect();
    }
};
// Call the function to check the database connection
checkDatabaseConnection();
//# sourceMappingURL=connection.js.map