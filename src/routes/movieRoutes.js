// const express = require('express');
import express from "express";

const router = express.Router();

router.get("/movies", (req, res) => {
  res.json({ message: "Inside movies route" });
});

// module.exports = router;
export default router;
