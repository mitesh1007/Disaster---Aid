const express = require('express');
const router = express.Router();

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const callHuggingFace = async (text, retries = 3) => {
  for (let i = 0; i < retries; i++) {
    const response = await fetch(
      'https://router.huggingface.co/hf-inference/models/facebook/bart-large-mnli',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          inputs: text,
          parameters: {
            candidate_labels: ['critical emergency', 'high urgency', 'medium urgency', 'low urgency']
          }
        })
      }
    );

    const data = await response.json();

    if (data.error && data.error.includes('loading')) {
      await sleep(20000);
      continue;
    }

    return data;
  }
  throw new Error('Model failed to load after retries');
};

router.post('/classify', async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) return res.status(400).json({ error: 'No text provided' });

    const data = await callHuggingFace(text);

    let labels, scores;
    if (Array.isArray(data)) {
      labels = data.map(d => d.label);
      scores = data.map(d => d.score);
    } else if (data.labels) {
      labels = data.labels;
      scores = data.scores;
    } else {
      return res.status(503).json({ error: 'Model still loading, try again' });
    }

    const topLabel = labels[0];
    const topScore = scores[0];

    const urgencyMap = {
      'critical emergency': 'critical',
      'high urgency': 'high',
      'medium urgency': 'medium',
      'low urgency': 'low'
    };

    res.json({
      urgency: urgencyMap[topLabel],
      confidence: Math.round(topScore * 100),
      label: topLabel
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;