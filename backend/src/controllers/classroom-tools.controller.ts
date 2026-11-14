import { Response } from "express";
import mongoose from "mongoose";
import { AuthRequest } from "../middleware/auth.middleware";
import BrowserRecordingUpload from "../models/BrowserRecordingUpload";
import LiveClass from "../models/LiveClass";
import LiveClassPoll from "../models/LiveClassPoll";
import LiveClassWhiteboardStroke from "../models/LiveClassWhiteboardStroke";
import {
  appendBrowserRecordingChunk,
  beginBrowserClassRecording,
  ClassRecordingNotConfiguredError,
  failBrowserClassRecording,
} from "../services/class-recording.service";
import { sendError } from "../utils/http";

const findClass = (identifierParam: string | string[]) => {
  const identifier = Array.isArray(identifierParam)
    ? identifierParam[0]
    : identifierParam;
  const identifiers: Record<string, unknown>[] = [{ roomName: identifier }];
  if (mongoose.isValidObjectId(identifier))
    identifiers.push({ _id: identifier });
  return LiveClass.findOne({ $or: identifiers });
};

const canModerate = (
  req: AuthRequest,
  liveClass: InstanceType<typeof LiveClass>,
) =>
  req.user?.role === "ADMIN" ||
  (req.user?.role === "TEACHER" &&
    String(liveClass.teacher) === String(req.user.userId));

const loadClass = async (req: AuthRequest, res: Response) => {
  const liveClass = await findClass(req.params.id);
  if (!liveClass) {
    res.status(404).json({ success: false, error: "Class session not found" });
    return null;
  }
  const hasAccess =
    req.user?.role === "ADMIN" ||
    (req.user?.role === "TEACHER" &&
      String(liveClass.teacher) === String(req.user.userId)) ||
    (req.user?.role === "STUDENT" && req.user.subscription === "PAID");
  if (!hasAccess) {
    res.status(403).json({
      success: false,
      error: "You do not have access to this classroom",
    });
    return null;
  }
  return liveClass;
};

export const getWhiteboard = async (req: AuthRequest, res: Response) => {
  try {
    const liveClass = await loadClass(req, res);
    if (!liveClass) return;
    const strokes = await LiveClassWhiteboardStroke.find({
      liveClass: liveClass._id,
    })
      .sort({ createdAt: 1 })
      .select("strokeId points color width tool createdAt")
      .lean();
    res.json({ success: true, strokes });
  } catch (error) {
    sendError(res, error, "classroom-tools.getWhiteboard");
  }
};

export const addWhiteboardStroke = async (req: AuthRequest, res: Response) => {
  try {
    const liveClass = await loadClass(req, res);
    if (!liveClass) return;
    if (liveClass.status !== "LIVE") {
      return res.status(409).json({
        success: false,
        error: "The whiteboard is available while class is live",
      });
    }

    const rawPoints = Array.isArray(req.body.points)
      ? req.body.points.slice(0, 500)
      : [];
    const points = rawPoints
      .map((point: unknown) => {
        const candidate = point as { x?: unknown; y?: unknown };
        return { x: Number(candidate?.x), y: Number(candidate?.y) };
      })
      .filter(
        (point: { x: number; y: number }) =>
          Number.isFinite(point.x) &&
          Number.isFinite(point.y) &&
          point.x >= 0 &&
          point.x <= 1 &&
          point.y >= 0 &&
          point.y <= 1,
      );
    const tool = req.body.tool === "ERASER" ? "ERASER" : "PEN";
    const color =
      tool === "ERASER" ? "#ffffff" : String(req.body.color || "#172554");
    const width = Math.min(40, Math.max(1, Number(req.body.width) || 4));
    const strokeId = String(req.body.strokeId || "").slice(0, 100);

    if (!strokeId || points.length < 2 || !/^#[0-9a-f]{6}$/i.test(color)) {
      return res
        .status(400)
        .json({ success: false, error: "Invalid whiteboard stroke" });
    }

    const stroke = await LiveClassWhiteboardStroke.findOneAndUpdate(
      { liveClass: liveClass._id, strokeId },
      {
        $setOnInsert: {
          liveClass: liveClass._id,
          strokeId,
          points,
          color,
          width,
          tool,
          author: req.user?.userId,
        },
      },
      { upsert: true, new: true },
    ).select("strokeId points color width tool createdAt");
    res.status(201).json({ success: true, stroke });
  } catch (error) {
    sendError(res, error, "classroom-tools.addWhiteboardStroke");
  }
};

