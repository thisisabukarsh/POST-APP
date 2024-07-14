import express, { Application } from "express";
import bodyParser from "body-parser";
import postsRouter from "./routes/post";
import sequelize from "./db";

const app: Application = express();
app.use(bodyParser.json());
app.use("/api/posts", postsRouter);

const PORT: Number = process.env.PORT ? parseInt(process.env.PORT) : 3000;

sequelize
  .sync()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Failed to sync database:", err);
  });
