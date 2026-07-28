import { Request, Response, NextFunction } from "express";
import StudyMaterial from "../models/StudyMaterial";
import fs from "fs";
import path from "path";

export const getStudyMaterials = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const materials = await StudyMaterial.find()
      .populate("uploadedBy", "name email")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      materials,
    });
  } catch (error) {
    next(error);
  }
};

export const uploadStudyMaterial = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { title, description } = req.body;
    const file = req.file;

    if (!title) {
      return res.status(400).json({ success: false, error: "Title is required" });
    }

    if (!file) {
      return res.status(400).json({ success: false, error: "PDF file is required" });
    }

    const fileUrl = `/uploads/${file.filename}`;

    const newMaterial = await StudyMaterial.create({
      title,
      description,
      fileUrl,
      fileName: file.originalname,
      fileSize: file.size,
      uploadedBy: (req as any).user.userId,
    });

    return res.status(201).json({
      success: true,
      material: newMaterial,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteStudyMaterial = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const material = await StudyMaterial.findById(id);
    if (!material) {
      return res.status(404).json({ success: false, error: "Study material not found" });
    }

    // Try to delete physical file
    const filePath = path.resolve(__dirname, "../../", material.fileUrl.replace(/^\//, ""));
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    await StudyMaterial.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: "Study material deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
