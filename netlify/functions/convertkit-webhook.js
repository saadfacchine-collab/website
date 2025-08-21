const fetch = require('node-fetch');

exports.handler = async (event, context) => {
  // Handle CORS preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
      },
      body: ''
    };
  }

  // Only handle POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    // Debug: Log the incoming data
    console.log('📥 [', new Date().toISOString(), '] Event body:', event.body);
    console.log('📥 [', new Date().toISOString(), '] Content-Type:', event.headers['content-type']);
    
    // Parse the form data - Netlify forms send URL-encoded data
    let formData;
    if (event.headers['content-type'] && event.headers['content-type'].includes('application/json')) {
      formData = JSON.parse(event.body);
    } else {
      // Parse URL-encoded form data
      const params = new URLSearchParams(event.body);
      formData = {};
      for (const [key, value] of params) {
        formData[key] = value;
      }
    }
    
    console.log('Parsed form data:', formData);
    
    // Check if this is a newsletter signup
    if (formData['form-name'] === 'newsletter') {
      const email = formData.email;
      
      // ConvertKit API configuration - using the correct API key and form ID
      const CONVERTKIT_API_KEY = process.env.CONVERTKIT_API_KEY; // This should be your API key: fOXIWSd2iJSoabovGKfSSQ
      const CONVERTKIT_FORM_ID = process.env.CONVERTKIT_FORM_ID; // This should be: 8464835
      
      if (!CONVERTKIT_API_KEY || !CONVERTKIT_FORM_ID) {
        console.error('ConvertKit configuration missing');
        return {
          statusCode: 500,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ error: 'Server configuration error' })
        };
      }
      
      // Add subscriber to ConvertKit
      const response = await fetch(`https://api.convertkit.com/v3/forms/${CONVERTKIT_FORM_ID}/subscribe`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          api_key: CONVERTKIT_API_KEY,
          email: email,
          first_name: '',
          fields: {
            source: 'website_newsletter'
          }
        })
      });
      
      console.log('ConvertKit API URL:', `https://api.convertkit.com/v3/forms/${CONVERTKIT_FORM_ID}/subscribe`);
      console.log('ConvertKit API Key length:', CONVERTKIT_API_KEY ? CONVERTKIT_API_KEY.length : 0);
      console.log('ConvertKit Form ID:', CONVERTKIT_FORM_ID);
      
      const result = await response.json();
      
      if (response.ok) {
        console.log('✅ Subscriber added to ConvertKit:', email);
        return {
          statusCode: 200,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ 
            success: true, 
            message: 'Subscriber added successfully',
            subscriber: result
          })
        };
      } else {
        console.error('❌ ConvertKit API error:', result);
        return {
          statusCode: 400,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ 
            error: 'Failed to add subscriber',
            details: result 
          })
        };
      }
    }
    
    // For contact form submissions, just log them
    if (formData['form-name'] === 'contact') {
      console.log('Contact form submission:', {
        name: formData.name,
        email: formData.email,
        subject: formData.subject,
        message: formData.message
      });
      
      return {
        statusCode: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          success: true, 
          message: 'Contact form submitted successfully' 
        })
      };
    }
    
    return {
      statusCode: 400,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ error: 'Unknown form type' })
    };
    
  } catch (error) {
    console.error('Function error:', error);
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ error: 'Internal server error' })
    };
  }
};
