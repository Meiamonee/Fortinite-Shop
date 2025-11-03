import express from "express";
const router = express.Router();

router.get("/ping", (req, res) => {
  res.json({ message: "pong", time: new Date().toISOString() });
});

export default router;
