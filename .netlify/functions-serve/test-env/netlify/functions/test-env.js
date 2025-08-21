// netlify/functions/test-env.js
exports.handler = async (event, context) => {
  return {
    statusCode: 200,
    body: JSON.stringify({
      message: "Environment variables test",
      hasApiKey: !!process.env.CONVERTKIT_API_KEY,
      hasFormId: !!process.env.CONVERTKIT_FORM_ID,
      apiKeyLength: process.env.CONVERTKIT_API_KEY ? process.env.CONVERTKIT_API_KEY.length : 0,
      formId: process.env.CONVERTKIT_FORM_ID || "not set"
    })
  };
};
//# sourceMappingURL=test-env.js.map
