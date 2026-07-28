"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAdminOverview = void 0;
const User_1 = __importDefault(require("../models/User"));
const Question_1 = __importDefault(require("../models/Question"));
const SATTest_1 = __importDefault(require("../models/SATTest"));
const SATTestAttempt_1 = __importDefault(require("../models/SATTestAttempt"));
const PracticeTestUpload_1 = __importDefault(require("../models/PracticeTestUpload"));
const Inquiry_1 = __importDefault(require("../models/Inquiry"));
const SuccessStory_1 = __importDefault(require("../models/SuccessStory"));
const getAdminOverview = async (req, res) => {
    try {
        const [totalUsers, paidUsers, totalQuestions, publishedQuestions, totalTests, activeTests, totalAttempts, pendingUploads, pendingInquiries, totalStories,] = await Promise.all([
            User_1.default.countDocuments(),
            User_1.default.countDocuments({ subscription: "PAID" }),
            Question_1.default.countDocuments(),
            Question_1.default.countDocuments({ status: "PUBLISHED" }),
            SATTest_1.default.countDocuments(),
            SATTest_1.default.countDocuments({ isActive: true }),
            SATTestAttempt_1.default.countDocuments({ status: "COMPLETED" }),
            PracticeTestUpload_1.default.countDocuments({ status: { $in: ["UPLOADED", "EXTRACTED"] } }),
            Inquiry_1.default.countDocuments({ status: "NEW" }),
            SuccessStory_1.default.countDocuments(),
        ]);
        res.status(200).json({
            success: true,
            overview: {
                totalUsers,
                paidUsers,
                totalQuestions,
                publishedQuestions,
                totalTests,
                activeTests,
                totalAttempts,
                pendingUploads,
                pendingInquiries,
                totalStories,
            },
        });
    }
    catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};
exports.getAdminOverview = getAdminOverview;
