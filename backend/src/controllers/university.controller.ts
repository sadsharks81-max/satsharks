import { Request, Response } from "express";
import University from "../models/University";
import { sendError } from "../utils/http";

export const getAllUniversities = async (req: Request, res: Response) => {
  try {
    // Public, unauthenticated endpoint: lean() avoids hydrating full Mongoose
    // documents for a payload that is only ever serialised straight to JSON.
    const universities = await University.find().lean();
    return res.status(200).json({ success: true, data: universities });
  } catch (error: any) {
    console.error("Get All Universities Error:", error);
    return res.status(500).json({ success: false, error: "Server Error" });
  }
};

export const syncUniversities = async (req: Request, res: Response) => {
  try {
    const { universities, sheetName = "General" } = req.body;

    if (!Array.isArray(universities)) {
      return res.status(400).json({ success: false, error: "Invalid data format. Expected an array of universities." });
    }

    // Clear existing universities matching this sheetName
    await University.deleteMany({ sheetName });

    // Map each university to include sheetName
    const universitiesWithSheet = universities.map((u) => ({
      ...u,
      sheetName,
    }));

    // Insert new universities
    const inserted = await University.insertMany(universitiesWithSheet);

    return res.status(200).json({ success: true, data: inserted, message: `Universities synced successfully for sheet "${sheetName}".` });
  } catch (error) {
    // `details: error.errors` exposed Mongoose's internal validation tree
    // (schema paths, cast failures) to the caller.
    return sendError(res, error, "university.syncUniversities");
  }
};
