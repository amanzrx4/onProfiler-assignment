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

app.get("/sessions", sessionController);
app.post("/scrap", scrapPostController);
app.get("/scrap", profilesController);

app.listen(process.env.PORT, () => {
  console.log(`App started on http://localhost:${process.env.PORT}`);
});
