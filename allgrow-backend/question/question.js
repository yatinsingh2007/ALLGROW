require('dotenv').config();
const express = require('express');

const { prisma } = require('../prisma/prismaClient');

const question = express.Router();

const { checkUserAuthentication } = require('../middleware/middleware');

const { api } = require('../utils')



question.post('/runCode/:id' , checkUserAuthentication , async (req , res) => {
    const randomInt = Math.floor(Math.random() * 5) + 1;
    const { code , language_id , input } = req.body;
    try {
        const response = await api.post("https://judge0-ce.p.rapidapi.com/submissions?base64_encoded=false&wait=true" , {
            source_code : code,
            language_id : language_id,
            stdin : input ? input : ""
        } , {
            headers : {
                "Content-Type": "application/json",
                "X-RapidAPI-Host": JSON.parse(process.env[`USER_${randomInt}`])['x-rapidapi-host'],
                "X-RapidAPI-Key": JSON.parse(process.env[`USER_${randomInt}`])['x-rapidapi-key']
        }
        })
        const result = response.data;
        return res.status(200).json({ result })

    }catch (err){
        console.error(err);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
})

question.post('/submitCode/:id' , checkUserAuthentication ,  async (req , res) => {
    const { code , language_id } = req.body;
    const { id } = req.params;
    const randomInt = Math.floor(Math.random() * 5) + 1;
    try {
        const questionData = await prisma.questions.findUnique({
            where : {
                id : id
            }
        });
        if(!questionData){
            return res.status(404).json({
                "error" : "Question Not Found"
            })
        }

        const response = Promise.all(questionData.test_cases.map( async (testCase) => {
            try{
                const res = await api.post("https://judge0-ce.p.rapidapi.com/submissions?base64_encoded=false&wait=true" , {
                source_code : code,
                language_id : language_id,
                stdin : testCase.input,
                expected_output : testCase.output
                },
                {
                headers : {
                    "X-RapidAPI-Host": JSON.parse(process.env[`USER_${randomInt}`])['x-rapidapi-host'],
                    "X-RapidAPI-Key": JSON.parse(process.env[`USER_${randomInt}`])['x-rapidapi-key']
            }
            })
                return res.data;
            }catch(err){
                console.log(err);
                return res.status(500).json({
                    "message" : "Submission Failed"
                });
            }
        }))

        const results = await response;

        const resultSummary = results.map((result) => {
            return result.status.description;
        })

        for (let status of resultSummary){
            if (status !== "Accepted"){
                await prisma.$transaction(async (tx) => {
                    await tx.submissions.create({
                        data : {
                            userId : req.user.id ,
                            questionId : id ,
                            status : `rejected`,
                            code : code
                        }
                    })
                })
                return res.status(400).json({
                    "message" : "Some Test Cases Failed",
                    "results" : resultSummary
                })
            }
        }
        await prisma.$transaction(async (tx) => {
            await tx.user.update({
                where : {
                    id : req.user.id ,
                } ,
                data : {
                    solvedQuestions : {
                        create : {
                    questionId : id ,
                    status : "accepted" ,
                    code : code
                }
                    }
                }
            })
        })
        return res.status(200).json({
            "message" : "All Test Cases Passed",
            "results" : resultSummary
        })

    }catch(err){
        console.log(err);
        return res.status(500).json({
            "error" : "Internal Server Error"
        })
    }
})

question.get('/submissions/:id' , checkUserAuthentication , async (req , res) => {
    try{
        const ourUser = req.user;
        const { id } = req.params;
        const data = await prisma.submissions.findMany({
           where : {
                userId : ourUser.id ,
                questionId : id
           } ,
           include : {
            question : true
           }
        })
        return res.status(200).json({
            "submissions" : data
        })
    }catch(err){
        console.log(err);
        return res.status(500).json({
            "error" : "Internal Server Error"
        })
    }
})

question.get('/submittedQuestions' , checkUserAuthentication , async (req , res) => {
    try{
        const ourUser = req.user;
        const data = await prisma.submissions.findMany({
            where : {
                userId : ourUser.id ,
                status : "Submitted"
            },
            include : {
                question : true
            } ,
            distinct : ['questionId']
        })
        return res.status(200).json({
            "submissions" : data
        })
    }catch(err){
        console.log(err);
        return res.status(500).json({
            "error" : "Internal Server Error"
        })
    }
})

module.exports = { question }