export const clearWhiteboard = async (req: AuthRequest, res: Response) => {
  try {
    const liveClass = await loadClass(req, res);
    if (!liveClass) return;
    if (!canModerate(req, liveClass)) {
      return res.status(403).json({
        success: false,
        error: "Only the teacher or an admin can clear the whiteboard",
      });
    }
    await LiveClassWhiteboardStroke.deleteMany({ liveClass: liveClass._id });
    res.json({ success: true });
  } catch (error) {
    sendError(res, error, "classroom-tools.clearWhiteboard");
  }
};

const presentPoll = (poll: any, userId?: string, moderator = false) => {
  const responses = Array.isArray(poll.responses) ? poll.responses : [];
  const resultsVisible = Boolean(poll.resultsVisible);
  const canViewResults = moderator || resultsVisible;
  let counts: Record<string, number> | null = null;
  if (canViewResults) {
    counts = Object.fromEntries(
      poll.options.map((option: any) => [option.id, 0]),
    );
    for (const response of responses) {
      if (response.optionId in counts) counts[response.optionId] += 1;
    }
  }
  return {
    _id: String(poll._id),
    question: poll.question,
    options: poll.options,
    status: poll.status,
    resultsVisible,
    counts,
    responseCount: canViewResults ? responses.length : null,
    selectedOptionId:
      responses.find(
        (response: any) => String(response.user) === String(userId),
      )?.optionId || null,
    createdAt: poll.createdAt,
    closedAt: poll.closedAt,
  };
};

export const getPolls = async (req: AuthRequest, res: Response) => {
  try {
    const liveClass = await loadClass(req, res);
    if (!liveClass) return;
    const polls = await LiveClassPoll.find({ liveClass: liveClass._id })
      .sort({ createdAt: -1 })
      .limit(20)
      .lean();
    const moderator = canModerate(req, liveClass);
    res.json({
      success: true,
      polls: polls.map((poll) =>
        presentPoll(poll, req.user?.userId, moderator),
      ),
    });
  } catch (error) {
    sendError(res, error, "classroom-tools.getPolls");
  }
};

export const createPoll = async (req: AuthRequest, res: Response) => {
  try {
    const liveClass = await loadClass(req, res);
    if (!liveClass) return;
    if (!canModerate(req, liveClass)) {
      return res.status(403).json({
        success: false,
        error: "Only the teacher or an admin can create polls",
      });
    }
    if (liveClass.status !== "LIVE") {
      return res.status(409).json({
        success: false,
        error: "Polls can only be launched during a live class",
      });
    }
    const question = String(req.body.question || "")
      .trim()
      .slice(0, 500);
    const optionTexts = (
      Array.isArray(req.body.options) ? req.body.options : []
    )
      .map((option: unknown) => String(option).trim().slice(0, 250))
      .filter(Boolean)
      .slice(0, 6);
    if (!question || optionTexts.length < 2) {
      return res.status(400).json({
        success: false,
        error: "Enter a question and at least two answer options",
      });
    }

    await LiveClassPoll.updateMany(
      { liveClass: liveClass._id, status: "ACTIVE" },
      { status: "CLOSED", closedAt: new Date() },
    );
    const poll = await LiveClassPoll.create({
      liveClass: liveClass._id,
      question,
      options: optionTexts.map((text: string, index: number) => ({
        id: String.fromCharCode(65 + index),
        text,
      })),
      createdBy: req.user?.userId,
    });
    res.status(201).json({
      success: true,
      poll: presentPoll(poll.toObject(), req.user?.userId, true),
    });
  } catch (error) {
    sendError(res, error, "classroom-tools.createPoll");
  }
};

