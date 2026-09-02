import { Request, Response, NextFunction } from "express";
import StudyMaterial from "../models/StudyMaterial";
import fs from "fs";
import path from "path";
import mongoose from "mongoose";
import { asFilterString, getPagination } from "../utils/query";

const GRIDFS_BUCKET = "studyMaterialFiles";

const getBucket = () => {
  if (!mongoose.connection.db) {
    throw new Error("Study-material storage is temporarily unavailable");
  }
  return new mongoose.mongo.GridFSBucket(mongoose.connection.db, { bucketName: GRIDFS_BUCKET });
};

const isPdf = (buffer: Buffer) => buffer.subarray(0, 5).toString("ascii") === "%PDF-";

export const getStudyMaterials = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // `?category[$ne]=x` previously reached the filter as a Mongo operator.
    const category = asFilterString(req.query.category);
    const filter = category ? { category } : {};
    const { limit, skip } = getPagination(req.query, 200, 500);
    const materials = await StudyMaterial.find(filter)
      .populate("uploadedBy", "name email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

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
    const { title, description, category } = req.body;
    const file = req.file;

    if (!title) {
      return res.status(400).json({ success: false, error: "Title is required" });
    }

    if (!file) {
      return res.status(400).json({ success: false, error: "PDF file is required" });
    }
    if (!["MATH", "READING_WRITING"].includes(category)) {
      return res.status(400).json({ success: false, error: "Choose Math or Reading & Writing." });
    }
    if (!file.buffer || !isPdf(file.buffer)) {
      return res.status(400).json({ success: false, error: "The uploaded file is not a valid PDF." });
    }

    const materialId = new mongoose.Types.ObjectId();
    const storageFileId = new mongoose.Types.ObjectId();
    const bucket = getBucket();
    const uploadStream = bucket.openUploadStreamWithId(storageFileId, file.originalname, {
      contentType: "application/pdf",
      metadata: { materialId: materialId.toString(), uploadedBy: (req as any).user.userId },
    });
    await new Promise<void>((resolve, reject) => {
      uploadStream.once("finish", resolve);
      uploadStream.once("error", reject);
      uploadStream.end(file.buffer);
    });

    let newMaterial;
    try {
      newMaterial = await StudyMaterial.create({
        _id: materialId,
        title,
        description,
        fileUrl: `/api/study-materials/${materialId}/file`,
        fileName: file.originalname,
        fileSize: file.size,
        storageFileId,
        category,
        uploadedBy: (req as any).user.userId,
      });
    } catch (error) {
      await bucket.delete(storageFileId).catch(() => undefined);
      throw error;
    }

    return res.status(201).json({
      success: true,
      material: newMaterial,
    });
  } catch (error) {
    next(error);
  }
};

export const streamStudyMaterial = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const material = await StudyMaterial.findById(req.params.id).select("+storageFileId");
    if (!material) {
      return res.status(404).json({ success: false, error: "Study material not found" });
    }

    const setPdfHeaders = () => {
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader("Content-Disposition", `inline; filename*=UTF-8''${encodeURIComponent(material.fileName)}`);
      res.setHeader("Cache-Control", "private, max-age=3600");
      res.setHeader("X-Content-Type-Options", "nosniff");
    };

    if (material.storageFileId) {
      const bucket = getBucket();
      const storedFile = await bucket.find({ _id: material.storageFileId }).next();
      if (!storedFile) {
        return res.status(404).json({ success: false, error: "The PDF file is missing. Please ask your teacher to upload it again." });
      }
      setPdfHeaders();
      res.setHeader("Content-Length", storedFile.length.toString());
      const download = bucket.openDownloadStream(material.storageFileId);
      download.once("error", next);
      return download.pipe(res);
    }

    // Backward compatibility for notes uploaded before GridFS storage existed.
    if (material.fileUrl.startsWith("/uploads/")) {
      const filePath = path.resolve(__dirname, "../../uploads", path.basename(material.fileUrl));
      if (fs.existsSync(filePath)) {
        setPdfHeaders();
        return res.sendFile(filePath);
      }
    }

    return res.status(404).json({
      success: false,
      error: "This older PDF is no longer on the server. Please ask your teacher to upload it again.",
    });
  } catch (error) {
    next(error);
  }
};

export const deleteStudyMaterial = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const material = await StudyMaterial.findById(id).select("+storageFileId");
    if (!material) {
      return res.status(404).json({ success: false, error: "Study material not found" });
    }

    if (material.storageFileId) {
      await getBucket().delete(material.storageFileId).catch((error: any) => {
        if (error?.code !== "ENOENT") throw error;
      });
    } else if (material.fileUrl.startsWith("/uploads/")) {
      const filePath = path.resolve(__dirname, "../../uploads", path.basename(material.fileUrl));
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
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
