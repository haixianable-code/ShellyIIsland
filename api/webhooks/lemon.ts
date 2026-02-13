
import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

// Webhooks usually need Node.js runtime for raw body handling and crypto
export const config = {
  api: {
    bodyParser: false, // We need raw body for signature verification
  },
};

// Helper to read raw body
async function getRawBody(readable: any): Promise<Buffer> {
  const chunks = [];
  for await (const chunk of readable) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
  }
  return Buffer.concat(chunks);
}

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const rawBody = await getRawBody(req);
    const secret = process.env.LEMONSQUEEZY_WEBHOOK_SECRET;
    const hmac = crypto.createHmac('sha256', secret || '');
    const digest = Buffer.from(hmac.update(rawBody).digest('hex'), 'utf8');
    const signature = Buffer.from(req.headers['x-signature'] || '', 'utf8');

    // 1. Verify Signature (Security Check)
    if (!crypto.timingSafeEqual(digest, signature)) {
      return res.status(401).json({ message: 'Invalid signature' });
    }

    const payload = JSON.parse(rawBody.toString());
    const eventName = payload.meta.event_name;
    const customData = payload.meta.custom_data; // This contains our user_id
    const data = payload.data;

    // 2. Initialize Supabase with GOD MODE (Service Role Key)
    const supabase = createClient(
      process.env.VITE_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // 3. Handle Events
    if (eventName === 'order_created' || eventName === 'subscription_created') {
        const userId = customData?.user_id;
        if (userId) {
            // Update User Profile
            const { error } = await supabase
                .from('profiles')
                .update({ 
                    is_premium: true,
                    subscription_id: data.id,
                    customer_id: data.attributes.customer_id,
                    variant_name: data.attributes.variant_name,
                    premium_until: data.attributes.renews_at || null // or logic for lifetime
                })
                .eq('id', userId);
            
            if (error) console.error('Supabase update failed:', error);
        }
    }
    
    // Handle Cancellations / Expirations
    if (eventName === 'subscription_cancelled' || eventName === 'subscription_expired') {
        const userId = customData?.user_id;
        if (userId) {
             // Logic: Maybe don't remove premium immediately, wait until period ends.
             // For now, we log it. You might want to set a 'cancels_at' flag.
             console.log(`User ${userId} cancelled subscription`);
        }
    }

    res.status(200).json({ received: true });

  } catch (error: any) {
    console.error('Webhook Error:', error);
    res.status(500).json({ error: error.message });
  }
}
