import { Router } from "express";
import {
  loginUser,
  logoutUser,
  registerUser,
} from "../controllers/auth.controllers.js";
import { SECRET_KEY } from "../config.js";
import { authRequired } from "../middlewares/validateToken.js";

const router = Router();

router.post("/login", loginUser);
router.post("/register", registerUser);
router.post("/logout", logoutUser);

router.get("/routeProtected", authRequired, (req, res) => {
    res.json({ message: "This is a protected route" });
});

export default router;
