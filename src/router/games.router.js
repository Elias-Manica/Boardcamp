import express from "express";

import { getGames, postGames } from "../controllers/games.controller.js";

const router = express.Router();

router.get("/games", getGames);

router.post("/games", postGames);

export default router;
