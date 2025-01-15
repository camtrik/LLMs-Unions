import express, { Request, Response } from 'express';
import cors from 'cors';
import { config } from 'dotenv';
import { Data } from '@icon-park/vue-next';

const app = express();
app.use(cors());
app.use(express.json());

app.post('/api/claude', async (req: Request, res: Response) => {
  try {
    const apiKey = req.headers['x-api-key'];
    if (!apiKey || Array.isArray(apiKey)) {
      res.status(400).json({ error: 'Invalid API key' });
      return;
    }
    console.log("api: ", apiKey)

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
        'x-api-key': apiKey
      },
      body: JSON.stringify(req.body)  
    });

    console.log("Response headers:", response.headers);
    console.log("Response status:", response.status);

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
      body: JSON.stringify(req.body)  
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
      res.status(500).json({ error: 'No response body from OpenAI' });
    }

  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: String(error) });
  }
});


app.post('/api/gemini', async (req: Request, res: Response) => {
  try {
    const apiKey = req.headers["api-key"]
    if (!apiKey || Array.isArray(apiKey)) {
      res.status(400).json({ error: 'Invalid API key' });
      return;
    }
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json', 
        
      },
      body: JSON.stringify(req.body)  
    });

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    if (response.body) {
      const data = await response.json();
      console.log('Gemini Response:', JSON.stringify(data, null, 2));  // 格式化打印 JSON

      res.json(data);
    } else {
      res.status(500).json({ error: 'No response body from Google' });
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


