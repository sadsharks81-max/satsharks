import { Response, NextFunction } from "express";
import { AuthRequest } from "./auth.middleware";
import User from "../models/User";

export const requireAdmin = () => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user || req.user.role !== "ADMIN") {
      return res.status(403).json({ success: false, error: "Forbidden: Admin access required" });
    }
    next();
  };
};

export const requireStudent = () => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user || req.user.role !== "STUDENT") {
      return res.status(403).json({ success: false, error: "Forbidden: Student access required" });
    }
    next();
  };
};

export const requirePaidUser = () => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user || req.user.subscription !== "PAID") {
      return res.status(403).json({ success: false, error: "Forbidden: Paid subscription required" });
    }
    next();
  };
};

export const requireLocalUser = () => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user || req.user.region !== "LOCAL") {
      return res.status(403).json({ success: false, error: "Forbidden: Local region required" });
    }
    next();
  };
};

export const requireInternationalUser = () => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user || req.user.region !== "INTERNATIONAL") {
      return res.status(403).json({ success: false, error: "Forbidden: International region required" });
    }
    next();
  };
};

export const requireActiveUser = () => {
  return async (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user || req.user.status === "SUSPENDED") {
      return res.status(403).json({ success: false, error: "Forbidden: Account is suspended" });
    }
    if (req.user.role === "STUDENT") {
      const user = await User.findById(req.user.userId).select("portalAccessStart portalAccessEnd subscription");
      const now = new Date();
      if (user?.portalAccessStart && user.portalAccessStart > now) {
        return res.status(403).json({ success: false, error: "Your portal access has not started yet." });
      }
      if (user?.portalAccessEnd && user.portalAccessEnd <= now) {
        if (user.subscription !== "FREE") {
          user.subscription = "FREE";
          await user.save();
        }
        return res.status(403).json({ success: false, error: "Your portal access has expired." });
      }
    }
    next();
  };
};

export const requireTeacher = () => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user || req.user.role !== "TEACHER") {
      return res.status(403).json({ success: false, error: "Forbidden: Teacher access required" });
    }
    next();
  };
};

export const requireAdminOrTeacher = () => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user || (req.user.role !== "ADMIN" && req.user.role !== "TEACHER")) {
      return res.status(403).json({ success: false, error: "Forbidden: Admin or Teacher access required" });
    }
    next();
  };
};
