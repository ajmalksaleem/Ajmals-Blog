import express from "express";
import connectDb from "./db/connection.js";
import { config } from "dotenv";
import userRoutes from "./routes/user.routes.js";
import authRoutes from "./routes/auth.routes.js";
import postRoutes from "./routes/post.routes.js"
import commentRoutes from './routes/comment.routes.js'
import cookieParser from "cookie-parser";
import path from 'path';

const app = express();
app.use(express.json());
config();
app.use(cookieParser())

connectDb()
  .then(() => {
    app.listen(3000, () => {
      console.log("server started running  .!");
    });
  })
  .catch((err) => {
    console.log(err);
  });

  const __dirname = path.resolve()

app.use("/api/user", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/post", postRoutes);
app.use("/api/comment", commentRoutes);

app.use(express.static(path.join(__dirname,'/client/dist')))

app.get('*',(req,res)=>{
  res.sendFile(path.join(__dirname, 'client', 'dist', 'index.html'));
})

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});
