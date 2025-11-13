require('dotenv').config();

const express = require('express');

const { prisma } = require('../prisma/prismaClient');

const question = express.Router();

const { api } = require('../utils')



question.post('/runCode/:id' , async (req , res) => {
    const randomInt = Math.floor(Math.random() * 5) + 1;
    const { code , language_id , input } = req.body;
    try {
        const response = await api.post($`{process.env.JUDGE0_API}` , {
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

question.post('/submitCode/:id' , async (req , res) => {
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
        const testCases = questionData.test_cases
        const response = Promise.all(testCases.map( async (testCase) => {
            try{
                const res = await api.post($`{process.env.JUDGE0_API}` , {
                source_code : code,
                language_id : language_id,
                stdin : testCase.input,
                expected_output : testCase.output
                },
                {
                headers : {
                    "Content-Type" : "application/json",
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
                            languageId : language_id,
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
                    code : code ,
                    languageId : language_id
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

question.get('/submissions/:id' , async (req , res) => {
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
           } ,
           orderBy : {
            createdAt : 'asc'
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


question.get('/submission/:id' , async (req , res) => {
    try{
        const { id } = req.params;
        const submissionData = await prisma.submissions.findUnique({
            where : {
                id : id 
            }
        })
        return res.status(200).json(submissionData);
    }catch(err){
        console.log(err);
        return res.status(500).json({
            "error" : "Internal Server Error"
        })
    }
})

question.get('/latestSubmission/:id' , async (req , res) => {
    try{
        const { id } = req.params;
        const latestSubmission = await prisma.submissions.findFirst({
            where : {
                userId : req.user.id ,
                questionId : id
            } ,
            orderBy : {
                createdAt : 'desc'
            }
        })
        if (!latestSubmission) return res.status(404).json({
            "error" : "Submission not Found"
        })
        return res.status(200).json(latestSubmission)
    }catch(err){
        console.log(err);
        return res.status(500).json({
            "error" : "Internal Server Error"
        })
    }
})

module.exports = { question }