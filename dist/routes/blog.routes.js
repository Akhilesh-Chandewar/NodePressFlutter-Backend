"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authenticate_middleware_1 = require("../middleware/authenticate.middleware");
const upload_middleware_1 = require("../middleware/upload.middleware");
const blog_controller_1 = require("../controllers/blog.controller");
const router = express_1.default.Router();
router.get("/getOwnBlogs", authenticate_middleware_1.isAuthenticated, blog_controller_1.getOwnBlogs).get("/getBlogs", authenticate_middleware_1.isAuthenticated, blog_controller_1.getOtherBlogs);
router.post("/add", authenticate_middleware_1.isAuthenticated, blog_controller_1.addBlog);
router.patch("/addcoverImage/:id", authenticate_middleware_1.isAuthenticated, upload_middleware_1.upload.single("img"), blog_controller_1.addCoverPhoto);
router.delete("/delete/:id", authenticate_middleware_1.isAuthenticated, blog_controller_1.deleteBlog);
exports.default = router;
