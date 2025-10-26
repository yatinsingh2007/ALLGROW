const express = require("express");
const { prisma } = require("../prisma/prismaClient");
const profile = express.Router();

profile.get("/submissions", async (req, res) => {
  try {
    const ourUser = req.user;
    const data = await prisma.submissions.findMany({
      where: {
        userId: ourUser.id,
      },
      include: {
        question: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return res.status(200).json(data);
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      error: "Internal Server Error",
    });
  }
});

profile.get("/heat-map-details", async (req, res) => {
  try {
    const id = req.user.id;
    const result = await prisma.$queryRaw`
        select
            date(createdAt) as date ,
            count(*) as count
        from submissions
        where userId = ${id}
        group by date(createdAt)
        order by date(createdAt) asc`;

    const formatted = result.map((r) => ({
      date: r.date,
      count: Number(r.count),
    }));

    return res.json(formatted);
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      error: "Internal Server Error",
    });
  }
});

module.exports = { profile };
