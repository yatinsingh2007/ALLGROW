require('dotenv').config();
const { prisma } = require('./prisma/prismaClient');
const cors = require('cors');
const { dashboard } = require('./dashboard/dashboard');
const express = require('express');
const { auth } = require('./auth/auth');
const app = express();
app.use(cors({
    origin : '*',
    methods : ['GET' , 'POST' , 'PUT' , 'DELETE'],
    allowedHeaders : ['Content-Type' , 'Authorization']
}));

app.use(express.json());

app.use('/api/auth' , auth )
app.use('/api/dashboard' , dashboard)

async function main(){
    await prisma.$connect();
    console.log("Connected to the database");

    app.listen(process.env.PORT , () => {
        console.log(`Server is running on port ${process.env.PORT}`);
    })
}

main()
.catch((e) => {
    console.error(e);
}).finally(async () => {
    await prisma.$disconnect();
})

module.exports = { prisma }