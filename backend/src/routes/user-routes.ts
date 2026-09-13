import { Router } from "express";
import {
  getAllUsers,
  userLogin,
  userLogout,
  userSignup,
  verifyUser,
} from "../controllers/user-controllers.js";
import {
  loginValidator,
  signupValidator,
  validate,
} from "../utils/validators.js";
import { verifyToken } from "../utils/token-manager.js";

const userRoutes = Router();

// NOTE: this was previously open to the public and returned every user
// document. It's now behind verifyToken (any logged-in user can call it),
// which at least stops anonymous scraping. If you don't actually need it,
// consider deleting it — the frontend never calls it.
userRoutes.get("/", verifyToken, getAllUsers);
userRoutes.post("/signup", validate(signupValidator), userSignup);
userRoutes.post("/login", validate(loginValidator), userLogin);
userRoutes.get("/auth-status", verifyToken, verifyUser);
userRoutes.get("/logout", verifyToken, userLogout);

export default userRoutes;
