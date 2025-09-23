require('dotenv').config();
const { prisma } = require('./prisma/client');
const express = require('express');
const { auth } = require('./auth/auth');
const app = express();
app.use(express.json());

app.use('/auth' , auth )

prisma.questions.create({
  data: {
    "title": "Sum of Squares",
    "description": "Given an integer n, print the sum of squares of all numbers from 1 to n.",
    "input_format": "Single integer n",
    "output_format": "Single integer representing sum of squares",
    "sample_input": "3",
    "sample_output": "14",
    "test_cases": [
      { "input": "3", "output": "14" },
      { "input": "5", "output": "55" },
      { "input": "1", "output": "1" }
    ],
    "difficulty": "Easy"
  },
}).then(() => {
  console.log("Question created successfully.");
}).catch((error) => {
  console.error("Error creating question:", error);
});

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