"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateHeroFeature = exports.getHomepageSuccessContent = exports.getHeroFeatureImage = exports.getHeroFeature = exports.deleteSuccessStory = exports.updateSuccessStory = exports.createSuccessStory = exports.getSuccessStoryImage = exports.getSuccessStories = void 0;
const SuccessStory_1 = __importDefault(require("../models/SuccessStory"));
const env_1 = require("../config/env");
const phaseOne_1 = require("../data/phaseOne");
const managed_image_1 = require("../utils/managed-image");
const publicImageUrl = (story) => {
    if (!story.imageUrl?.startsWith("data:"))
        return story.imageUrl;
    const version = story.updatedAt ? new Date(story.updatedAt).getTime() : Date.now();
    return `/api/success-stories/image/${story._id}?v=${version}`;
};
const serializeStory = (story) => {
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
const sendDataImage = (res, dataUrl) => {
    const match = dataUrl?.match(/^data:(image\/[\w.+-]+);base64,(.+)$/);
    if (!match)
        return res.status(404).end();
    res.setHeader("Content-Type", match[1]);
    res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
    return res.send(Buffer.from(match[2], "base64"));
};
const getSuccessStories = async (req, res) => {
    try {
        const { category } = req.query;
        if (!env_1.env.isDatabaseConfigured) {
            const filtered = category
                ? phaseOne_1.phaseOneSuccessStories.filter((s) => s.category === category)
                : phaseOne_1.phaseOneSuccessStories;
            return res.status(200).json({ success: true, stories: filtered });
        }
        const filter = {};
        if (category) {
            filter.category = category;
        }
        const stories = await SuccessStory_1.default.aggregate([
            { $match: filter },
            { $sort: { createdAt: -1 } },
            { $project: lightweightStoryProjection },
        ]);
        res.setHeader("Cache-Control", "public, max-age=30, s-maxage=300, stale-while-revalidate=600");
        res.status(200).json({ success: true, stories: stories.map(serializeStory) });
    }
    catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};
exports.getSuccessStories = getSuccessStories;
const getSuccessStoryImage = async (req, res) => {
    try {
        if (!env_1.env.isDatabaseConfigured)
            return res.status(404).end();
        const story = await SuccessStory_1.default.findById(req.params.id).select("imageUrl").lean();
        return sendDataImage(res, story?.imageUrl);
    }
    catch {
        return res.status(404).end();
    }
};
exports.getSuccessStoryImage = getSuccessStoryImage;
const createSuccessStory = async (req, res) => {
    try {
        const { name, score, quote, university, imageUrl, videoUrl, category } = req.body;
        if (!env_1.env.isDatabaseConfigured && env_1.env.allowMockAuth) {
            return res.status(201).json({ success: true, message: "Success story created (mock)" });
        }
        if (!env_1.env.isDatabaseConfigured) {
            return res.status(503).json({ success: false, error: "Database is not configured" });
        }
        const story = await SuccessStory_1.default.create({
            name,
            score,
            quote,
            university,
            imageUrl,
            videoUrl,
            category: category || "SAT",
        });
        res.status(201).json({ success: true, story });
    }
    catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};
exports.createSuccessStory = createSuccessStory;
const updateSuccessStory = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, score, quote, university, imageUrl, videoUrl, category } = req.body;
        if (!env_1.env.isDatabaseConfigured && env_1.env.allowMockAuth) {
            return res.status(200).json({ success: true, message: "Success story updated (mock)" });
        }
        if (!env_1.env.isDatabaseConfigured) {
            return res.status(503).json({ success: false, error: "Database is not configured" });
        }
        const story = await SuccessStory_1.default.findById(id);
        if (!story) {
            return res.status(404).json({ success: false, error: "Story not found" });
        }
        const previousImageUrl = story.imageUrl;
        Object.assign(story, { name, score, quote, university, imageUrl, videoUrl, category });
        await story.save();
        await (0, managed_image_1.deleteReplacedManagedImage)(previousImageUrl, story.imageUrl);
        res.status(200).json({ success: true, story });
    }
    catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};
exports.updateSuccessStory = updateSuccessStory;
const deleteSuccessStory = async (req, res) => {
    try {
        const { id } = req.params;
        if (!process.env.DATABASE_URL) {
            return res.status(200).json({ success: true, message: "Success story deleted (mock)" });
        }
        const story = await SuccessStory_1.default.findByIdAndDelete(id);
        if (!story)
            return res.status(404).json({ success: false, error: "Story not found" });
        await (0, managed_image_1.deleteManagedImage)(story.imageUrl);
        res.status(200).json({ success: true, message: "Story deleted" });
    }
    catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};
exports.deleteSuccessStory = deleteSuccessStory;
// --- Featured Hero Student Showcase ---
const HeroFeature_1 = __importDefault(require("../models/HeroFeature"));
let mockHeroFeature = {
    studentName: "Admitted Student",
    university: "Stanford University '28",
    score: "1580",
    improvement: "+210 Improvement",
    tag: "Top 1% Worldwide",
    imageUrl: ""
};
const getHeroFeature = async (req, res) => {
    try {
        if (!env_1.env.isDatabaseConfigured) {
            return res.status(200).json({ success: true, feature: mockHeroFeature });
        }
        const feature = await HeroFeature_1.default.findOne();
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
    }
    catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};
exports.getHeroFeature = getHeroFeature;
const getHeroFeatureImage = async (_req, res) => {
    try {
        if (!env_1.env.isDatabaseConfigured)
            return res.status(404).end();
        const feature = await HeroFeature_1.default.findOne().select("imageUrl").lean();
        return sendDataImage(res, feature?.imageUrl);
    }
    catch {
        return res.status(404).end();
    }
};
exports.getHeroFeatureImage = getHeroFeatureImage;
const getHomepageSuccessContent = async (_req, res) => {
    try {
        if (!env_1.env.isDatabaseConfigured) {
            return res.status(200).json({
                success: true,
                feature: mockHeroFeature,
                stories: phaseOne_1.phaseOneSuccessStories.slice(0, 3),
            });
        }
        const [feature, stories] = await Promise.all([
            HeroFeature_1.default.findOne().lean(),
            SuccessStory_1.default.aggregate([
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
    }
    catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
};
exports.getHomepageSuccessContent = getHomepageSuccessContent;
const updateHeroFeature = async (req, res) => {
    try {
        const { studentName, university, score, improvement, tag, imageUrl } = req.body;
        if (!env_1.env.isDatabaseConfigured) {
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
        let feature = await HeroFeature_1.default.findOne();
        const previousImageUrl = feature?.imageUrl;
        if (!feature) {
            feature = await HeroFeature_1.default.create({
                studentName,
                university,
                score,
                improvement,
                tag,
                imageUrl
            });
        }
        else {
            feature.studentName = studentName ?? feature.studentName;
            feature.university = university ?? feature.university;
            feature.score = score ?? feature.score;
            feature.improvement = improvement ?? feature.improvement;
            feature.tag = tag ?? feature.tag;
            feature.imageUrl = imageUrl !== undefined ? imageUrl : feature.imageUrl;
            await feature.save();
        }
        await (0, managed_image_1.deleteReplacedManagedImage)(previousImageUrl, feature.imageUrl);
        res.status(200).json({ success: true, feature });
    }
    catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};
exports.updateHeroFeature = updateHeroFeature;
