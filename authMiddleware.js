const { google } = require('googleapis');
const fs = require('fs');



// Create OAuth2 client
const oauth2Client = new google.auth.OAuth2(
  process.env.client_id,
  process.env.client_secret,
  process.env.redirect_uris // Assuming the redirect_uris is an array, use the first one
);

// Load credentials if available
try {
  const tokens = fs.readFileSync("credentials.json");
  oauth2Client.setCredentials(JSON.parse(tokens));
} catch (err) {
  console.log("No credentials found");
}

// Middleware for Google OAuth2 authentication
const authenticateGoogleOAuth2 = (req, res, next) => {
  // Check if OAuth2 tokens are already available
  if (oauth2Client.credentials) {
    next();
  } else {
    const url = oauth2Client.generateAuthUrl({
      access_type: "offline",
      scope: [
          "https://www.googleapis.com/auth/userinfo.profile",
          "https://www.googleapis.com/auth/drive",
      ],
    });
    res.redirect(url);
  }
};

// Handle Google OAuth2 callback
const handleGoogleOAuth2Callback = async (req, res, next) => {
  try {
    const { code } = req.query;
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);
    fs.writeFileSync("credentials.json", JSON.stringify(tokens));
    next();
  } catch (error) {
    console.error("Error handling Google OAuth2 callback:", error);
    res.status(500).send("Error handling Google OAuth2 callback");
  }
};

module.exports = { authenticateGoogleOAuth2, handleGoogleOAuth2Callback, oauth2Client  };
