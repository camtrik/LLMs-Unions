import express, { Request, Response } from 'express';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

app.post('/api/claude', async (req: Request, res: Response) => {
  try {
    // 1. 获取前端传来的 API key
    const apiKey = req.headers['x-api-key'];
    if (!apiKey || Array.isArray(apiKey)) {
      res.status(400).json({ error: 'Invalid API key' });
      return;
    }

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
        'x-api-key': apiKey
      },
      body: JSON.stringify(req.body)  // 直接转发前端发来的 body
    });

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    if (response.body) {
      const reader = response.body.getReader();

      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          res.end();
          break;
        } 
        res.write(value);
      }
    } else {
      res.status(500).json({ error: 'No response body from Anthropic' });
    }

  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: String(error) });
  }
});

app.post('/api/chatgpt', async (req: Request, res: Response) => {
  try {
    const apiKey = req.headers.authorization
    if (!apiKey || Array.isArray(apiKey) || !apiKey.startsWith('Bearer ')) {
      res.status(400).json({ error: 'Invalid API key' });
      return;
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json', 
        Authorization: apiKey, 
      },
      body: JSON.stringify(req.body)  // 直接转发前端发来的 body
    });

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    if (response.body) {
      const reader = response.body.getReader();

      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          res.end();
          break;
        } 
        res.write(value);
      }
    } else {
      res.status(500).json({ error: 'No response body from Anthropic' });
    }

  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: String(error) });
  }
});


const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});