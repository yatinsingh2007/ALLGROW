const express = require('express');

const admin = express.Router();

admin.use(express.json());

admin.post('/add-question', async (req, res) => {
  const { title, description, input_format, output_format, sample_input, sample_output, test_cases, difficulty } = req.body;
  if (!title || !description || !input_format || !output_format || !sample_input || !sample_output || !test_cases || !difficulty) {
    return res.status(400).json({ error: 'All fields are required' });
  }
  try {
    await prisma.questions.create({
      data: { title, description, input_format, output_format, sample_input, sample_output, test_cases, difficulty }
    });
    return res.status(201).json({ message: 'Question added successfully' });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = { admin };
