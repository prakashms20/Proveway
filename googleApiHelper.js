const fs = require('fs');
const { google } = require('googleapis');
const { authenticateGoogleOAuth2, oauth2Client  } = require('./authMiddleware');
const auth  = require('./credentials.json');
const axios = require('axios');


let downloadProgress = 0;
let uploadProgress = 0;

const drive = google.drive({ version: 'v3', auth: oauth2Client });

// Function to download a large file in chunks
function downloadFileFromDrive(fileId, destination, onProgress) {
  return new Promise((resolve, reject) => {
    const dest = fs.createWriteStream(destination);

    drive.files.get({ fileId: fileId, alt: 'media' }, { responseType: 'stream' }, (err, res) => {
      if (err) {
        reject(err);
      }
      console.log(res);
      res.data
        .on('end', () => {
          resolve(destination);
        })
        .on('error', err => {
          reject(err);
        })
        .on('data', chunk => {
          downloadProgress += chunk.length;
          onProgress('download', downloadProgress);
        })
        .pipe(dest);
    });
  });
}

// Function to upload file to Google Drive in chunks
async function uploadFileToDrive(file, destinationFolderId, onProgress) {
    const filePath = 'downloaded_video.mp4'; // Path to your video file
    const fileSize = fs.statSync(filePath).size;
    const chunkSize = 2 * 1024 * 1024; // 2 MB chunk size
  
    const fileMetadata = {
      name: 'uploaded_video.mp4', // Change this to the name of your file
    };
    console.log('fileSize', fileSize);
    console.log('chunkSize', chunkSize);
    // Initiate resumable upload session
    const res = await drive.files.create({
      resource: fileMetadata,
      media: { mimeType: 'video/mp4' },
      fields: 'id, name, mimeType, size, webContentLink',
    });
  
    const fileId = res.data.id;
    const uploadUrl = `https://www.googleapis.com/upload/drive/v3/files/${fileId}?uploadType=resumable`;

    let currentByte = 0;
  
    // Upload chunks of the file
    while (currentByte < fileSize) {
      const endByte = Math.min(currentByte + chunkSize, fileSize);
      const chunk = fs.createReadStream(filePath, { start: currentByte, end: endByte - 1 });
      try{
        const axiosRes = await axios.put(uploadUrl, chunk, {
            headers: {
            'Content-Range': `bytes ${currentByte}-${endByte - 1}/${fileSize}`,
            'Content-Length': endByte - currentByte,
            'Content-Type': 'video/mp4',
            },
        });
        }catch(error){
            console.log({error})
        }
        console.log(`Uploaded bytes ${currentByte}-${endByte - 1} of ${fileSize}`);
        currentByte = endByte;

        onProgress('upload', currentByte);
    }
  
    console.log('File upload complete');

  }  
  

module.exports = { downloadFileFromDrive, uploadFileToDrive }