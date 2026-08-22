import crypto from 'crypto';
import { createClient } from '@supabase/supabase-js';

const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET;
const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

export default async function handler(req, res) {
  res.setHeader('Content-Type', 'application/json');

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!RAZORPAY_KEY_SECRET) {
    return res.status(500).json({ error: 'Razorpay is not configured' });
  }

  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    return res.status(500).json({ error: 'Payment account provisioning is not configured' });
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    const razorpay_order_id = String(body && body.razorpay_order_id ? body.razorpay_order_id : '');
    const razorpay_payment_id = String(body && body.razorpay_payment_id ? body.razorpay_payment_id : '');
    const razorpay_signature = String(body && body.razorpay_signature ? body.razorpay_signature : '');

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ error: 'Missing payment verification fields' });
    }

    const expectedSignature = crypto
      .createHmac('sha256', RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    const expectedBuffer = Buffer.from(expectedSignature, 'hex');
    const providedBuffer = Buffer.from(razorpay_signature, 'hex');

    if (
      expectedBuffer.length !== providedBuffer.length ||
      !crypto.timingSafeEqual(expectedBuffer, providedBuffer)
    ) {
      return res.status(400).json({ error: 'Signature mismatch' });
    }

    const authorization = req.headers.authorization || '';
    const accessToken = authorization.startsWith('Bearer ') ? authorization.slice(7) : '';
    if (!accessToken) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
      auth: { autoRefreshToken: false, persistSession: false },
    });
    const { data: userData, error: userError } = await supabase.auth.getUser(accessToken);
    if (userError || !userData.user) {
      return res.status(401).json({ error: 'Invalid authentication' });
    }

    const { error: profileError } = await supabase
      .from('profiles')
      .update({ is_pro: true })
      .eq('id', userData.user.id);
    if (profileError) {
      console.error('Pro provisioning error:', profileError);
      return res.status(500).json({ error: 'Could not activate Pro account' });
    }

    return res.status(200).json({
      success: true,
      razorpay_order_id,
      razorpay_payment_id,
    });
  } catch (error) {
    console.error('verify-payment error:', error);
    return res.status(500).json({ error: 'Failed to verify Razorpay payment' });
  }
};
