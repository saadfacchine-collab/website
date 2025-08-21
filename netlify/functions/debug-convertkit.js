const fetch = require('node-fetch');

exports.handler = async (event, context) => {
  try {
    const CONVERTKIT_API_KEY = process.env.CONVERTKIT_API_KEY;
    const CONVERTKIT_FORM_ID = process.env.CONVERTKIT_FORM_ID;
    
    console.log('=== ConvertKit Debug Information ===');
    console.log('API Key exists:', !!CONVERTKIT_API_KEY);
    console.log('API Key length:', CONVERTKIT_API_KEY ? CONVERTKIT_API_KEY.length : 0);
    console.log('API Key preview:', CONVERTKIT_API_KEY ? `${CONVERTKIT_API_KEY.substring(0, 8)}...` : 'Not set');
    console.log('Form ID:', CONVERTKIT_FORM_ID);
    
    if (!CONVERTKIT_API_KEY) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          error: 'CONVERTKIT_API_KEY environment variable is not set',
          debug: {
            hasApiKey: false,
            hasFormId: !!CONVERTKIT_FORM_ID,
            formId: CONVERTKIT_FORM_ID
          }
        })
      };
    }
    
    if (!CONVERTKIT_FORM_ID) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          error: 'CONVERTKIT_FORM_ID environment variable is not set',
          debug: {
            hasApiKey: true,
            apiKeyLength: CONVERTKIT_API_KEY.length,
            hasFormId: false
          }
        })
      };
    }
    
    // Test 1: Get account information
    console.log('Testing account API...');
    const accountResponse = await fetch('https://api.convertkit.com/v3/account', {
      headers: {
        'Authorization': `Bearer ${CONVERTKIT_API_KEY}`
      }
    });
    
    const accountData = await accountResponse.json();
    console.log('Account API response status:', accountResponse.status);
    console.log('Account API response:', accountData);
    
    // Test 2: Get all forms
    console.log('Testing forms API...');
    const formsResponse = await fetch('https://api.convertkit.com/v3/forms', {
      headers: {
        'Authorization': `Bearer ${CONVERTKIT_API_KEY}`
      }
    });
    
    const formsData = await formsResponse.json();
    console.log('Forms API response status:', formsResponse.status);
    console.log('Forms API response:', formsData);
    
    // Test 3: Test specific form
    console.log('Testing specific form...');
    const formResponse = await fetch(`https://api.convertkit.com/v3/forms/${CONVERTKIT_FORM_ID}`, {
      headers: {
        'Authorization': `Bearer ${CONVERTKIT_API_KEY}`
      }
    });
    
    const formData = await formResponse.json();
    console.log('Specific form API response status:', formResponse.status);
    console.log('Specific form API response:', formData);
    
    // Test 4: Test subscription endpoint
    console.log('Testing subscription endpoint...');
    const subscribeResponse = await fetch(`https://api.convertkit.com/v3/forms/${CONVERTKIT_FORM_ID}/subscribe`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        api_key: CONVERTKIT_API_KEY,
        email: 'test@example.com',
        first_name: 'Test',
        fields: {
          source: 'debug_test'
        }
      })
    });
    
    const subscribeData = await subscribeResponse.json();
    console.log('Subscribe API response status:', subscribeResponse.status);
    console.log('Subscribe API response:', subscribeData);
    
    return {
      statusCode: 200,
      body: JSON.stringify({
        debug: {
          hasApiKey: true,
          apiKeyLength: CONVERTKIT_API_KEY.length,
          hasFormId: true,
          formId: CONVERTKIT_FORM_ID
        },
        tests: {
          account: {
            status: accountResponse.status,
            data: accountData
          },
          forms: {
            status: formsResponse.status,
            data: formsData
          },
          specificForm: {
            status: formResponse.status,
            data: formData
          },
          subscribe: {
            status: subscribeResponse.status,
            data: subscribeData
          }
        }
      })
    };
    
  } catch (error) {
    console.error('Debug function error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: 'Debug function failed',
        message: error.message,
        debug: {
          hasApiKey: !!process.env.CONVERTKIT_API_KEY,
          hasFormId: !!process.env.CONVERTKIT_FORM_ID,
          apiKeyLength: process.env.CONVERTKIT_API_KEY ? process.env.CONVERTKIT_API_KEY.length : 0
        }
      })
    };
  }
};
