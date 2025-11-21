const axios = require('axios');

const testWebhook = async () => {
  try {
    const webhookUrl = 'http://localhost:5000/api/payments/webhook/paystack';

    // Sample payload mimicking Paystack's charge.success event
    const payload = {
      event: 'charge.success',
      data: {
        reference: 'TEST_REF_12345',
        amount: 10000,
        currency: 'NGN',
        customer: { email: 'test@example.com' }
      }
    };

    const response = await axios.post(webhookUrl, payload, {
      headers: { 'Content-Type': 'application/json' }
    });

    console.log('Webhook test response:', response.data);
  } catch (err) {
    console.error('Webhook test failed:', err.message);
  }
};

// Run the test
testWebhook();