require('dotenv').config();
const { prisma } = require('./prisma/client');
const express = require('express');
const { auth } = require('./auth/auth');
const app = express();
app.use(express.json());

app.use('/auth' , auth )

prisma.questions.create({
  data: {
  "title": "First N Primes",
  "description": "Print the first N prime numbers.",
  "input_format": "Single integer n (number of primes to print)",
  "output_format": "Print n prime numbers separated by space",
  "sample_input": "5",
  "sample_output": "2 3 5 7 11",
  "test_cases": [
    { "input": "3", "output": "2 3 5" },
    { "input": "1", "output": "2" },
    { "input": "6", "output": "2 3 5 7 11 13" }
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