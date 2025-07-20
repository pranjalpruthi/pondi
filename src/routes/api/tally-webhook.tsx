import { createFileRoute } from '@tanstack/react-router';
import { addRegistration, type RegistrationData } from '../../integrations/nocodb-api';
import axios from 'axios';

// Define the expected structure of the Tally webhook payload
interface TallyWebhookPayload {
  data: {
    responseId: string;
    submissionId: string;
    respondentId: string;
    formId: string;
    formName: string;
    createdAt: string;
    ipAddress: string;
    fields: Array<{
      key: string;
      label: string;
      type: string;
      value: any;
    }>;
  };
}

// Define the structure of the IP geolocation API response
interface IPInfo {
  ip: string;
  city: string;
  region: string;
  country: string;
  loc: string;
  org: string;
  postal: string;
  timezone: string;
}

// Helper function to find a field value by its label
const findFieldValue = (fields: TallyWebhookPayload['data']['fields'], label: string): string | undefined => {
  const field = fields.find(f => f.label.toLowerCase().includes(label.toLowerCase()));
  return field?.value;
};

// The path is inferred from the file location, so we call createFileRoute with no arguments.
export const Route = createFileRoute('/api/tally-webhook')({
  // The loader function runs on the server. We use `as any` to bypass a TypeScript
  // type inference issue while still getting access to the `request` object at runtime.
  loader: async (ctx: any) => {
    const request = ctx.request as Request;
    
    // Handle GET requests for health checks
    if (request.method === 'GET') {
      return new Response(JSON.stringify({ message: 'Tally webhook endpoint is active. Use POST to submit data.' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Handle POST requests from the webhook
    if (request.method === 'POST') {
      try {
        const payload: TallyWebhookPayload = await request.json();
        const { ipAddress, fields } = payload.data;

        // Extract form data
        const name = findFieldValue(fields, 'name');
        const email = findFieldValue(fields, 'email');
        const phone = findFieldValue(fields, 'phone');

        let locationData: Partial<RegistrationData> = { IPAddress: ipAddress };

        // Fetch location data from IP address
        if (ipAddress) {
          try {
            const ipInfoResponse = await axios.get<IPInfo>(`https://ipinfo.io/${ipAddress}/json`);
            const { city, region, country } = ipInfoResponse.data;
            locationData = { ...locationData, City: city, Region: region, Country: country };
          } catch (error) {
            console.error(`Failed to fetch location for IP ${ipAddress}:`, error);
          }
        }

        // Prepare and submit data to NocoDB
        const registrationData: RegistrationData = { Name: name, Email: email, Phone: phone, ...locationData };
        await addRegistration(registrationData);

        return new Response(JSON.stringify({ success: true, message: 'Registration successful.' }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        });

      } catch (error: any) {
        console.error('Error processing Tally webhook:', error);
        return new Response(JSON.stringify({ success: false, message: 'Internal Server Error' }), {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        });
      }
    }

    // For any other method, return Method Not Allowed
    return new Response('Method Not Allowed', { status: 405 });
  },
  // A minimal component is required for a .tsx route file to be valid.
  component: () => null,
});
