import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";
import express from "express";
import {
  profilesController,
  scrapPostController,
  sessionController,
} from "./src/controllers";
import cors from "cors";

console.log =
  process.env.NODE_ENV === "production" ? function () {} : console.log;

dotenv.config();
const app = express();
export const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 8080;

app.get("/", (_, res) => {
  res.send('<h1 style="font-size: 100px;">hello world</h1>');
});
app.get("/sessions", sessionController);
app.post("/scrap", scrapPostController);
app.get("/scrap", profilesController);

app.listen(PORT, () => {
  console.log(`App started on http://localhost:${PORT}`);
});
