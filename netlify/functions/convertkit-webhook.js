const fetch = require('node-fetch');

exports.handler = async (event, context) => {
  // Only handle POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    // Parse the form data
    const formData = JSON.parse(event.body);
    
    // Check if this is a newsletter signup
    if (formData['form-name'] === 'newsletter') {
      const email = formData.email;
      
      // ConvertKit API configuration
      const CONVERTKIT_API_KEY = process.env.CONVERTKIT_API_KEY;
      const CONVERTKIT_FORM_ID = process.env.CONVERTKIT_FORM_ID;
      
      if (!CONVERTKIT_API_KEY || !CONVERTKIT_FORM_ID) {
        console.error('ConvertKit configuration missing');
        return {
          statusCode: 500,
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
          first_name: '', // Optional: you can add a name field to your form
          fields: {
            source: 'website_newsletter'
          }
        })
      });
      
      const result = await response.json();
      
      if (response.ok) {
        console.log('Subscriber added to ConvertKit:', email);
        return {
          statusCode: 200,
          body: JSON.stringify({ 
            success: true, 
            message: 'Subscriber added successfully' 
          })
        };
      } else {
        console.error('ConvertKit API error:', result);
        return {
          statusCode: 400,
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
        body: JSON.stringify({ 
          success: true, 
          message: 'Contact form submitted successfully' 
        })
      };
    }
    
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Unknown form type' })
    };
    
  } catch (error) {
    console.error('Function error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal server error' })
    };
  }
};
