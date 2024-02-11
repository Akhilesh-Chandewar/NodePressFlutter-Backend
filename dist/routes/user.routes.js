"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_controller_1 = require("../controllers/user.controller");
const router = express_1.default.Router();
router.post("/register", user_controller_1.registerUser).post("/login", user_controller_1.login);
router.patch("/update/:id", user_controller_1.updateUser);
router.delete("/delete/:id", user_controller_1.removeUser);
router.get("/users", user_controller_1.getAllUsers).get("/:username", user_controller_1.getUser);
exports.default = router;
