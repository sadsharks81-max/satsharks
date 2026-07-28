import { Request, Response } from "express";
import SuccessStory from "../models/SuccessStory";
import { env } from "../config/env";
import { phaseOneSuccessStories } from "../data/phaseOne";

export const getSuccessStories = async (req: Request, res: Response) => {
  try {
    const { category } = req.query;
    if (!env.isDatabaseConfigured) {
      const filtered = category
        ? phaseOneSuccessStories.filter((s: any) => s.category === category)
        : phaseOneSuccessStories;
      return res.status(200).json({ success: true, stories: filtered });
    }

    const filter: any = {};
    if (category) {
      filter.category = category;
    }

    const stories = await SuccessStory.find(filter).sort({ createdAt: -1 });
    res.status(200).json({ success: true, stories });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const createSuccessStory = async (req: Request, res: Response) => {
  try {
    const { name, score, quote, university, imageUrl, videoUrl, category } = req.body;

    if (!env.isDatabaseConfigured && env.allowMockAuth) {
      return res.status(201).json({ success: true, message: "Success story created (mock)" });
    }

    if (!env.isDatabaseConfigured) {
      return res.status(503).json({ success: false, error: "Database is not configured" });
    }

    const story = await SuccessStory.create({
      name,
      score,
      quote,
      university,
      imageUrl,
      videoUrl,
      category: category || "SAT",
    });
    res.status(201).json({ success: true, story });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const updateSuccessStory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, score, quote, university, imageUrl, videoUrl, category } = req.body;

    if (!env.isDatabaseConfigured && env.allowMockAuth) {
      return res.status(200).json({ success: true, message: "Success story updated (mock)" });
    }

    if (!env.isDatabaseConfigured) {
      return res.status(503).json({ success: false, error: "Database is not configured" });
    }

    const story = await SuccessStory.findByIdAndUpdate(
      id,
      { name, score, quote, university, imageUrl, videoUrl, category },
      { new: true, runValidators: true }
    );

    if (!story) {
      return res.status(404).json({ success: false, error: "Story not found" });
    }

    res.status(200).json({ success: true, story });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};


export const deleteSuccessStory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!process.env.DATABASE_URL) {
      return res.status(200).json({ success: true, message: "Success story deleted (mock)" });
    }

    const story = await SuccessStory.findByIdAndDelete(id);
    if (!story) return res.status(404).json({ success: false, error: "Story not found" });

    res.status(200).json({ success: true, message: "Story deleted" });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// --- Featured Hero Student Showcase ---
import HeroFeature from "../models/HeroFeature";

let mockHeroFeature = {
  studentName: "Admitted Student",
  university: "Stanford University '28",
  score: "1580",
  improvement: "+210 Improvement",
  tag: "Top 1% Worldwide",
  imageUrl: ""
};

export const getHeroFeature = async (req: Request, res: Response) => {
  try {
    if (!env.isDatabaseConfigured) {
      return res.status(200).json({ success: true, feature: mockHeroFeature });
    }

    const feature = await HeroFeature.findOne();
    if (!feature) {
      return res.status(200).json({
        success: true,
        feature: {
          studentName: "Admitted Student",
          university: "Stanford University '28",
          score: "1580",
          improvement: "+210 Improvement",
          tag: "Top 1% Worldwide",
          imageUrl: ""
        }
      });
    }
    res.status(200).json({ success: true, feature });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const updateHeroFeature = async (req: Request, res: Response) => {
  try {
    const { studentName, university, score, improvement, tag, imageUrl } = req.body;

    if (!env.isDatabaseConfigured) {
      mockHeroFeature = {
        studentName: studentName ?? mockHeroFeature.studentName,
        university: university ?? mockHeroFeature.university,
        score: score ?? mockHeroFeature.score,
        improvement: improvement ?? mockHeroFeature.improvement,
        tag: tag ?? mockHeroFeature.tag,
        imageUrl: imageUrl !== undefined ? imageUrl : mockHeroFeature.imageUrl
      };
      return res.status(200).json({ success: true, feature: mockHeroFeature });
    }

    let feature = await HeroFeature.findOne();
    if (!feature) {
      feature = await HeroFeature.create({
        studentName,
        university,
        score,
        improvement,
        tag,
        imageUrl
      });
    } else {
      feature.studentName = studentName ?? feature.studentName;
      feature.university = university ?? feature.university;
      feature.score = score ?? feature.score;
      feature.improvement = improvement ?? feature.improvement;
      feature.tag = tag ?? feature.tag;
      feature.imageUrl = imageUrl !== undefined ? imageUrl : feature.imageUrl;
      await feature.save();
    }

    res.status(200).json({ success: true, feature });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};
