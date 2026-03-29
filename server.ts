import express from 'express';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import lemonWebhookHandler from './api/webhooks/lemon';
import checkoutHandler from './api/checkout';

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Webhook route - needs raw body for signature verification
  // We use express.raw to get the body as a Buffer
  app.post('/api/webhooks/lemon', express.raw({ type: 'application/json' }), lemonWebhookHandler);

  // Checkout route - needs json body
  app.post('/api/checkout', express.json(), checkoutHandler);

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok' });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // In production, serve static files from dist
    // This part might need adjustment based on deployment strategy, 
    // but for now we focus on the dev server.
    app.use(express.static('dist'));
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
