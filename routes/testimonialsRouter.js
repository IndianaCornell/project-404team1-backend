import { Router } from "express";
import Testimonial from "../models/testimonial.js";

const router = Router();

// GET /api/testimonials → всі записи
router.get("/", async (req, res, next) => {
  try {
    const rows = await Testimonial.findAll({ order: [["createdAt", "DESC"]] });
    res.json(rows);
  } catch (err) {
    next(err);
  }
});

export default router;