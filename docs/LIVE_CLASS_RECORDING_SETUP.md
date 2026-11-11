# Live class recording setup

The classroom now starts a LiveKit room-composite MP4 recording automatically when a class becomes `LIVE`. Teachers and admins can also start or stop it from the classroom toolbar. LiveKit writes the MP4 to a temporary Google Cloud Storage bucket; when the signed `egress_ended` webhook arrives, the backend streams the file into Google Drive and removes the staging object.

## Required Google resources

1. Create a Google Cloud Storage bucket for temporary recording files.
2. Create a Google service account and grant it narrowly scoped object create/read/delete access to that bucket.
3. Use a folder inside a **Google Shared Drive** as the final destination. Add the service-account email as a member with permission to add files.

Google service accounts do not have personal Drive storage quota, so a folder in an individual's My Drive is not a reliable destination. A Shared Drive owns the uploaded recordings.

## Backend environment

Set these values in the backend deployment (never commit the real key):

```dotenv
GOOGLE_SERVICE_ACCOUNT_EMAIL=recordings@your-project.iam.gserviceaccount.com
GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
RECORDING_GCP_BUCKET=your-livekit-recordings-staging-bucket
RECORDING_DRIVE_FOLDER_ID=https://drive.google.com/drive/folders/your-folder-id
```

`RECORDING_DRIVE_FOLDER_ID` accepts either the folder ID or the complete Drive folder URL supplied by the client.

The existing LiveKit values are also required:

```dotenv
LIVEKIT_URL=wss://your-project.livekit.cloud
LIVEKIT_API_KEY=your-livekit-api-key
LIVEKIT_API_SECRET=your-livekit-api-secret
```

## LiveKit webhook

Configure the LiveKit project webhook to send signed events to:

```text
https://YOUR-BACKEND/api/live-classes/webhook
```

The same endpoint already handles attendance. Recording delivery uses `egress_started` and `egress_ended` events. A recording moves through `STARTING`, `ACTIVE`, `PROCESSING`, and `READY`; transfer errors are stored as `FAILED` and can be retried by starting another recording while the class is live.

## Recorded Lectures library

When a recording reaches `READY`, it appears automatically in the **Recorded Lectures** tab for students and admins. Teachers see recordings for the classes assigned to them. The browser requests a short-lived playback session and streams the MP4 through the SATSharks backend with byte-range support, so viewers stay inside the SATSharks player and never receive a Google Drive page link.

Until at least one recording reaches `READY`, each dashboard shows the empty state **No recorded lectures yet**.

References: [LiveKit egress outputs](https://docs.livekit.io/transport/media/ingress-egress/egress/outputs/), [LiveKit room composite recording](https://docs.livekit.io/transport/media/ingress-egress/egress/room-composite/), and [Google Shared Drives](https://developers.google.com/workspace/drive/api/guides/about-shareddrives).
