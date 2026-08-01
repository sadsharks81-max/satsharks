import { Request, Response } from "express";
import SuccessStory from "../models/SuccessStory";
import { env } from "../config/env";
import { phaseOneSuccessStories } from "../data/phaseOne";
import { deleteManagedImage, deleteReplacedManagedImage } from "../utils/managed-image";

const publicImageUrl = (story: any) => {
  if (!story.imageUrl?.startsWith("data:")) return story.imageUrl;
  const version = story.updatedAt ? new Date(story.updatedAt).getTime() : Date.now();
  return `/api/success-stories/image/${story._id}?v=${version}`;
};

const serializeStory = (story: any) => {
  const value = typeof story.toObject === "function" ? story.toObject() : story;
  if (value.imageUrl === "__DATA_IMAGE__") {
    const version = value.updatedAt ? new Date(value.updatedAt).getTime() : Date.now();
    return { ...value, imageUrl: `/api/success-stories/image/${value._id}?v=${version}` };
  }
  return { ...value, imageUrl: publicImageUrl(value) };
};

const lightweightStoryProjection = {
  name: 1,
  score: 1,
  quote: 1,
  university: 1,
  videoUrl: 1,
  category: 1,
  createdAt: 1,
  updatedAt: 1,
  imageUrl: {
    $cond: [
      { $regexMatch: { input: { $ifNull: ["$imageUrl", ""] }, regex: /^data:/ } },
      "__DATA_IMAGE__",
      "$imageUrl",
    ],
  },
};

const sendDataImage = (res: Response, dataUrl?: string | null) => {
  const match = dataUrl?.match(/^data:(image\/[\w.+-]+);base64,(.+)$/);
  if (!match) return res.status(404).end();
  res.setHeader("Content-Type", match[1]);
  res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
  return res.send(Buffer.from(match[2], "base64"));
};

export const getSuccessStories = async (req: Request, res: Response) => {
  try {
    // Coerced to a primitive so an operator object cannot enter the filter.
    const category = asFilterString(req.query.category);
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

    const stories = await SuccessStory.aggregate([
      { $match: filter },
      { $sort: { createdAt: -1 } },
      { $project: lightweightStoryProjection },
    ]);
    res.setHeader("Cache-Control", "public, max-age=30, s-maxage=300, stale-while-revalidate=600");
    res.status(200).json({ success: true, stories: stories.map(serializeStory) });
  } catch (error) {
    sendError(res, error, "success-stories.getSuccessStories");
  }
};

export const getSuccessStoryImage = async (req: Request, res: Response) => {
  try {
    if (!env.isDatabaseConfigured) return res.status(404).end();
    const story = await SuccessStory.findById(req.params.id).select("imageUrl").lean();
    return sendDataImage(res, story?.imageUrl);
  } catch {
    return res.status(404).end();
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
  } catch (error) {
    sendError(res, error, "success-stories.createSuccessStory");
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

    const story = await SuccessStory.findById(id);
    if (!story) {
      return res.status(404).json({ success: false, error: "Story not found" });
    }
    const previousImageUrl = story.imageUrl;
    Object.assign(story, { name, score, quote, university, imageUrl, videoUrl, category });
    await story.save();
    await deleteReplacedManagedImage(previousImageUrl, story.imageUrl);

    res.status(200).json({ success: true, story });
  } catch (error) {
    sendError(res, error, "success-stories.updateSuccessStory");
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
    await deleteManagedImage(story.imageUrl);

    res.status(200).json({ success: true, message: "Story deleted" });
  } catch (error) {
    sendError(res, error, "success-stories.deleteSuccessStory");
  }
};

// --- Featured Hero Student Showcase ---
import HeroFeature from "../models/HeroFeature";
import { sendError } from "../utils/http";
import { asFilterString } from "../utils/query";

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
    const serialized = serializeStory(feature);
    if (feature.imageUrl?.startsWith("data:")) {
      serialized.imageUrl = `/api/success-stories/featured/image?v=${new Date(feature.updatedAt).getTime()}`;
    }
    res.setHeader("Cache-Control", "public, max-age=30, s-maxage=300, stale-while-revalidate=600");
    res.status(200).json({ success: true, feature: serialized });
  } catch (error) {
    sendError(res, error, "success-stories.getHeroFeature");
  }
};

export const getHeroFeatureImage = async (_req: Request, res: Response) => {
  try {
    if (!env.isDatabaseConfigured) return res.status(404).end();
    const feature = await HeroFeature.findOne().select("imageUrl").lean();
    return sendDataImage(res, feature?.imageUrl);
  } catch {
    return res.status(404).end();
  }
};

export const getHomepageSuccessContent = async (_req: Request, res: Response) => {
  try {
    if (!env.isDatabaseConfigured) {
      return res.status(200).json({
        success: true,
        feature: mockHeroFeature,
        stories: phaseOneSuccessStories.slice(0, 3),
      });
    }
    const [feature, stories] = await Promise.all([
      HeroFeature.findOne().lean(),
      SuccessStory.aggregate([
        { $sort: { createdAt: -1 } },
        { $limit: 3 },
        { $project: lightweightStoryProjection },
      ]),
    ]);
    const serializedFeature = feature ? serializeStory(feature) : mockHeroFeature;
    if (feature?.imageUrl?.startsWith("data:")) {
      serializedFeature.imageUrl = `/api/success-stories/featured/image?v=${new Date(feature.updatedAt).getTime()}`;
    }
    res.setHeader("Cache-Control", "public, max-age=30, s-maxage=300, stale-while-revalidate=600");
    return res.status(200).json({
      success: true,
      feature: serializedFeature,
      stories: stories.map(serializeStory),
    });
  } catch (error: any) {
    return sendError(res, error, "success-stories.getHomepageSuccessContent");
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
    const previousImageUrl = feature?.imageUrl;
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
    await deleteReplacedManagedImage(previousImageUrl, feature.imageUrl);

    res.status(200).json({ success: true, feature });
  } catch (error) {
    sendError(res, error, "success-stories.updateHeroFeature");
  }
};
