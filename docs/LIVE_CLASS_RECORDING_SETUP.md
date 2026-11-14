# Live class recording setup

SATSharks records the screen selected by the teacher in Chrome or Edge. The browser mixes the teacher microphone with any screen or tab audio the browser allows, then continuously uploads WebM chunks through the Railway backend into one Google Drive file. Google Cloud Storage and LiveKit Egress are not used.

## Backend environment

Set these values on the Railway backend service:

```dotenv
GOOGLE_DRIVE_CLIENT_ID=your-oauth-client-id.apps.googleusercontent.com
GOOGLE_DRIVE_CLIENT_SECRET=your-oauth-client-secret
GOOGLE_DRIVE_FOLDER_ID=https://drive.google.com/drive/folders/your-folder-id
GOOGLE_DRIVE_REDIRECT_URI=https://YOUR-BACKEND/api/integrations/google-drive/callback
```

The folder value can be either a folder ID or a complete Drive folder URL. Never put the client secret in frontend variables or source control.

In the Google OAuth web client, add `GOOGLE_DRIVE_REDIRECT_URI` as an exact authorized redirect URI and enable the Google Drive API for the project.

## One-time administrator connection

After deploying the backend and frontend:

1. Sign in to SATSharks as an administrator.
2. Open **Admin Settings > Google Drive**.
3. Click **Connect Google Drive**.
4. Sign in with the Google account that owns or can edit the configured folder and approve access.

Only one administrator performs this connection. Both assigned teachers and administrators can then record their live classes. The refresh authorization is encrypted before it is stored in MongoDB.

## Teacher workflow

1. Start the live class and click **Record**.
2. Choose **Entire screen**, a window, or a browser tab. Enable **Share system audio** or **Share tab audio** when the browser offers it.
3. Keep the classroom tab and laptop awake while recording. Uploading happens throughout the class, so there is no separate two-hour upload at the end.
4. Click **Stop recording** and wait until the recording reaches `READY` before ending or leaving the class.

Closing the browser, shutting down the laptop, losing the network for too long, or revoking Google access can leave an unfinished session. Another teacher/admin can discard a stale session from the classroom and begin again; an incomplete Drive upload is never published to students.

## Recorded Lectures library

When the final chunk reaches Drive, the recording appears automatically in **Recorded Lectures**. Students and teachers play it through the SATSharks video player; the backend proxies the Drive media with byte-range support, so the viewer is not redirected to Google Drive.

References: [Google OAuth web-server flow](https://developers.google.com/identity/protocols/oauth2/web-server), [Drive resumable uploads](https://developers.google.com/workspace/drive/api/guides/manage-uploads), and [Drive API scopes](https://developers.google.com/workspace/drive/api/guides/api-specific-auth).
