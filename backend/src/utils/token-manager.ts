import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { COOKIE_NAME } from "./constants.js";

export const createToken = (id: string, email: string, expiresIn: string) => {
  const payload = { id, email };
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET is not set");
  }
  return jwt.sign(payload, secret, { expiresIn } as jwt.SignOptions);
};

export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  const token = req.signedCookies[COOKIE_NAME];
  if (!token || token.trim() === "") {
    return res.status(401).json({ message: "Token Not Received" });
  }
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    console.error("JWT_SECRET is not set");
    return res.status(500).json({ message: "Server misconfiguration" });
  }
  try {
    const decoded = jwt.verify(token, secret);
    res.locals.jwtData = decoded;
    return next();
  } catch (err) {
    return res.status(401).json({ message: "Token Expired" });
  }
};
