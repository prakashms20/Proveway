# Proveway - Video Upload to Google Drive
This is a Node.js application designed to facilitate the upload of large video files to Google Drive in manageable chunks. Leveraging the Google Drive API for file management and Axios for HTTP requests, this tool simplifies the process of handling and transferring video content to Google Drive.

# Prerequisites
Before starting a project on Video Upload to Google Drive, ensure the following prerequisites are met:
1. Node.js: Install Node.js on your system.
2. NPM (Node Package Manager): Ensure NPM is available.
3. Google Cloud Account: Create a Google Cloud account to access the Google Drive API.
4. Cloned Repository: Clone this repository to your local machine.
5. Dependencies: Navigate to the project directory and install dependencies using npm.
   
# How to Configure Google Drive API
1. Create a Project: Begin by creating a project in the Google Cloud Console.
2. Enable Google Drive API: Enable the Google Drive API for your project.
3. Create OAuth 2.0 Credentials: Generate OAuth 2.0 credentials (client ID and client secret) to authenticate your Node.js application and gain access to Google Drive files.
4. Install Necessary Packages: Install the required packages for handling authentication and interacting with the Google Drive API. This project utilizes the googleapis library for Node.js.
5. Obtain API Credentials: Follow the instructions provided in the googleApiHelper.js file to obtain Google Drive API credentials.
   
# How to Authenticate Google API using OAuth2

Run the application using the following command:
node index.js
Navigate to the /auth/google endpoint in your web browser. Grant access to the Google Cloud when prompted. Upon successful authentication, the Node.js application creates a credential file containing the API key in JSON format. Refer to authmiddleware.js for more details.

# How to Download and Upload Videos
1. Download Video: Hit the /process-video endpoint to initiate the download of a video file. The file will be saved in the root directory of the project.
2. Upload Video: Upon completion of the download process, the application will split the video file into chunks and upload them to Google Drive. Progress updates are displayed in the console. Monitor the status of upload and download by accessing the /monitor endpoint.

# Configuration
Adjustments to the chunk size and other parameters can be made in the index.js file according to your preferences and requirements.

# Support
For any inquiries or support, please contact iammsprakash@gmail.com.

# License
This project is licensed under the MIT License. See the LICENSE file for details.

