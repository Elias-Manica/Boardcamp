import express from "express";

import {
  getRentals,
  postRentals,
  endRental,
  deleteRental,
} from "../controllers/rentals.controller.js";

const router = express.Router();

router.get("/rentals", getRentals);

router.post("/rentals", postRentals);

router.post("/rentals/:id/return", endRental);

router.delete("/rentals/:id", deleteRental);

export default router;
