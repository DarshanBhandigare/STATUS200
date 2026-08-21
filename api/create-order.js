const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID;
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET;

export default async function handler(req, res) {
  res.setHeader('Content-Type', 'application/json');

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!RAZORPAY_KEY_ID || !RAZORPAY_KEY_SECRET) {
    return res.status(500).json({ error: 'Razorpay is not configured' });
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    const amount = Number(body && body.amount);
    const currency = String((body && body.currency) || 'INR').toUpperCase();
    const receipt = String((body && body.receipt) || `status200_${Date.now()}`);

    if (!Number.isFinite(amount) || amount < 100) {
      return res.status(400).json({ error: 'Amount must be at least 100 paise' });
    }

    const response = await fetch('https://api.razorpay.com/v1/orders', {
      method: 'POST',
      headers: {
        Authorization: `Basic ${Buffer.from(`${RAZORPAY_KEY_ID}:${RAZORPAY_KEY_SECRET}`).toString('base64')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: Math.round(amount),
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
