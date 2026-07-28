import { google } from "googleapis";

// Environment variables
const clientEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
// Decode the private key properly, replacing literal escaped newlines with actual newlines
const privateKey = process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY
  ? process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY.replace(/\\n/g, "\n")
  : undefined;

const spreadsheetId = "12frsk436gGwObd-hmmxyUCPW6eeibXUYRYZ0oBdzteM";

/**
 * Syncs the essay submission to Google Sheets backup.
 * Columns:
 * - A: Student Name
 * - B: Student Email
 * - C: Essay Text
 */
export const appendEssayToSheet = async (
  studentName: string,
  studentEmail: string,
  essayText: string
): Promise<void> => {
  if (!clientEmail || !privateKey) {
    console.warn("[Google Sheets Sync] Credentials not set in environment variables. Skipping sync.");
    return;
  }

  try {
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: clientEmail,
        private_key: privateKey,
      },
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });

    const sheets = google.sheets({ version: "v4", auth });

    // Append to "Sheet1" in columns A, B, C
    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: "Sheet1!A:C",
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [[studentName, studentEmail, essayText || "N/A"]],
      },
    });

    console.log(`[Google Sheets Sync] Successfully backed up essay for ${studentEmail}`);
  } catch (error) {
    console.error("[Google Sheets Sync] Error appending to spreadsheet:", error);
  }
};
