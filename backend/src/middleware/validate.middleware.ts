import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";

export const validate = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const arr = errors.array();
    const message = arr.map((e) => e.msg).join("; ");
    return res.status(400).json({ success: false, error: message, errors: arr });
  }
  next();
};
