require('dotenv').config();
const { prisma } = require('./prisma/prismaClient');
const cors = require('cors');
const { dashboard } = require('./dashboard/dashboard');
const express = require('express');
const { auth } = require('./auth/auth');
const { question } = require('./question/question');
const { checkUserAuthentication } = require('./middleware/middleware');
const { profile } = require('./profile/profile');
const app = express();
const PORT = process.env.FRONTEND_PORT || 3000

app.use(cors({
    origin : [`http://localhost:${PORT}` , `https://vinticode.vercel.app`],
    methods : ['GET' , 'POST' , 'PUT' , 'PATCH' , 'DELETE'],
    credentials : true
}));

app.use(express.json());

app.use('/api/auth' , auth )

app.use('/api/dashboard' , checkUserAuthentication , dashboard)

app.use('/api/questions' , checkUserAuthentication , question)

app.use('/api/userprofile' , checkUserAuthentication , profile)


async function main(){
    await prisma.$connect();
    console.log("Connected to the database");

    app.listen(process.env.PORT || 5000 , () => {
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