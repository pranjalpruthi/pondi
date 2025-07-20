import { addRegistration, type RegistrationData } from '@/integrations/nocodb-api';
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

// This is the API route handler for the Tally webhook.
// It follows the standard Web API for Request and Response.
export default async function tallyWebhookHandler(request: Request): Promise<Response> {
  if (request.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 });
  }

  try {
    const payload: TallyWebhookPayload = await request.json();
    
    const { ipAddress, fields } = payload.data;

    // Extract basic info from the form
    const name = findFieldValue(fields, 'name');
    const email = findFieldValue(fields, 'email');
    const phone = findFieldValue(fields, 'phone');

    let locationData: Partial<RegistrationData> = {
      IPAddress: ipAddress,
    };

    // Fetch location data from IP address
    if (ipAddress) {
      try {
        const ipInfoResponse = await axios.get<IPInfo>(`https://ipinfo.io/${ipAddress}/json`);
        const { city, region, country } = ipInfoResponse.data;
        locationData = {
          ...locationData,
          City: city,
          Region: region,
          Country: country,
        };
      } catch (error) {
        console.error(`Failed to fetch location for IP ${ipAddress}:`, error);
        // Continue without location data if the lookup fails
      }
    }

    // Prepare data for NocoDB
    const registrationData: RegistrationData = {
      Name: name,
      Email: email,
      Phone: phone,
      ...locationData,
    };

    // Submit to NocoDB
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
