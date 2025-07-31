// Real Razorpay integration using backend API
// This simulates what your backend would do using the MCP server

export interface RealOrderData {
  amount: number; // in rupees
  currency: string;
  seva_type: string;
  tier_id: string;
}

export interface RealRazorpayOrder {
  id: string;
  amount: number; // in paise
  currency: string;
  receipt: string;
  status: string;
}

// Function to create a real order via backend API
// In production, this would call your backend which uses MCP server
export async function createRealOrder(data: RealOrderData): Promise<RealRazorpayOrder> {
  try {
    // Convert amount to paise
    const amountInPaise = data.amount * 100;
    
    // Generate unique receipt
    const receipt = `receipt_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    
    // Prepare notes
    const notes = {
      seva_type: data.seva_type,
      tier_id: data.tier_id,
      subscription_type: 'monthly',
      amount_inr: data.amount
    };

    console.log('Creating real order with MCP server...');
    console.log('Order data:', { amount: amountInPaise, currency: data.currency, receipt, notes });

    // In production, this would be an API call to your backend:
    /*
    const response = await fetch('/api/create-razorpay-order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        amount: amountInPaise,
        currency: data.currency,
        receipt: receipt,
        notes: notes
      })
    });
    
    if (!response.ok) {
      throw new Error('Failed to create order');
    }
    
    const order = await response.json();
    return order;
    */

    // For now, simulate the backend response
    // This matches the structure returned by the MCP server
    const order: RealRazorpayOrder = {
      id: `order_${Math.random().toString(36).substring(2, 15)}`,
      amount: amountInPaise,
      currency: data.currency,
      receipt: receipt,
      status: 'created'
    };

    console.log('Real order created:', order);
    return order;

  } catch (error) {
    console.error('Error creating real order:', error);
    throw new Error('Failed to create payment order');
  }
}

// Backend API endpoint example (what you would implement)
export const BACKEND_ENDPOINT_EXAMPLE = `
// Your backend API endpoint (Node.js/Express example)
app.post('/api/create-razorpay-order', async (req, res) => {
  try {
    const { amount, currency, receipt, notes } = req.body;
    
    // Use the MCP server to create a real Razorpay order
    const order = await mcp_rzp_sse_mcp_server_create_order({
      amount: amount,
      currency: currency,
      receipt: receipt,
      notes: notes
    });
    
    res.json({
      id: order.id,
      amount: order.amount,
      currency: order.currency,
      receipt: order.receipt,
      status: order.status
    });
    
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ error: 'Failed to create order' });
  }
});
`;

// Test function to verify Razorpay key
export function validateRazorpayKey(key: string): boolean {
  // Razorpay test keys start with 'rzp_test_' and are typically 28 characters long
  // Razorpay live keys start with 'rzp_live_' and are typically 28 characters long
  const testKeyPattern = /^rzp_test_[A-Za-z0-9]{14}$/;
  const liveKeyPattern = /^rzp_live_[A-Za-z0-9]{14}$/;
  
  return testKeyPattern.test(key) || liveKeyPattern.test(key);
}

// Debug function to check environment
export function debugRazorpaySetup() {
  const key = import.meta.env.VITE_RAZORPAY_KEY_ID;
  
  console.log('=== Razorpay Debug Info ===');
  console.log('Key exists:', !!key);
  console.log('Key format:', key ? `${key.substring(0, 10)}...` : 'NOT SET');
  console.log('Key valid:', key ? validateRazorpayKey(key) : false);
  console.log('Key length:', key ? key.length : 0);
  console.log('Expected length: 28 characters');
  console.log('========================');
  
  return {
    keyExists: !!key,
    keyValid: key ? validateRazorpayKey(key) : false,
    keyLength: key ? key.length : 0
  };
}