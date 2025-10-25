const express = require('express');

const { prisma } = require('../prisma/prismaClient');

const dashboard = express.Router()


dashboard.get('/home' , async (req , res) => {
  let { offset } = req.query;
  if (!offset){
    offset = 0;
  }
  try{
     const allQuestions = await prisma.questions.findMany({
        skip : parseInt(offset),
        take : 9
     });

     const completedQuestions = await prisma.questions.findMany({
      where : {
        solvedQuestions : {
          some : {
            status : 'accepted' ,
            userId : req.user.id
          }
        }
      } ,
      select : { id : true} ,
      distinct : ["id"]
     })
     return res.status(200).json(allQuestions.map((question) => {
      if (completedQuestions.some((q) => q.id === question.id)){
        return {...question , done : true}
      }else{
        return {...question , done : false}
      }
     }))
  }catch(err){
      console.log(err);
      return res.status(500).json({error : "Internal Server Error"});
  }
})

dashboard.get('/question/:id', async (req , res) => {
    const { id } = req.params;
    if (!id){
        return res.status(400).json({error : "Bad Request"});
    }
    try{  
      const question = await prisma.questions.findUnique({
        where : {
            id : id
        }
      });
      if (!question){
        return res.status(404).json({error : "Question not found"});
      }
      return res.status(200).json(question);
    }catch(err){
        console.log(err);
        return res.status(500).json({error : "Internal Server Error"});
    }
})


module.exports = { dashboard }