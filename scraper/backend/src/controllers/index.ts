import { RequestHandler } from "express";
import puppeteer, { Browser } from "puppeteer";
import { z } from "zod";
import { prisma } from "../..";
import { scrapCastUsernameForKeyword } from "../utils";

export const scrapPostController: RequestHandler = async (req, res) => {
  let browser: undefined | Browser = undefined;

  try {
    const keyword = req.body.keyword;
    const name = req.body.name;
    z.string().trim().min(1, "keyword too short").parse(keyword);
    z.string().trim().min(1, " name too short ").parse(name);
    browser = await puppeteer.launch({
      headless: true,
    });
    const data = await scrapCastUsernameForKeyword(browser, keyword);

    console.log("data", data, name);

    await prisma.scrapSession.create({
      data: {
        profiles: { create: data },
        name,
      },
    });

    res.send({
      message: "success",
      status: true,
      // data,
    });
  } catch (error) {
    res.send({
      message: (error as Error).message,
      status: false,
    });
  } finally {
    if (browser) {
      await browser.close();
    }
  }
};

export const scrapGetController: RequestHandler = async (req, res) => {
  try {
    const query = req.query;
    z.object({
      sessionId: z.string(),
    }).parse(query);

    const sessionId = query.sessionId as string;
    const data = await prisma.scrapSession.findUnique({
      where: { id: sessionId },
      include: {
        profiles: true,
      },
    });

    res.send(data);
  } catch (error) {
    console.log("ero", error);
    res.send({
      message: (error as Error).message,
      status: false,
    });
  }
};

export const sessionController: RequestHandler = async (req, res) => {
  const data = await prisma.scrapSession.findMany({
    select: {
      id: true,
      createdAt: true,
      name: true,
    },
    orderBy: { createdAt: "desc" },
  });

  res.send({ message: "successfull", status: true, data });
};

export const profilesController: RequestHandler = async (req, res) => {
  try {
    const query = req.query;

    z.object({
      sessionId: z.string(),
      minFollowers: z.string().optional(),
      maxFollowers: z.string().optional(),
    }).parse(query);

    const sessionId = query.sessionId as string;
    const minFollowers = query.minFollowers as string;
    const maxFollowers = query.maxFollowers as string;

    console.log("min", minFollowers, maxFollowers);

    const data = await prisma.scrapSession.findUnique({
      where: { id: sessionId },
      include: {
        profiles: {
          where: {
            ...(maxFollowers !== undefined && {
              followers: { lte: parseInt(maxFollowers) },
            }),
            ...(minFollowers !== undefined && {
              followers: { gte: parseInt(minFollowers) },
            }),
          },
        },
      },
    });

    res.send({ message: "successfull", status: true, data });
  } catch (error) {
    console.log("erro", (error as Error).message);
    res.send({
      message: (error as Error).message,
      status: false,
    });
  }
};
