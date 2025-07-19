const express = require('express');
const router = express.Router();
const Interview = require('../models/Interviews');
const axios = require('axios');
require('dotenv').config();

router.post('/generate', async (req, res) => {
  try {
    const { type, role, level, techstack, amount, userid, createdat } = req.body;
    const techs = techstack.split(',').map(t => t.trim());

    // 🧠 Prompt Gemini
    const prompt = `
      Generate ${amount} interview questions for a ${level} ${role} in a ${type} interview.
      Focus on these technologies: ${techs.join(', ')}.
      Return only the list of questions dont add '*'.
    `;

    const geminiResponse = await axios.post(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-001:generateContent',
      {
        contents: [{
          parts: [{ text: prompt }]
        }]
      },
      {
        params: { key: process.env.GEMINI_API_KEY }
      }
    );

    const rawOutput = geminiResponse?.data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
    const questions = rawOutput.split('\n').filter(q => q.trim()).map(q => q.replace(/^\d+\.\s*/, ''));

    const interview = new Interview({
      type,
      role,
      level,
      techstack: techs,
      amount,
      userid,
      createdAt: createdat || new Date(),
      questions
    });

    await interview.save();
    res.status(201).json(interview);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Something went wrong!' });
  }
});

module.exports = router;
