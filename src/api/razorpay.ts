// API functions for Razorpay integration
export interface CreateOrderRequest {
  amount: number; // in rupees
  currency: string;
  seva_type: string;
  receipt?: string;
  notes?: Record<string, any>;
}

export interface CreateOrderResponse {
  id: string;
  amount: number;
  currency: string;
  receipt: string;
  status: string;
}

export async function createRazorpayOrder(data: CreateOrderRequest): Promise<CreateOrderResponse> {
  try {
    // Convert amount to paise (Razorpay expects amount in smallest currency unit)
    const amountInPaise = data.amount * 100;
    
    // Generate unique receipt
    const receipt = data.receipt || `receipt_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    
    // Prepare notes for order metadata
    const orderNotes = {
      seva_type: data.seva_type,
      subscription_type: 'monthly',
      amount_inr: data.amount,
      ...data.notes
    };

    // For development/demo purposes, create a mock order
    // In production, you would use the Razorpay MCP server to create real orders
    console.log('Creating order with notes:', orderNotes);
    
    const order: CreateOrderResponse = {
      id: `order_${Math.random().toString(36).substring(2, 15)}`,
      amount: amountInPaise,
      currency: data.currency,
      receipt: receipt,
      status: 'created'
    };

    return order;
  } catch (error) {
    console.error('Error creating Razorpay order:', error);
    throw new Error('Failed to create payment order');
  }
}

// Function to create real Razorpay order using MCP server (for production)
export async function createRealRazorpayOrder(data: CreateOrderRequest): Promise<CreateOrderResponse> {
  try {
    // This would be called from your backend API endpoint
    // Example backend call using Razorpay MCP server:
    /*
    const amountInPaise = data.amount * 100;
    const receipt = data.receipt || `receipt_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    const orderNotes = {
      seva_type: data.seva_type,
      subscription_type: 'monthly',
      amount_inr: data.amount,
      ...data.notes
    };

    const response = await fetch('/api/create-razorpay-order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        amount: amountInPaise,
        currency: data.currency,
        receipt: receipt,
        notes: orderNotes
      })
    });
    
    const order = await response.json();
    return order;
    */
    
    // For now, return mock data using the main function
    return createRazorpayOrder(data);
    
  } catch (error) {
    console.error('Error creating real Razorpay order:', error);
    throw new Error('Failed to create payment order');
  }
}

export interface PaymentSuccessResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

export async function verifyPayment(response: PaymentSuccessResponse): Promise<boolean> {
  try {
    // In a real app, you would verify the payment signature on your backend
    // This is just a simulation
    console.log('Payment verification:', response);
    return true;
  } catch (error) {
    console.error('Error verifying payment:', error);
    return false;
  }
}