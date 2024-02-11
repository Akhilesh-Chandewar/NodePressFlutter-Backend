import express from "express";
import { isAuthenticated } from "../middleware/authenticate.middleware";
import { upload } from "../middleware/upload.middleware";
import {addBlog, addCoverPhoto, getOtherBlogs, getOwnBlogs, deleteBlog } from "../controllers/blog.controller"

const router = express.Router();

router.get("/getOwnBlogs" , isAuthenticated, getOwnBlogs).get("/getBlogs" , isAuthenticated, getOtherBlogs);
router.post("/add", isAuthenticated, addBlog);
router.patch("/addcoverImage/:id" , isAuthenticated, upload.single("img") , addCoverPhoto);
router.delete("/delete/:id", isAuthenticated, deleteBlog)

export default router;