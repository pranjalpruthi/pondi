// Backend API endpoint for creating Razorpay orders
// This would typically be in your backend server (Node.js/Express, etc.)

import type { CreateOrderRequest, CreateOrderResponse } from '../razorpay';

// This is a mock backend endpoint
// In a real application, this would be your server-side API
export async function POST(request: Request): Promise<Response> {
    try {
        const data: CreateOrderRequest = await request.json();

        // Validate request data
        if (!data.amount || !data.currency || !data.seva_type) {
            return new Response(
                JSON.stringify({ error: 'Missing required fields' }),
                { status: 400, headers: { 'Content-Type': 'application/json' } }
            );
        }

        // Convert amount to paise (Razorpay expects amount in smallest currency unit)
        const amountInPaise = data.amount * 100;

        // Generate unique receipt
        const receipt = data.receipt || `receipt_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

        // Prepare notes for order metadata
        const notes = {
            seva_type: data.seva_type,
            subscription_type: 'monthly',
            amount_inr: data.amount,
            ...data.notes
        };

        // Here you would use the Razorpay MCP server to create a real order
        // Example using the MCP server:
        /*
        const razorpayOrder = await mcp_rzp_sse_mcp_server_create_order({
          amount: amountInPaise,
          currency: data.currency,
          receipt: receipt,
          notes: notes
        });
        */

        // For demo purposes, create a mock order
        console.log('Creating order with notes:', notes);
        const order: CreateOrderResponse = {
            id: `order_${Math.random().toString(36).substring(2, 15)}`,
            amount: amountInPaise,
            currency: data.currency,
            receipt: receipt,
            status: 'created'
        };

        return new Response(
            JSON.stringify(order),
            {
                status: 200,
                headers: { 'Content-Type': 'application/json' }
            }
        );

    } catch (error) {
        console.error('Error creating Razorpay order:', error);
        return new Response(
            JSON.stringify({ error: 'Failed to create payment order' }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
}

// Example of how to integrate with Razorpay MCP server in a real backend
export async function createOrderWithMCP(data: CreateOrderRequest): Promise<CreateOrderResponse> {
    try {
        // This would be called from your actual backend server
        const amountInPaise = data.amount * 100;
        const receipt = data.receipt || `receipt_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

        const notes = {
            seva_type: data.seva_type,
            subscription_type: 'monthly',
            amount_inr: data.amount,
            ...data.notes
        };

        // Use Razorpay MCP server to create order
        // This would be available in your backend environment
        /*
        const razorpayOrder = await mcp_rzp_sse_mcp_server_create_order({
          amount: amountInPaise,
          currency: data.currency as 'INR',
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

        // Mock response for now
        console.log('Creating order with MCP notes:', notes);
        return {
            id: `order_${Math.random().toString(36).substring(2, 15)}`,
            amount: amountInPaise,
            currency: data.currency,
            receipt: receipt,
            status: 'created'
        };

    } catch (error) {
        console.error('Error creating order with MCP:', error);
        throw new Error('Failed to create payment order');
    }
}