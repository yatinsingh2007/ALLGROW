const express = require("express");
const { prisma } = require("../prisma/prismaClient");
const profile = express.Router();

profile.get("/submissions", async (req, res) => {
  try {
    const rawSubmissionData = await prisma.submissions.findMany({
      where: {
        userId: req.user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    console.log(rawSubmissionData);
    const refinedSubmissionData = rawSubmissionData.map((submission) => {
      return { ...submission, createdAt: Date(submission.createdAt) };
    });
    return res.status(200).json(refinedSubmissionData);
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      error: "Internal Server Error",
    });
  }
});

profile.get("/count-of-submittedQuestions", async (req, res) => {
  try {
    const data = await prisma.submissions.findMany({
      where: {
        userId: req.user.id,
        status: "accepted",
      },
      distinct: ["questionId"],
      include: {
        question: true,
      },
    });

    let totalData = await prisma.$queryRaw`
    select
      difficulty ,
      count(*) as total_count
    from Questions
    group by difficulty;`;

    totalData = totalData.map((data) => {
      return { ...data, total_count: Number(data.total_count) };
    });

    const respData = data.reduce((acc, curr) => {
      if (acc[curr.question.difficulty]) {
        acc[curr.question.difficulty] += 1;
      } else {
        acc[curr.question.difficulty] = 1;
      }
      return acc;
    }, {});

    return res.status(200).json([...totalData, respData]);
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      error: "Internal Server Error",
    });
  }
});

module.exports = { profile };
