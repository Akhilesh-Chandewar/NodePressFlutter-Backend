import express from "express";
import dotenv from "dotenv";
import errorHandler from "./utils/errorHandler";
import userRoutes from "./routes/user.routes";
import blogRoutes from "./routes/blog.routes";
import profileRoutes from "./routes/profile.routes";

dotenv.config()
const app = express();
app.use(express.json())


app.get("/",(req,res)=>{
    res.send("This is server for Nodepressflutter blog app");
})

app.use("/api/user", userRoutes);
app.use("/api/blogs", blogRoutes);
app.use("/api/profile", profileRoutes)


app.use(errorHandler);
const PORT = process.env.PORT;
// console.log(process.env.JWT_SECRETE)
app.listen(PORT,()=>{
    console.log(`Server is running on ${PORT}`);
})