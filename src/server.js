import express from "express";
import cors from "cors";

const server = express();
server.use(cors());
server.use(express.json());

import dotenv from "dotenv";

dotenv.config();

server.get("/status", (req, res) => {
  res.send({ msg: "ok" });
});

server.listen(process.env.PORT, () => {
  console.log(`Server listen on ${process.env.PORT}`);
});
