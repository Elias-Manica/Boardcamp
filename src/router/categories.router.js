import express from "express";

import {
  getCategories,
  postCategories,
} from "../controllers/categories.controller.js";

const router = express.Router();

router.get("/categories", getCategories);

router.post("/categories", postCategories);

export default router;
