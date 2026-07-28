import { Response, NextFunction } from "express";
import { AuthRequest } from "./auth.middleware";

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
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user || req.user.status === "SUSPENDED") {
      return res.status(403).json({ success: false, error: "Forbidden: Account is suspended" });
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
