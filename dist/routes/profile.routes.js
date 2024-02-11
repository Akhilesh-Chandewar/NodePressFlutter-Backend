"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authenticate_middleware_1 = require("../middleware/authenticate.middleware");
const upload_middleware_1 = require("../middleware/upload.middleware");
const profile_controller_1 = require("../controllers/profile.controller");
const router = express_1.default.Router();
router.patch("/add/image", authenticate_middleware_1.isAuthenticated, upload_middleware_1.upload.single("img"), profile_controller_1.addOrUpdateProfileImage);
router.post("/add", authenticate_middleware_1.isAuthenticated, profile_controller_1.addProfile);
router.get("/checkProfile", authenticate_middleware_1.isAuthenticated, profile_controller_1.checkProfile);
router.get("/getData", authenticate_middleware_1.isAuthenticated, profile_controller_1.getProfileData);
router.patch("/update", authenticate_middleware_1.isAuthenticated, profile_controller_1.updateProfile);
exports.default = router;
