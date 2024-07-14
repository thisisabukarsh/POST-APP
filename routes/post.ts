import express, { Request, Response } from "express";
import { check, validationResult } from "express-validator";
import Post from "../models/post";

const router = express.Router();

// Get all posts
router.get("/", async (req: Request, res: Response) => {
  try {
    const posts = await Post.findAll();
    res.json(posts);
  } catch (err) {
    console.error("Error fetching posts:", err);
    res.status(500).json({ error: "Database error." });
  }
});
// Get post by ID
router.get("/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const post = await Post.findByPk(id);
    if (!post) {
      return res.status(404).json({ error: "Post not found." });
    }
    res.json(post);
  } catch (err) {
    console.error("Error fetching post by ID:", err);
    res.status(500).json({ error: "Database error." });
  }
});

// Add new post
router.post(
  "/",
  check("title").notEmpty().withMessage("Title is required."),
  check("description").notEmpty().withMessage("Description is required."),
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, description, created_by } = req.body;

    try {
      const post = await Post.create({
        title,
        description,
        status: "pending",
        created_by,
        created_on: new Date(),
      });
      res.json(post);
    } catch (err) {
      console.error("Error inserting post:", err);
      res.status(500).json({ error: "Database error." });
    }
  }
);

// Update post by ID
router.put(
  "/:id",
  check("title").optional().notEmpty().withMessage("Title is required."),
  check("description")
    .optional()
    .notEmpty()
    .withMessage("Description is required."),
  check("status")
    .optional()
    .isIn(["active", "pending", "blocked", "deactivate"])
    .withMessage("Invalid status."),
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const { title, description, status, updated_by } = req.body;
    const updated_on = new Date();

    try {
      const [updated] = await Post.update(
        { title, description, status, updated_by, updated_on },
        { where: { id } }
      );
      if (updated === 0) {
        return res.status(404).json({ error: "Post not found." });
      }
      res.json({ message: "Post updated successfully", id });
    } catch (err) {
      console.error("Error updating post:", err);
      res.status(500).json({ error: "Database error." });
    }
  }
);

// Delete post by ID
router.delete("/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const deleted = await Post.destroy({ where: { id } });
    if (deleted === 0) {
      return res.status(404).json({ error: "Post not found." });
    }
    res.json({ message: "Post deleted successfully", id });
  } catch (err) {
    console.error("Error deleting post:", err);
    res.status(500).json({ error: "Database error." });
  }
});

export default router;
