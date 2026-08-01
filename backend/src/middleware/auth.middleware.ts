import { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "../utils/jwt";
import User from "../models/User";

export interface AuthRequest extends Request {
  user?: any;
}

export const authenticate = async (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ success: false, error: "Unauthorized" });
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded: any = verifyAccessToken(token);
    
    // Enforce single-device login
    if (decoded.sessionId && process.env.DATABASE_URL) {
      const user = await User.findById(decoded.userId);
      if (!user) {
        return res.status(401).json({ success: false, error: "User not found" });
      }
      if (user.sessionId && user.sessionId !== decoded.sessionId) {
        return res.status(401).json({ success: false, error: "Session expired: logged in from another device" });
      }
    }
    
    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ success: false, error: "Invalid token" });
  }
};

export const optionalAuthenticate = async (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    return next();
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded: any = verifyAccessToken(token);
    
    if (decoded.sessionId && process.env.DATABASE_URL) {
      const user = await User.findById(decoded.userId);
      if (user && user.sessionId && user.sessionId !== decoded.sessionId) {
        return next();
      }
    }
    
    req.user = decoded;
    next();
  } catch {
    next();
  }
};

export const isAdmin = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (req.user?.role !== "ADMIN") {
    return res.status(403).json({ success: false, error: "Forbidden: Admin access required" });
  }
  next();
};
