require('dotenv').config();
const express = require('express');
const fs = require('fs');
const { google } = require('googleapis');
const multer = require('multer');
const axios = require('axios');
const { authenticateGoogleOAuth2, handleGoogleOAuth2Callback, oauth2Client  } = require('./authMiddleware');
const {downloadFileFromDrive, uploadFileToDrive } = require('./googleApiHelper')



const app = express();
const port = process.env.PORT || 3000;
const GOOGLE_API_URL = process.env.GOOGLE_API_URL;

let downloadProgress = 0;
let uploadProgress = 0;

const downloadFileId = '10SajxUsPeGuQOeR2WOChgKuJEAteGpFZ';
const uploadFileId = '1tg1roZjQMk6XwvX1MtsVhHWrHmmaq0fO';


// Middleware for Google OAuth2 authentication
app.use(authenticateGoogleOAuth2);


// Google callback endpoint
app.get("/google/redirect", handleGoogleOAuth2Callback, async (req,res) => {
    res.send("Success");
});

app.get("/auth/google", (req, res) =>{
    // Redirect users to Google's authentication page
    const url = oauth2Client.generateAuthUrl({
        access_type: "offline",
        scope: [
            GOOGLE_API_URL+"/userinfo.profile",
            GOOGLE_API_URL+"/drive",
        ],
    });
    res.redirect(url);
});

// Monitor endpoint
app.get('/monitor', authenticateGoogleOAuth2, (req, res) => {
  res.json({ downloadProgress, uploadProgress });
});

// Process endpoint
app.get('/process-video', async (req, res) => {
  try {
    downloadProgress = 0;
    uploadProgress = 0;

    // Download file from Google Drive
    await downloadFileFromDrive( downloadFileId, 'downloaded_video.mp4', (type, progress) => {
      // Update progress
      if (type === 'download') {
        downloadProgress = progress;
      }
    });

    // Upload file to another Google Drive directory
    await uploadFileToDrive( 'downloaded_video.mp4', uploadFileId, (type, progress) => {
      // Update progress
      if (type === 'upload') {
        uploadProgress = progress;
      }
    });

    res.send('Process completed successfully.');
  } catch (error) {
    res.status(500).send('Error processing the file: ' + error.message);
  }
});
  

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
