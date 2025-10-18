require('dotenv').config();
const express = require('express');

const { prisma } = require('../prisma/prismaClient');

const question = express.Router();

const { checkUserAuthentication } = require('../middleware/middleware');

const { axios } = require('../utils')



question.post('/run/:id' , checkUserAuthentication , async (req , res) => {
    const randomInt = Math.floor(Math.random() * 5) + 1;
    const { code , language_id , input } = req.body;
    try {
        const response = await axios.post("https://judge0-ce.p.rapidapi.com/submissions?base64_encoded=false&wait=true" , {
            source_code : code,
            language_id : language_id,
            stdin : input ? input : "",
            expected_output : "",
            headers : {
                "X-RapidAPI-Host": process.env.user_`${randomInt}`.x-rapidapi-host,
                "X-RapidAPI-Key": process.env.user_`${randomInt}`.x-rapidapi-key
        }
        })
        const result = response.data;
        return res.status(200).json({ result })

    }catch (err){
        console.error(err);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
})

question.post('/submit/:id' , checkUserAuthentication ,  async (req , res) => {
    const { code , language_id } = req.body;
    const { id } = req.params;
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
                const res = await axios.post("https://judge0-ce.p.rapidapi.com/submissions?base64_encoded=false&wait=true" , {
                source_code : code,
                language_id : language_id,
                stdin : testCase.input,
                expected_output : testCase.output
                },
                {
                headers : {
                    "X-RapidAPI-Host": process.env.user_1['x-rapidapi-host'],
                    "X-RapidAPI-Key": process.env.user_1['x-rapidapi-key']
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
                return res.status(200).json({
                    "message" : "Some Test Cases Failed",
                    "results" : resultSummary
                })
            }
        }

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

question.get('/submitedquestions' , checkUserAuthentication , async (req , res) => {
    const userId = req.user.id;
    try{
        const submissions = await prisma.submissions.findMany({
            where : {
                userId : userId ,
                status : "Submitted"
            } ,
            include : {
                question : true
            } ,
            distinct : ['questionId']
        })
        return res.status(200).json({
            "submissions" : submissions
        })
    }catch(err){
        console.log(err);
        return res.status(500).json({
            "error" : "Internal Server Error"
        })
    }
})

question.get('/submission' , checkUserAuthentication , async (req , res) => {
    try{

    }catch(err){
        console.log(err);
        return res.status(500).json({
            "error" : "Internal Server Error"
        })
    }
})

module.exports = { question }