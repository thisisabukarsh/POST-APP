const express = require("express");
const { check, validationResult } = require("express-validator");
const connection = require("../db");

const router = express.Router();

// Get all posts
router.get("/", (req, res) => {
  connection.query("SELECT * FROM posts", (err, results) => {
    if (err) {
      console.error("Error fetching posts:", err);
      return res.status(500).json({ error: "Database error." });
    }
    res.json(results);
  });
});

// Get post by ID
router.get("/:id", (req, res) => {
  const { id } = req.params;

  // Fetch post by ID from the database
  connection.query("SELECT * FROM posts WHERE id = ?", [id], (err, result) => {
    if (err) {
      console.error("Error fetching post by ID:", err);
      return res.status(500).json({ error: "Database error." });
    }
    if (result.length === 0) {
      return res.status(404).json({ error: "Post not found." });
    }
    res.json(result[0]);
  });
});
// Add new post
router.post(
  "/",
  check("title").notEmpty().withMessage("Title is required."),
  check("description").notEmpty().withMessage("Description is required."),
  (req, res) => {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Destructure validated data from request body
    const { title, description, created_by } = req.body;

    // Default status to 'pending'
    const status = "pending";

    // Insert into database with current timestamp for created_on and default status
    connection.query(
      "INSERT INTO posts (title, description, status, created_by, created_on) VALUES (?, ?, ?, ?, NOW())",
      [title, description, status, created_by],
      (err, result) => {
        if (err) {
          console.error("Error inserting post:", err);
          return res.status(500).json({ error: "Database error." });
        }
        res.json({
          id: result.insertId,
          title,
          description,
          status,
          created_by,
          created_on: new Date(),
        });
      }
    );
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
  (req, res) => {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const { title, description, updated_by } = req.body;

    // Default status to pending if not provided
    const status = req.body.status || "pending";

    // Update the updated_on timestamp to current time
    const updated_on = new Date();

    // Update the post in the database
    connection.query(
      "UPDATE posts SET title = ?, description = ?, status = ?, updated_by = ?, updated_on = ? WHERE id = ?",
      [title, description, status, updated_by, updated_on, id],
      (err, result) => {
        if (err) {
          console.error("Error updating post:", err);
          return res.status(500).json({ error: "Database error." });
        }
        if (result.affectedRows === 0) {
          return res.status(404).json({ error: "Post not found." });
        }
        res.json({ message: "Post updated successfully", id });
      }
    );
  }
);

// Delete post by ID
router.delete("/:id", (req, res) => {
  const { id } = req.params;

  // Delete the post from the database
  connection.query("DELETE FROM posts WHERE id = ?", [id], (err, result) => {
    if (err) {
      console.error("Error deleting post:", err);
      return res.status(500).json({ error: "Database error." });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Post not found." });
    }
    res.json({ message: "Post deleted successfully", id });
  });
});

module.exports = router;
