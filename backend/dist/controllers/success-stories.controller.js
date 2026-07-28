"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateHeroFeature = exports.getHeroFeature = exports.deleteSuccessStory = exports.updateSuccessStory = exports.createSuccessStory = exports.getSuccessStories = void 0;
const SuccessStory_1 = __importDefault(require("../models/SuccessStory"));
const env_1 = require("../config/env");
const phaseOne_1 = require("../data/phaseOne");
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
        const stories = await SuccessStory_1.default.find(filter).sort({ createdAt: -1 });
        res.status(200).json({ success: true, stories });
    }
    catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};
exports.getSuccessStories = getSuccessStories;
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
        const story = await SuccessStory_1.default.findByIdAndUpdate(id, { name, score, quote, university, imageUrl, videoUrl, category }, { new: true, runValidators: true });
        if (!story) {
            return res.status(404).json({ success: false, error: "Story not found" });
        }
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
        res.status(200).json({ success: true, feature });
    }
    catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};
exports.getHeroFeature = getHeroFeature;
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
        res.status(200).json({ success: true, feature });
    }
    catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};
exports.updateHeroFeature = updateHeroFeature;
