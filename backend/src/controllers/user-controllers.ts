import { Request, Response } from "express";
import User from "../models/User.js";
import { hash, compare } from "bcrypt";
import { createToken } from "../utils/token-manager.js";
import { COOKIE_NAME, TOKEN_EXPIRY } from "../utils/constants.js";

const isProd = process.env.NODE_ENV === "production";

// Frontend and backend are typically deployed on two different domains
// (e.g. two separate Vercel projects), so this cookie has to work
// cross-site: that means `secure: true` + `sameSite: "none"` in production,
// and — importantly — no hardcoded `domain`. Setting `domain: "localhost"`
// (the old behaviour) silently breaks auth on every deployed environment,
// since the browser will never attach a `localhost`-scoped cookie to a
// request going to a real domain. Omitting `domain` lets the browser
// default to the backend's own host, which is what we want here.
const cookieOptions = {
  path: "/",
  httpOnly: true,
  signed: true,
  secure: isProd,
  sameSite: (isProd ? "none" : "lax") as "none" | "lax",
};

const issueAuthCookie = (res: Response, id: string, email: string) => {
  res.clearCookie(COOKIE_NAME, cookieOptions);
  const token = createToken(id, email, TOKEN_EXPIRY);
  const expires = new Date();
  expires.setDate(expires.getDate() + 7);
  res.cookie(COOKIE_NAME, token, { ...cookieOptions, expires });
};

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find();
    return res.status(200).json({ message: "OK", users });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

export const userSignup = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "User already registered" });
    }
    const hashedPassword = await hash(password, 10);
    const user = new User({ name, email, password: hashedPassword });
    await user.save();

    issueAuthCookie(res, user._id.toString(), user.email);

    return res
      .status(201)
      .json({ message: "OK", name: user.name, email: user.email });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

export const userLogin = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    // password has `select: false` in the schema, so it has to be asked
    // for explicitly here.
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(401).json({ message: "User not registered" });
    }
    const isPasswordCorrect = await compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(403).json({ message: "Incorrect password" });
    }

    issueAuthCookie(res, user._id.toString(), user.email);

    return res
      .status(200)
      .json({ message: "OK", name: user.name, email: user.email });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

export const verifyUser = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(res.locals.jwtData.id);
    if (!user) {
      return res
        .status(401)
        .json({ message: "User not registered OR token malformed" });
    }
    return res
      .status(200)
      .json({ message: "OK", name: user.name, email: user.email });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

export const userLogout = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(res.locals.jwtData.id);
    if (!user) {
      return res
        .status(401)
        .json({ message: "User not registered OR token malformed" });
    }
    res.clearCookie(COOKIE_NAME, cookieOptions);
    return res
      .status(200)
      .json({ message: "OK", name: user.name, email: user.email });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};
