"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const errorHandler_1 = __importDefault(require("./utils/errorHandler"));
const user_routes_1 = __importDefault(require("./routes/user.routes"));
const blog_routes_1 = __importDefault(require("./routes/blog.routes"));
const profile_routes_1 = __importDefault(require("./routes/profile.routes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.get("/", (req, res) => {
    res.send("This is server for Nodepressflutter blog app");
});
app.use("/api/user", user_routes_1.default);
app.use("/api/blogs", blog_routes_1.default);
app.use("/api/profile", profile_routes_1.default);
app.use(errorHandler_1.default);
const PORT = process.env.PORT;
// console.log(process.env.JWT_SECRETE)
app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`);
});
