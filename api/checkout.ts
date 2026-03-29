
import { createClient } from '@supabase/supabase-js';

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    // 1. Get the user from the request body
    const { userId, userEmail } = req.body;

    if (!userId) {
      return res.status(400).json({ error: 'Missing parameters: userId is required' });
    }

    const apiKey = process.env.LEMONSQUEEZY_API_KEY;
    const storeId = process.env.LEMONSQUEEZY_STORE_ID;
    const variantId = process.env.LEMON_VARIANT_ID;

    if (!apiKey || !storeId || !variantId) {
      console.error('Missing env vars:', { apiKey: !!apiKey, storeId: !!storeId, variantId: !!variantId });
      return res.status(500).json({ error: 'LemonSqueezy API keys are not configured. Please add LEMONSQUEEZY_API_KEY, LEMONSQUEEZY_STORE_ID, and LEMON_VARIANT_ID to your environment variables.' });
    }

    // 2. Create Checkout via Lemon Squeezy API
    const response = await fetch('https://api.lemonsqueezy.com/v1/checkouts', {
      method: 'POST',
      headers: {
        'Accept': 'application/vnd.api+json',
        'Content-Type': 'application/vnd.api+json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        data: {
          type: "checkouts",
          attributes: {
            checkout_data: {
              custom: {
                user_id: userId // CRITICAL: This ties the payment to the Supabase User
              },
              email: userEmail // Pre-fill email for better UX
            },
            product_options: {
                redirect_url: 'https://ssisland.space/', // Go back to app after success
                receipt_button_text: 'Return to Island',
                receipt_thank_you_note: '¡Gracias! Your island is now upgraded.'
            }
          },
          relationships: {
            store: {
              data: {
                type: "stores",
                id: storeId.toString()
              }
            },
            variant: {
              data: {
                type: "variants",
                id: variantId.toString()
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

    // 3. Return the checkout URL
    return res.status(200).json({ url: result.data.attributes.url });

  } catch (error: any) {
    console.error('Checkout Error:', error);
    return res.status(500).json({ error: error.message });
  }
}