export const voteOnPoll = async (req: AuthRequest, res: Response) => {
  try {
    const liveClass = await loadClass(req, res);
    if (!liveClass) return;
    const poll = await LiveClassPoll.findOne({
      _id: req.params.pollId,
      liveClass: liveClass._id,
      status: "ACTIVE",
    });
    if (!poll)
      return res
        .status(404)
        .json({ success: false, error: "Active poll not found" });
    const optionId = String(req.body.optionId || "");
    if (!poll.options.some((option) => option.id === optionId)) {
      return res
        .status(400)
        .json({ success: false, error: "Invalid poll option" });
    }

    const userId = new mongoose.Types.ObjectId(req.user?.userId);
    // One atomic pipeline update prevents simultaneous student votes from
    // overwriting each other while still allowing a student to change an answer.
    const updatedPoll = await LiveClassPoll.findOneAndUpdate(
      { _id: poll._id, liveClass: liveClass._id, status: "ACTIVE" },
      [
        {
          $set: {
            responses: {
              $concatArrays: [
                {
                  $filter: {
                    input: "$responses",
                    as: "response",
                    cond: { $ne: ["$$response.user", userId] },
                  },
                },
                [{ user: userId, optionId, answeredAt: new Date() }],
              ],
            },
          },
        },
      ],
      { new: true },
    );
    if (!updatedPoll) {
      return res
        .status(409)
        .json({ success: false, error: "This poll has already closed" });
    }
    res.json({
      success: true,
      poll: presentPoll(
        updatedPoll.toObject(),
        req.user?.userId,
        canModerate(req, liveClass),
      ),
    });
  } catch (error) {
    sendError(res, error, "classroom-tools.voteOnPoll");
  }
};

export const closePoll = async (req: AuthRequest, res: Response) => {
  try {
    const liveClass = await loadClass(req, res);
    if (!liveClass) return;
    if (!canModerate(req, liveClass)) {
      return res.status(403).json({
        success: false,
        error: "Only the teacher or an admin can close polls",
      });
    }
    const poll = await LiveClassPoll.findOneAndUpdate(
      { _id: req.params.pollId, liveClass: liveClass._id },
      { status: "CLOSED", closedAt: new Date() },
      { new: true },
    );
    if (!poll)
      return res.status(404).json({ success: false, error: "Poll not found" });
    res.json({
      success: true,
      poll: presentPoll(poll.toObject(), req.user?.userId, true),
    });
  } catch (error) {
    sendError(res, error, "classroom-tools.closePoll");
  }
};

export const revealPollResults = async (req: AuthRequest, res: Response) => {
  try {
    const liveClass = await loadClass(req, res);
    if (!liveClass) return;
    if (!canModerate(req, liveClass)) {
      return res.status(403).json({
        success: false,
        error: "Only the teacher or an admin can reveal poll results",
      });
    }
    const poll = await LiveClassPoll.findOneAndUpdate(
      { _id: req.params.pollId, liveClass: liveClass._id },
      {
        resultsVisible: true,
        revealedAt: new Date(),
        revealedBy: req.user?.userId,
      },
      { new: true },
    );
    if (!poll)
      return res.status(404).json({ success: false, error: "Poll not found" });
    res.json({
      success: true,
      poll: presentPoll(poll.toObject(), req.user?.userId, true),
    });
  } catch (error) {
    sendError(res, error, "classroom-tools.revealPollResults");
  }
};

export const getRecordingStatus = async (req: AuthRequest, res: Response) => {
  try {
    const liveClass = await loadClass(req, res);
    if (!liveClass) return;
    const moderator = canModerate(req, liveClass);
    const activeUpload = moderator
      ? await BrowserRecordingUpload.findOne({
          liveClass: liveClass._id,
          status: "ACTIVE",
        })
          .sort({ createdAt: -1 })
          .select("_id nextOffset")
          .lean()
      : null;
    res.json({
      success: true,
      recording: {
        status: liveClass.recordingStatus,
        driveUrl: moderator ? liveClass.recordingDriveUrl : undefined,
        error: moderator ? liveClass.recordingError : undefined,
        uploadId: activeUpload ? String(activeUpload._id) : undefined,
        uploadedBytes: activeUpload?.nextOffset,
      },
    });
  } catch (error) {
    sendError(res, error, "classroom-tools.getRecordingStatus");
  }
};

