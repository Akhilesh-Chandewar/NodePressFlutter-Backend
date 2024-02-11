import express from "express";
import { getAllUsers, getUser, login, registerUser, removeUser, updateUser } from "../controllers/user.controller";

const router = express.Router();

router.post("/register" , registerUser).post("/login", login);
router.patch("/update/:id" , updateUser);
router.delete("/delete/:id", removeUser);
router.get("/users", getAllUsers).get("/:username", getUser);


export default router;
