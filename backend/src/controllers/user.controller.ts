import { Request, Response } from "express";
import mongoose from "mongoose";
import User from "../models/User";
import PaymentProof from "../models/PaymentProof";
import { AuthRequest } from "../middleware/auth.middleware";

export const getCurrentUser = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ success: false, error: "Unauthorized" });

    if (!process.env.DATABASE_URL) {
      return res.status(200).json({ success: true, user: { ...req.user, hasPendingPayment: false } });
    }

    if (!mongoose.Types.ObjectId.isValid(req.user.userId)) {
      return res.status(401).json({ success: false, error: "Invalid user session token" });
    }

    const user = await User.findById(req.user.userId).select("-password");
    if (!user) return res.status(404).json({ success: false, error: "User not found" });

    let hasPendingPayment = false;
    if (process.env.DATABASE_URL) {
      const pending = await PaymentProof.findOne({ user: user.id, status: "PENDING" });
      hasPendingPayment = !!pending;
    }

    res.status(200).json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        country: user.country,
        region: user.region,
        subscription: user.subscription,
        status: user.status,
        targetScore: user.targetScore ?? 1400,
        streakCount: user.streakCount ?? 0,
        lastActiveDate: user.lastActiveDate,
        dailyGoal: user.dailyGoal ?? 10,
        dailyPracticeProgress: user.dailyPracticeProgress ?? 0,
        leaderboardPoints: user.leaderboardPoints ?? 0,
        hasPendingPayment
      }
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const updateUserSettings = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ success: false, error: "Unauthorized" });
    
    if (!mongoose.Types.ObjectId.isValid(req.user.userId)) {
      return res.status(401).json({ success: false, error: "Invalid user session token" });
    }

    const { targetScore, dailyGoal } = req.body;

    const updateData: any = {};
    if (typeof targetScore === "number") updateData.targetScore = targetScore;
    if (typeof dailyGoal === "number") updateData.dailyGoal = dailyGoal;

    const user = await User.findByIdAndUpdate(req.user.userId, updateData, { new: true }).select("-password");
    if (!user) return res.status(404).json({ success: false, error: "User not found" });

    res.status(200).json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        country: user.country,
        region: user.region,
        subscription: user.subscription,
        status: user.status,
        targetScore: user.targetScore,
        streakCount: user.streakCount,
        lastActiveDate: user.lastActiveDate,
        dailyGoal: user.dailyGoal,
        dailyPracticeProgress: user.dailyPracticeProgress,
        leaderboardPoints: user.leaderboardPoints
      }
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};


export const getUsers = async (req: Request, res: Response) => {
  try {
    if (!process.env.DATABASE_URL) {
      return res.status(200).json({ success: true, users: [] });
    }

    const { role } = req.query;
    const filter: any = {};
    if (role) filter.role = role;

    const users = await User.find(filter).select("-password").sort({ createdAt: -1 });
    res.status(200).json({ success: true, users });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const updateUserSubscription = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { subscription } = req.body;

    if (!process.env.DATABASE_URL) return res.status(200).json({ success: true, message: "Subscription updated (mock)" });

    const user = await User.findByIdAndUpdate(id, { subscription }, { new: true }).select("-password");
    if (!user) return res.status(404).json({ success: false, error: "User not found" });

    res.status(200).json({ success: true, user });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const updateUserStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!process.env.DATABASE_URL) return res.status(200).json({ success: true, message: "Status updated (mock)" });

    const user = await User.findByIdAndUpdate(id, { status }, { new: true }).select("-password");
    if (!user) return res.status(404).json({ success: false, error: "User not found" });

    res.status(200).json({ success: true, user });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const updateUserRole = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (!["ADMIN", "STUDENT", "TEACHER"].includes(role)) {
      return res.status(400).json({ success: false, error: "Invalid role" });
    }

    if (!process.env.DATABASE_URL) return res.status(200).json({ success: true, message: "Role updated (mock)" });

    const user = await User.findByIdAndUpdate(id, { role }, { new: true }).select("-password");
    if (!user) return res.status(404).json({ success: false, error: "User not found" });

    res.status(200).json({ success: true, user });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};
