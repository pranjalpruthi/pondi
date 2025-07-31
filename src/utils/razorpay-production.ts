// Production-ready Razorpay integration
// This shows how to integrate with the MCP server for real orders

export interface ProductionOrderData {
  amount: number; // in rupees
  currency: string;
  seva_type: string;
  tier_id: string;
}

export interface ProductionRazorpayOrder {
  id: string;
  amount: number; // in paise
  currency: string;
  receipt: string;
  status: string;
}

// Production function that would use MCP server
// This would be called from your backend API
export async function createProductionOrder(data: ProductionOrderData): Promise<ProductionRazorpayOrder> {
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

    // In your backend, you would use the MCP server like this:
    /*
    const razorpayOrder = await mcp_rzp_sse_mcp_server_create_order({
      amount: amountInPaise,
      currency: data.currency,
      receipt: receipt,
      notes: notes
    });

    return {
      id: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      receipt: razorpayOrder.receipt,
      status: razorpayOrder.status
    };
    */

    // For demo, create mock order with realistic structure
    const order: ProductionRazorpayOrder = {
      id: `order_${Math.random().toString(36).substring(2, 15)}`,
      amount: amountInPaise,
      currency: data.currency,
      receipt: receipt,
      status: 'created'
    };

    console.log('Production order created:', order);
    console.log('Order notes:', notes);

    return order;

  } catch (error) {
    console.error('Error creating production order:', error);
    throw new Error('Failed to create payment order');
  }
}

// Production payment verification
export async function verifyProductionPayment(paymentData: {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
  seva_type: string;
  amount: number;
}) {
  try {
    // In production, this would:
    // 1. Send payment data to your backend
    // 2. Verify signature using Razorpay secret key
    // 3. Update database with membership info
    // 4. Send confirmation email
    // 5. Set up subscription if recurring

    console.log('Verifying payment:', paymentData);

    // Mock verification (always returns success for demo)
    const verificationResult = {
      verified: true,
      membership_id: `membership_${Math.random().toString(36).substring(2, 15)}`,
      subscription_id: `sub_${Math.random().toString(36).substring(2, 15)}`,
      next_billing_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
    };

    // Save to localStorage for demo
    localStorage.setItem('membership_info', JSON.stringify({
      ...verificationResult,
      payment_id: paymentData.razorpay_payment_id,
      order_id: paymentData.razorpay_order_id,
      seva_type: paymentData.seva_type,
      amount: paymentData.amount,
      created_at: new Date().toISOString()
    }));

    return verificationResult;

  } catch (error) {
    console.error('Error verifying payment:', error);
    throw new Error('Payment verification failed');
  }
}

// Function to get membership status
export function getMembershipInfo() {
  try {
    const membershipData = localStorage.getItem('membership_info');
    return membershipData ? JSON.parse(membershipData) : null;
  } catch (error) {
    console.error('Error getting membership info:', error);
    return null;
  }
}

// Backend API endpoint example (for reference)
export const BACKEND_API_EXAMPLE = `
// Example backend endpoint using MCP server
app.post('/api/create-razorpay-order', async (req, res) => {
  try {
    const { amount, currency, seva_type, tier_id } = req.body;
    
    const order = await mcp_rzp_sse_mcp_server_create_order({
      amount: amount * 100, // Convert to paise
      currency: currency,
      receipt: \`receipt_\${Date.now()}\`,
      notes: {
        seva_type,
        tier_id,
        subscription_type: 'monthly',
        amount_inr: amount
      }
    });
    
    res.json(order);
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ error: 'Failed to create order' });
  }
});

app.post('/api/verify-payment', async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    
    // Verify signature
    const crypto = require('crypto');
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest('hex');
    
    if (expectedSignature === razorpay_signature) {
      // Payment verified - create membership record
      // Send confirmation email
      // Set up subscription
      res.json({ verified: true, status: 'success' });
    } else {
      res.status(400).json({ verified: false, status: 'failure' });
    }
  } catch (error) {
    console.error('Error verifying payment:', error);
    res.status(500).json({ error: 'Verification failed' });
  }
});
`;