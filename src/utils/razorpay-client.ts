// Client-side Razorpay utilities
// This simulates what would normally be done on your backend

export interface OrderData {
  amount: number; // in rupees
  currency: string;
  seva_type: string;
  tier_id: string;
}

export interface RazorpayOrder {
  id: string;
  amount: number; // in paise
  currency: string;
  receipt: string;
  status: string;
}

// Creates a real Razorpay order using backend API
// For now, we'll simulate this but with proper structure
export async function createOrder(data: OrderData): Promise<RazorpayOrder> {
  try {
    // Convert amount to paise
    const amountInPaise = data.amount * 100;
    
    // Generate unique receipt
    const receipt = `receipt_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    
    // In a real app, this would call your backend API
    // which would use the Razorpay MCP server to create the order
    
    // For now, let's create a properly structured mock order
    // that matches Razorpay's expected format
    const order: RazorpayOrder = {
      id: `order_${Math.random().toString(36).substring(2, 15)}`,
      amount: amountInPaise,
      currency: data.currency,
      receipt: receipt,
      status: 'created'
    };
    
    console.log('Created order:', order);
    console.log('Order metadata:', {
      seva_type: data.seva_type,
      tier_id: data.tier_id,
      amount_inr: data.amount
    });
    
    return order;
    
  } catch (error) {
    console.error('Error creating order:', error);
    throw new Error('Failed to create payment order');
  }
}

// Function to save payment success info
// In production, this would send data to your backend
export async function savePaymentSuccess(paymentData: {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature?: string;
  seva_type: string;
  amount: number;
}) {
  try {
    console.log('Payment successful - saving data:', paymentData);
    
    // In production, you would:
    // 1. Send this data to your backend
    // 2. Verify the payment signature
    // 3. Create membership record in database
    // 4. Send confirmation email
    // 5. Update user's subscription status
    
    // For now, just log it
    localStorage.setItem('last_payment', JSON.stringify({
      ...paymentData,
      timestamp: new Date().toISOString()
    }));
    
    return { success: true };
    
  } catch (error) {
    console.error('Error saving payment data:', error);
    throw new Error('Failed to save payment information');
  }
}