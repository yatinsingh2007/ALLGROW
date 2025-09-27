const { prisma } = require('../prisma/prismaClient');

const jwt = require('jsonwebtoken');
require('dotenv').config();

const checkUserAuthentication = async (req , res , next) => {
    const { authorization } = req.headers;

    if (!authorization || !authorization.startsWith('Bearer ')){
        return res.status(401).json(
            { error: "Unauthorized" }
        );
    }

    const token = authorization.split(' ')[1];

    try {
        const decoded = jwt.verify(token , process.env.JWT_SECRET);

        const ourUser = await prisma.user.findMany({
            where : {
                email : decoded.email
            }
        })

        if (ourUser.length === 0){
            return res.status(404).json(
                { error: "User not found" }
            );
        }

        req.user = ourUser[0];
        next();
    }catch(err){
        return res.status(500).json(
            { error: "Internal Server Error" }
        )
    }
}

module.exports = { checkUserAuthentication }