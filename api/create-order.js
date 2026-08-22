import { createClient } from '@supabase/supabase-js';

const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID;
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET;
const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

export default async function handler(req, res) {
  res.setHeader('Content-Type', 'application/json');

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!RAZORPAY_KEY_ID || !RAZORPAY_KEY_SECRET) {
    return res.status(500).json({ error: 'Razorpay is not configured' });
  }

  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    return res.status(500).json({ error: 'Payment authentication is not configured' });
  }

  try {
    const authorization = req.headers.authorization || '';
    const accessToken = authorization.startsWith('Bearer ') ? authorization.slice(7) : '';
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
      auth: { autoRefreshToken: false, persistSession: false },
    });
    const { data: userData, error: userError } = await supabase.auth.getUser(accessToken);
    if (userError || !userData.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    const currency = 'INR';
    const receipt = String((body && body.receipt) || `status200_${Date.now()}`);

    if (!/^status200_pro_[a-zA-Z0-9_-]{8,64}$/.test(receipt)) {
      return res.status(400).json({ error: 'Invalid payment receipt' });
    }

    const response = await fetch('https://api.razorpay.com/v1/orders', {
      method: 'POST',
      headers: {
        Authorization: `Basic ${Buffer.from(`${RAZORPAY_KEY_ID}:${RAZORPAY_KEY_SECRET}`).toString('base64')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: 5000,
        currency,
        receipt,
        payment_capture: 1,
      }),
    });

    if (response.status === 401) {
      return res.status(401).json({ error: 'Razorpay authentication failed' });
    }

    if (!response.ok) {
      const errorBody = await response.text();
      return res.status(500).json({
        error: 'Failed to create Razorpay order',
        details: errorBody,
      });
    }

    const data = await response.json();
    return res.status(200).json({
      order_id: data.id,
      amount: data.amount,
      currency: data.currency,
    });
  } catch (error) {
    console.error('create-order error:', error);
    return res.status(500).json({ error: 'Failed to create Razorpay order' });
  }
};
