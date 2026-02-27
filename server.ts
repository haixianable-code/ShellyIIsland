import express from 'express';
import { createServer as createViteServer } from 'vite';
import crypto from 'crypto';
import { createClient } from '@supabase/supabase-js';

const app = express();
const PORT = 3000;

// --- Configuration ---
const LEMON_VARIANT_ID = process.env.LEMON_VARIANT_ID || '828679';
const LEMON_STORE_ID = process.env.LEMONSQUEEZY_STORE_ID;
const LEMON_API_KEY = process.env.LEMONSQUEEZY_API_KEY;
const LEMON_WEBHOOK_SECRET = process.env.LEMONSQUEEZY_WEBHOOK_SECRET;
const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

// --- Webhook Route (Must be before express.json() to get raw body) ---
app.post('/api/webhooks/lemon', express.raw({ type: 'application/json' }), async (req, res) => {
  try {
    if (!LEMON_WEBHOOK_SECRET) {
      console.error('Missing LEMONSQUEEZY_WEBHOOK_SECRET');
      return res.status(500).json({ error: 'Server config error' });
    }

    const rawBody = req.body;
    const hmac = crypto.createHmac('sha256', LEMON_WEBHOOK_SECRET);
    const digest = Buffer.from(hmac.update(rawBody).digest('hex'), 'utf8');
    const signature = Buffer.from(req.headers['x-signature'] as string || '', 'utf8');

    if (!crypto.timingSafeEqual(digest, signature)) {
      return res.status(401).json({ message: 'Invalid signature' });
    }

    const payload = JSON.parse(rawBody.toString());
    const eventName = payload.meta.event_name;
    const customData = payload.meta.custom_data;
    const data = payload.data;

    // Initialize Supabase Admin
    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
        console.error('Missing Supabase Config');
        return res.status(500).json({ error: 'Server config error' });
    }
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    if (eventName === 'order_created' || eventName === 'subscription_created') {
        const userId = customData?.user_id;
        if (userId) {
            // Fix: Handle lifetime duration (renews_at is null)
            const renewsAt = data.attributes.renews_at;
            const premiumUntil = renewsAt ? renewsAt : '9999-12-31T23:59:59Z';

            const { error } = await supabase
                .from('profiles')
                .update({ 
                    is_premium: true,
                    tier: 'premium',
                    subscription_id: data.id,
                    customer_id: data.attributes.customer_id,
                    variant_name: data.attributes.variant_name,
                    premium_until: premiumUntil,
                    ai_lifetime_used: 0 
                })
                .eq('id', userId);
            
            if (error) console.error('Supabase update failed:', error);
        }
    }
    
    res.status(200).json({ received: true });

  } catch (error: any) {
    console.error('Webhook Error:', error);
    res.status(500).json({ error: error.message });
  }
});

// --- JSON Middleware for other routes ---
app.use(express.json());

// --- Checkout Route ---
app.post('/api/checkout', async (req, res) => {
  try {
    const { userId, userEmail } = req.body;

    if (!userId) {
      return res.status(400).json({ error: 'Missing userId' });
    }

    if (!LEMON_API_KEY || !LEMON_STORE_ID) {
      return res.status(500).json({ error: 'Server config error: Missing API Key or Store ID' });
    }

    // Call Lemon Squeezy API
    const response = await fetch('https://api.lemonsqueezy.com/v1/checkouts', {
      method: 'POST',
      headers: {
        'Accept': 'application/vnd.api+json',
        'Content-Type': 'application/vnd.api+json',
        'Authorization': `Bearer ${LEMON_API_KEY}`
      },
      body: JSON.stringify({
        data: {
          type: "checkouts",
          attributes: {
            checkout_data: {
              custom: {
                user_id: userId
              },
              email: userEmail
            },
            product_options: {
                redirect_url: 'https://ssisland.space/',
                receipt_button_text: 'Return to Island',
                receipt_thank_you_note: '¡Gracias! Your island is now upgraded.'
            }
          },
          relationships: {
            store: {
              data: {
                type: "stores",
                id: LEMON_STORE_ID.toString()
              }
            },
            variant: {
              data: {
                type: "variants",
                id: LEMON_VARIANT_ID.toString()
              }
            }
          }
        }
      })
    });

    const result = await response.json();

    if (result.errors) {
      console.error('Lemon API Error:', result.errors);
      return res.status(500).json({ error: result.errors[0].detail });
    }

    return res.json({ url: result.data.attributes.url });

  } catch (error: any) {
    console.error('Checkout Error:', error);
    return res.status(500).json({ error: error.message });
  }
});

// --- Vite Middleware ---
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // In production, serve static files from dist
    app.use(express.static('dist'));
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
