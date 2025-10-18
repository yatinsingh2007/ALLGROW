const express = require('express');

const { prisma } = require('../prisma/prismaClient');

const dashboard = express.Router()

const { checkUserAuthentication } = require('../middleware/middleware')


dashboard.get('' , checkUserAuthentication ,  async (req , res) => {
  let { offset , limit } = req.query;
  if (!offset){
    offset = 0;
  }
  if (!limit){
    limit = 9;
  }
  try{
     const allQuestions = await prisma.questions.findMany({
        skip : parseInt(offset),
        take : parseInt(limit)
     });
      return res.status(200).json(allQuestions);
  }catch(err){
      console.log(err);
      return res.status(500).json({error : "Internal Server Error"});
  }
})

dashboard.get('/question/:id', checkUserAuthentication , async (req , res) => {
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


module.exports = {
    dashboard
}