require('dotenv').config();
const { prisma } = require('./prisma/pismaClient');

const { checkUserAuthentication } = require('./middleware/middleware');
const express = require('express');
const { auth } = require('./auth/auth');
const app = express();
app.use(express.json());

app.use('/auth' , auth )

app.get('/dashboard' , checkUserAuthentication ,  async (req , res) => {
  let { offset , limit } = req.query;
  if (!offset){
    offset = 0;
  }
  if (!limit){
    limit = 10;
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

app.get('/question', checkUserAuthentication , async (req , res) => {
    const { id } = req.query;
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