export const startRecording = async (req: AuthRequest, res: Response) => {
  try {
    const liveClass = await loadClass(req, res);
    if (!liveClass) return;
    if (!canModerate(req, liveClass)) {
      return res.status(403).json({
        success: false,
        error: "Only the teacher or an admin can record classes",
      });
    }
    if (liveClass.status !== "LIVE") {
      return res
        .status(409)
        .json({ success: false, error: "Start the class before recording" });
    }
    const mimeType =
      typeof req.body?.mimeType === "string" ? req.body.mimeType : "";
    const upload = await beginBrowserClassRecording(
      liveClass,
      req.user!.userId,
      mimeType,
    );
    res.json({
      success: true,
      uploadId: String(upload._id),
      recording: { status: "ACTIVE" },
    });
  } catch (error) {
    if (error instanceof ClassRecordingNotConfiguredError) {
      return res.status(503).json({ success: false, error: error.message });
    }
    sendError(res, error, "classroom-tools.startRecording");
  }
};

export const uploadRecordingChunk = async (req: AuthRequest, res: Response) => {
  try {
    const liveClass = await loadClass(req, res);
    if (!liveClass) return;
    if (!canModerate(req, liveClass)) {
      return res.status(403).json({
        success: false,
        error: "Only the teacher or an admin can upload recordings",
      });
    }
    if (!Buffer.isBuffer(req.body)) {
      return res
        .status(415)
        .json({ success: false, error: "Recording chunk must be binary data" });
    }
    const offset = Number(req.get("x-upload-offset"));
    if (!Number.isSafeInteger(offset) || offset < 0) {
      return res
        .status(400)
        .json({ success: false, error: "Invalid recording upload offset" });
    }
    const final = req.query.final === "true";
    if (!final && req.body.length % (256 * 1024) !== 0) {
      return res.status(400).json({
        success: false,
        error: "Non-final recording chunks must use a 256 KB aligned size",
      });
    }
    const uploadId =
      typeof req.params.uploadId === "string"
        ? req.params.uploadId
        : req.params.uploadId[0];
    if (!uploadId) {
      return res
        .status(400)
        .json({ success: false, error: "Recording upload ID is required" });
    }
    const result = await appendBrowserRecordingChunk({
      uploadId,
      liveClassId: String(liveClass._id),
      body: req.body,
      offset,
      final,
    });
    res.json({ success: true, ...result });
  } catch (error) {
    const expectedOffset = (error as Error & { expectedOffset?: number })
      ?.expectedOffset;
    if (expectedOffset !== undefined) {
      return res.status(409).json({
        success: false,
        error: (error as Error).message,
        expectedOffset,
      });
    }
    if (error instanceof ClassRecordingNotConfiguredError) {
      return res.status(503).json({ success: false, error: error.message });
    }
    sendError(res, error, "classroom-tools.uploadRecordingChunk");
  }
};

export const abortRecordingUpload = async (req: AuthRequest, res: Response) => {
  try {
    const liveClass = await loadClass(req, res);
    if (!liveClass) return;
    if (!canModerate(req, liveClass)) {
      return res.status(403).json({
        success: false,
        error: "Only the teacher or an admin can stop recordings",
      });
    }
    const reason =
      typeof req.body?.reason === "string"
        ? req.body.reason
        : "Recording stopped before completion";
    const uploadId =
      typeof req.params.uploadId === "string"
        ? req.params.uploadId
        : req.params.uploadId[0];
    if (!uploadId) {
      return res
        .status(400)
        .json({ success: false, error: "Recording upload ID is required" });
    }
    await failBrowserClassRecording(uploadId, String(liveClass._id), reason);
    res.json({ success: true });
  } catch (error) {
    sendError(res, error, "classroom-tools.abortRecordingUpload");
  }
};
