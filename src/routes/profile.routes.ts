import express from "express";
import { isAuthenticated } from "../middleware/authenticate.middleware";
import { upload } from "../middleware/upload.middleware";
import { addOrUpdateProfileImage, addProfile, checkProfile, getProfileData, updateProfile } from "../controllers/profile.controller";

const router = express.Router();

router.patch("/add/image", isAuthenticated, upload.single("img"), addOrUpdateProfileImage);
router.post("/add", isAuthenticated, addProfile);
router.get("/checkProfile", isAuthenticated, checkProfile);
router.get("/getData", isAuthenticated, getProfileData);
router.patch("/update", isAuthenticated, updateProfile);

export default router;