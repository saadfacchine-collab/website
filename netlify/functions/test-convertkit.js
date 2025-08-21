const fetch = require('node-fetch');

exports.handler = async (event, context) => {
  try {
    const CONVERTKIT_API_KEY = process.env.CONVERTKIT_API_KEY;
    const CONVERTKIT_FORM_ID = process.env.CONVERTKIT_FORM_ID;
    
    console.log('API Key length:', CONVERTKIT_API_KEY ? CONVERTKIT_API_KEY.length : 0);
    console.log('Form ID:', CONVERTKIT_FORM_ID);
    
    // Test 1: Get account info
    const accountResponse = await fetch('https://api.convertkit.com/v3/account', {
      headers: {
        'Authorization': `Bearer ${CONVERTKIT_API_KEY}`
      }
    });
    
    const accountData = await accountResponse.json();
    console.log('Account response:', accountData);
    
    // Test 2: Get forms list
    const formsResponse = await fetch('https://api.convertkit.com/v3/forms', {
      headers: {
        'Authorization': `Bearer ${CONVERTKIT_API_KEY}`
      }
    });
    
    const formsData = await formsResponse.json();
    console.log('Forms response:', formsData);
    
    // Test 3: Get specific form
    const formResponse = await fetch(`https://api.convertkit.com/v3/forms/${CONVERTKIT_FORM_ID}`, {
      headers: {
        'Authorization': `Bearer ${CONVERTKIT_API_KEY}`
      }
    });
    
    const formData = await formResponse.json();
    console.log('Specific form response:', formData);
    
    return {
      statusCode: 200,
      body: JSON.stringify({
        account: accountData,
        forms: formsData,
        specificForm: formData,
        apiKeyLength: CONVERTKIT_API_KEY ? CONVERTKIT_API_KEY.length : 0,
        formId: CONVERTKIT_FORM_ID
      })
    };
    
  } catch (error) {
    console.error('Test error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};
