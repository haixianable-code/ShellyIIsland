
import { createClient } from '@supabase/supabase-js';

export const config = {
  runtime: 'edge',
};

export default async function handler(req: Request) {
  if (req.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 });
  }

  try {
    // 1. Get the user from the request header (sent by frontend) or body
    // For better security, we usually validate the JWT, but for simplicity here
    // we will trust the user_id sent from the client-side session for now, 
    // OR ideally, validate the Authorization header if sent.
    // Here we will use a simple approach: Frontend sends user_email or user_id.
    
    const { productId, userId, userEmail } = await req.json();

    if (!userId || !productId) {
      return new Response(JSON.stringify({ error: 'Missing parameters' }), { status: 400 });
    }

    const apiKey = process.env.LEMONSQUEEZY_API_KEY;
    const storeId = process.env.LEMONSQUEEZY_STORE_ID;

    if (!apiKey || !storeId) {
      return new Response(JSON.stringify({ error: 'Server config error: Missing API Key or Store ID' }), { status: 500 });
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
                id: productId.toString()
              }
            }
          }
        }
      })
    });

    const result = await response.json();

    if (result.errors) {
      console.error('Lemon API Error:', result.errors);
      return new Response(JSON.stringify({ error: result.errors[0].detail }), { status: 500 });
    }

    // 3. Return the checkout URL
    return new Response(JSON.stringify({ url: result.data.attributes.url }), {
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error: any) {
    console.error('Checkout Error:', error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
