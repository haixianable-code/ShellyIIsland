
import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';
import { Buffer } from 'buffer';

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const rawBody = req.body;
    const secret = process.env.LEMONSQUEEZY_WEBHOOK_SECRET;
    const hmac = crypto.createHmac('sha256', secret || '');
    const digest = Buffer.from(hmac.update(rawBody).digest('hex'), 'utf8');
    
    const signatureHeader = req.headers['x-signature'];
    const signatureStr = Array.isArray(signatureHeader) ? signatureHeader[0] : signatureHeader || '';
    const signature = Buffer.from(signatureStr, 'utf8');

    // 1. Verify Signature (Security Check)
    if (digest.length !== signature.length || !crypto.timingSafeEqual(digest, signature)) {
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
            // Handle Lifetime Logic: if renews_at is null, set premium_until to a sentinel value
            const renewsAt = data.attributes.renews_at;
            const premiumUntil = renewsAt ? renewsAt : '9999-12-31T23:59:59Z';

            // Update User Profile
            const { error } = await supabase
                .from('profiles')
                .update({ 
                    is_premium: true,
                    tier: 'premium', // Set tier to premium
                    subscription_id: data.id,
                    customer_id: data.attributes.customer_id,
                    variant_name: data.attributes.variant_name,
                    premium_until: premiumUntil,
                    ai_lifetime_used: 0 // Reset gift usage on purchase
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
