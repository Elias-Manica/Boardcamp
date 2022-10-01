import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import connection from "./database/database.js";

import routerCategories from "./router/categories.router.js";

const server = express();
server.use(cors());
server.use(express.json());

dotenv.config();

server.use(routerCategories);

server.listen(process.env.PORT, () => {
  console.log(`Server listen on ${process.env.PORT}`);
});
