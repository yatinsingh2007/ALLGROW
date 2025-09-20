const express = require('express');

const { validator } = require('validator')

const bcrypt = require('bcrypt')

const jwt = require('jsonwebtoken')

const { prisma } = require('../app');

require('dotenv').config();

const auth = express.Router();

auth.post('/register' , async (req , res) => {
    let { name , email , password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json(
            { error: "Name, email, and password are required" }
        );
    }

    name = name.trim();

    if (name.length < 3){
        return res.status(400).json(
            { error: "Name must be at least 3 characters long" }
        );
    }

    if (!validator.isEmail(email)) {
        return res.status(400).json(
            { error: "Invalid email format" }
        );
    }

    if (!validator.isStrongPassword(password)){
        return res.status(400).json(
            { error: "Password is not strong enough" }
        );
    }

    password = await bcrypt.hash(password , 10)
    try {
        await prisma.user.create({
            data : {
                name ,
                email ,
                password
            }
        })
        return res.status(201).send("User registered successfully");
    }catch(err){
        if (err.code === 'P2002'){
            return res.status(409).json(
                { error: "Email already in use" }
            );
        }
        return res.status(500).json(
            { error: "Internal Server Error" }
        );
    }
})

auth.post('/login' , async (req , res) => {
    const { email , password } = req.body;

    if (!email || !password) {
        return res.status(400).json(
            { error: "Email and password are required" }
        );
    }

    if (!validator.isEmail(email)) {
        return res.status(400).json(
            { error: "Invalid email format" }
        );
    }

    try {
        const ourUser = await prisma.user.findMany({
            where : {
                email
            }
        })
        if (ourUser.length === 0){
            return res.status(404).json(
                { error: "User not found" }
            );
        }

        const compare = await bcrypt.compare(password , ourUser[0].password)
        if (!compare){
            return res.status(401).json(
                { error: "Invalid credentials" }
            );
        }

        const token = jwt.sign({
           email : ourUser[0].email
        } , process.env.JWT_SECRET , { expiresIn : '1h' })

        return res.status(200).json({
            message : "Login successful" ,
            token : token
        })

    }catch(err){
        return res.status(500).json(
            { error: "Internal Server Error" }
        )
    }
})


module.exports = { auth }