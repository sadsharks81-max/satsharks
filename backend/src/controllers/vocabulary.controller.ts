import { Response } from "express";
import mongoose from "mongoose";
import { AuthRequest } from "../middleware/auth.middleware";
import User from "../models/User";
import VocabularyProgress from "../models/VocabularyProgress";
import VocabularyWord from "../models/VocabularyWord";
import { seedVocabularyWords } from "../data/vocabularyWords";
import { sendError } from "../utils/http";

const POINTS_PER_CORRECT_ANSWER = 5;
const DAILY_VOCAB_POINTS_LIMIT = 100;
const stripEmojis = (value: string) => value
  .replace(/\p{Extended_Pictographic}(?:\uFE0F|\uFE0E)?/gu, "")
  .replace(/[\u{1F1E6}-\u{1F1FF}]{2}/gu, "")
  .replace(/[0-9#*]\uFE0F?\u20E3/gu, "")
  .replace(/\u200D/gu, "")
  .replace(/[ \t]{2,}/g, " ")
  .trim();

const dateKey = (date = new Date()) => date.toISOString().slice(0, 10);

const ensureVocabularySeeded = async () => {
  if ((await VocabularyWord.estimatedDocumentCount()) > 0) return;
  try {
    await VocabularyWord.insertMany(seedVocabularyWords, { ordered: false });
  } catch (error: any) {
    if (error?.code !== 11000 && !error?.writeErrors?.every((item: any) => item.code === 11000)) {
      throw error;
    }
  }
};

const serializeProgress = (progress: any, wordCount: number) => {
  const missedCounts = progress?.missedCounts
    ? Object.fromEntries(progress.missedCounts instanceof Map ? progress.missedCounts : Object.entries(progress.missedCounts))
    : {};
  const masteredWordIds = (progress?.masteredWords || []).map((id: any) => id.toString());
  const totalAttempts = progress?.totalAttempts || 0;
  const totalCorrect = progress?.totalCorrect || 0;

  return {
    masteredWordIds,
    missedCounts,
    masteredCount: masteredWordIds.length,
    wordCount,
    totalAttempts,
    totalCorrect,
    accuracy: totalAttempts > 0 ? Math.round((totalCorrect / totalAttempts) * 100) : 0,
    pointsAwardedToday: progress?.pointsDate === dateKey() ? progress.pointsAwardedToday || 0 : 0,
    dailyPointsLimit: DAILY_VOCAB_POINTS_LIMIT,
  };
};

export const getVocabularyGame = async (req: AuthRequest, res: Response) => {
  try {
    await ensureVocabularySeeded();
    const studentId = req.user?.userId;
    const [words, progress, user] = await Promise.all([
      VocabularyWord.find({ isActive: true }).sort({ frequency: -1, word: 1 }).lean(),
      VocabularyProgress.findOne({ student: studentId }).lean(),
      User.findById(studentId).select("streakCount leaderboardPoints"),
    ]);

    return res.status(200).json({
      success: true,
      words,
      progress: serializeProgress(progress, words.length),
      rewards: {
        pointsPerCorrectAnswer: POINTS_PER_CORRECT_ANSWER,
        dailyPointsLimit: DAILY_VOCAB_POINTS_LIMIT,
      },
      student: {
        streak: user?.streakCount || 0,
        leaderboardPoints: user?.leaderboardPoints || 0,
      },
    });
  } catch (error: any) {
    return sendError(res, error, "vocabulary.getVocabularyGame");
  }
};

export const recordVocabularyAnswer = async (req: AuthRequest, res: Response) => {
  try {
    const studentId = req.user?.userId;
    const { wordId, correct: reportedCorrect, selectedDefinition, mastered = false, mode = "QUIZ" } = req.body;
    if (!mongoose.isValidObjectId(wordId) || (mode !== "QUIZ" && typeof reportedCorrect !== "boolean")) {
      return res.status(400).json({ success: false, error: "A valid word and answer result are required." });
    }

    const word = await VocabularyWord.findOne({ _id: wordId, isActive: true }).select("_id definition");
    if (!word) return res.status(404).json({ success: false, error: "Vocabulary word not found." });
    const correct = mode === "QUIZ"
      ? typeof selectedDefinition === "string" && selectedDefinition === word.definition
      : reportedCorrect;

    const progress = await VocabularyProgress.findOneAndUpdate(
      { student: studentId },
      { $setOnInsert: { student: studentId } },
      { upsert: true, new: true }
    );

    const today = dateKey();
    if (progress.pointsDate !== today) {
      progress.pointsDate = today;
      progress.pointsAwardedToday = 0;
    }

    progress.totalAttempts += 1;
    if (correct) progress.totalCorrect += 1;

    const wordKey = word._id.toString();
    if (correct && mastered) {
      if (!progress.masteredWords.some((id) => id.toString() === wordKey)) {
        progress.masteredWords.push(word._id);
      }
      progress.missedCounts.delete(wordKey);
    } else if (!correct) {
      progress.masteredWords = progress.masteredWords.filter((id) => id.toString() !== wordKey);
      progress.missedCounts.set(wordKey, (progress.missedCounts.get(wordKey) || 0) + 1);
    }

    let pointsAdded = 0;
    if (correct && mode === "QUIZ" && progress.pointsAwardedToday < DAILY_VOCAB_POINTS_LIMIT) {
      pointsAdded = Math.min(
        POINTS_PER_CORRECT_ANSWER,
        DAILY_VOCAB_POINTS_LIMIT - progress.pointsAwardedToday
      );
      progress.pointsAwardedToday += pointsAdded;
    }

    const user = await User.findById(studentId);
    if (!user) return res.status(404).json({ success: false, error: "Student not found." });

    if (pointsAdded > 0) user.leaderboardPoints += pointsAdded;

    const yesterday = new Date();
    yesterday.setUTCDate(yesterday.getUTCDate() - 1);
    const yesterdayKey = dateKey(yesterday);
    if (user.lastActiveDate === yesterdayKey) {
      user.streakCount += 1;
      user.dailyPracticeProgress = 1;
      user.lastActiveDate = today;
    } else if (user.lastActiveDate === today) {
      user.dailyPracticeProgress += 1;
    } else {
      user.streakCount = 1;
      user.dailyPracticeProgress = 1;
      user.lastActiveDate = today;
    }

    await Promise.all([progress.save(), user.save()]);

    return res.status(200).json({
      success: true,
      pointsAdded,
      progress: serializeProgress(progress, await VocabularyWord.countDocuments({ isActive: true })),
      student: {
        streak: user.streakCount,
        leaderboardPoints: user.leaderboardPoints,
      },
    });
  } catch (error: any) {
    return sendError(res, error, "vocabulary.recordVocabularyAnswer");
  }
};

export const resetVocabularyProgress = async (req: AuthRequest, res: Response) => {
  try {
    await VocabularyProgress.updateOne(
      { student: req.user?.userId },
      {
        $set: {
          masteredWords: [],
          missedCounts: {},
          totalAttempts: 0,
          totalCorrect: 0,
        },
      }
    );
    return res.status(200).json({ success: true });
  } catch (error: any) {
    return sendError(res, error, "vocabulary.resetVocabularyProgress");
  }
};

export const getAdminVocabularyWords = async (_req: AuthRequest, res: Response) => {
  try {
    await ensureVocabularySeeded();
    const words = await VocabularyWord.find().sort({ frequency: -1, word: 1 }).lean();
    return res.status(200).json({ success: true, words });
  } catch (error: any) {
    return sendError(res, error, "vocabulary.getAdminVocabularyWords");
  }
};

const vocabularyPayload = (body: any) => ({
  word: String(body.word || "").trim().toLowerCase(),
  partOfSpeech: String(body.partOfSpeech || "").trim(),
  definition: stripEmojis(String(body.definition || "").trim()),
  example: stripEmojis(String(body.example || "").trim()),
  synonyms: Array.isArray(body.synonyms)
    ? body.synonyms.map((item: any) => String(item).trim()).filter(Boolean)
    : String(body.synonyms || "").split(",").map((item) => item.trim()).filter(Boolean),
  frequency: Math.max(0, Number(body.frequency) || 0),
  isActive: body.isActive !== false,
});

export const createVocabularyWord = async (req: AuthRequest, res: Response) => {
  try {
    const payload = vocabularyPayload(req.body);
    if (!payload.word || !payload.partOfSpeech || !payload.definition) {
      return res.status(400).json({ success: false, error: "Word, part of speech, and definition are required." });
    }
    const word = await VocabularyWord.create(payload);
    return res.status(201).json({ success: true, word });
  } catch (error: any) {
    const status = error?.code === 11000 ? 409 : 500;
    return res.status(status).json({ success: false, error: status === 409 ? "This vocabulary word already exists." : error.message });
  }
};

export const updateVocabularyWord = async (req: AuthRequest, res: Response) => {
  try {
    const payload = vocabularyPayload(req.body);
    if (!payload.word || !payload.partOfSpeech || !payload.definition) {
      return res.status(400).json({ success: false, error: "Word, part of speech, and definition are required." });
    }
    const word = await VocabularyWord.findByIdAndUpdate(req.params.id, payload, {
      new: true,
      runValidators: true,
    });
    if (!word) return res.status(404).json({ success: false, error: "Vocabulary word not found." });
    return res.status(200).json({ success: true, word });
  } catch (error: any) {
    const status = error?.code === 11000 ? 409 : 500;
    return res.status(status).json({ success: false, error: status === 409 ? "This vocabulary word already exists." : error.message });
  }
};

export const deleteVocabularyWord = async (req: AuthRequest, res: Response) => {
  try {
    const word = await VocabularyWord.findByIdAndDelete(req.params.id);
    if (!word) return res.status(404).json({ success: false, error: "Vocabulary word not found." });
    await VocabularyProgress.updateMany({}, {
      $pull: { masteredWords: word._id },
      $unset: { [`missedCounts.${word._id.toString()}`]: "" },
    });
    return res.status(200).json({ success: true });
  } catch (error: any) {
    return sendError(res, error, "vocabulary.deleteVocabularyWord");
  }
};
