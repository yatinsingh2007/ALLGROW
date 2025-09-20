require('dotenv').config();
const { prisma } = require('./prisma/client');
const express = require('express');
const { auth } = require('./auth/auth');
const app = express();
app.use(express.json());

app.use('/auth' , auth )

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