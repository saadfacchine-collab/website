// netlify/functions/convertkit-webhook-alt.js
var https = require("https");
exports.handler = async (event, context) => {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method not allowed" })
    };
  }
  try {
    console.log("Event body:", event.body);
    console.log("Content-Type:", event.headers["content-type"]);
    let formData;
    if (event.headers["content-type"] && event.headers["content-type"].includes("application/json")) {
      formData = JSON.parse(event.body);
    } else {
      const params = new URLSearchParams(event.body);
      formData = {};
      for (const [key, value] of params) {
        formData[key] = value;
      }
    }
    console.log("Parsed form data:", formData);
    if (formData["form-name"] === "newsletter") {
      const email = formData.email;
      const CONVERTKIT_API_KEY = process.env.CONVERTKIT_API_KEY;
      const CONVERTKIT_FORM_ID = process.env.CONVERTKIT_FORM_ID;
      if (!CONVERTKIT_API_KEY || !CONVERTKIT_FORM_ID) {
        console.error("ConvertKit configuration missing");
        return {
          statusCode: 500,
          body: JSON.stringify({ error: "Server configuration error" })
        };
      }
      const postData = JSON.stringify({
        api_key: CONVERTKIT_API_KEY,
        email,
        first_name: "",
        fields: {
          source: "website_newsletter"
        }
      });
      const options = {
        hostname: "api.convertkit.com",
        port: 443,
        path: `/v3/forms/${CONVERTKIT_FORM_ID}/subscribe`,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Content-Length": Buffer.byteLength(postData)
        }
      };
      return new Promise((resolve, reject) => {
        const req = https.request(options, (res) => {
          let data = "";
          res.on("data", (chunk) => {
            data += chunk;
          });
          res.on("end", () => {
            try {
              const result = JSON.parse(data);
              if (res.statusCode >= 200 && res.statusCode < 300) {
                console.log("Subscriber added to ConvertKit:", email);
                resolve({
                  statusCode: 200,
                  body: JSON.stringify({
                    success: true,
                    message: "Subscriber added successfully"
                  })
                });
              } else {
                console.error("ConvertKit API error:", result);
                resolve({
                  statusCode: 400,
                  body: JSON.stringify({
                    error: "Failed to add subscriber",
                    details: result
                  })
                });
              }
            } catch (error) {
              console.error("Error parsing response:", error);
              resolve({
                statusCode: 500,
                body: JSON.stringify({ error: "Error parsing response" })
              });
            }
          });
        });
        req.on("error", (error) => {
          console.error("Request error:", error);
          resolve({
            statusCode: 500,
            body: JSON.stringify({ error: "Request failed" })
          });
        });
        req.write(postData);
        req.end();
      });
    }
    if (formData["form-name"] === "contact") {
      console.log("Contact form submission:", {
        name: formData.name,
        email: formData.email,
        subject: formData.subject,
        message: formData.message
      });
      return {
        statusCode: 200,
        body: JSON.stringify({
          success: true,
          message: "Contact form submitted successfully"
        })
      };
    }
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Unknown form type" })
    };
  } catch (error) {
    console.error("Function error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Internal server error" })
    };
  }
};
//# sourceMappingURL=convertkit-webhook-alt.js.map
