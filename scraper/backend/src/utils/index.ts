import { Browser, Page } from "puppeteer";
import { CastResponse, ProfileResponse } from "../../types";
import { Profile } from "@prisma/client";
export type { ScrapSession, Profile } from "@prisma/client";
const ROOT_URL = "https://warpcast.com";
const getQueryUrl = (query: string) => {
  return ROOT_URL + `/~/search/casts?q=${query}`;
};
type ExtractData = Omit<Profile, "id" | "scrapSession" | "scrapSessionId"> & {
  username: string;
};

const SCROLLABLE_DIV_XPATH = "/html/body/div[1]/div/div/div/main/div/div/div";
const SEARCH_QUERY_URL = "https://client.warpcast.com/v2/search-casts";
type Username = ExtractData;

/**
 *
 * @param browser puppetier browser instance
 * @param username username of the profile to extract data
 * @description extract the required data of a given warpcast username
 */
const scrapProfilePromises = async (browser: Browser, username: string) => {
  const profileUrl = `${ROOT_URL}/${username}`;
  const profileEndpointRoute = `https://client.warpcast.com/v2/user-by-username?username=${username}`;

  const page = await browser.newPage();
  // this will save memeory, we just need to intercept the response
  page.setViewport({ height: 0, width: 0, hasTouch: false });

  await new Promise((res) => setTimeout(res, 2000));

  const extractDataPromise = new Promise<ExtractData>(
    async (resolve, reject) => {
      page.on("response", async (res) => {
        if (
          res.url().startsWith(profileEndpointRoute) &&
          res.request().method() === "GET"
        ) {
          try {
            const buffer = await res.buffer();
            const bufferText = buffer.toString();
            const bufferJson = JSON.parse(bufferText) as ProfileResponse;

            console.log("relevant request");

            const data: ExtractData = {
              fid: bufferJson.result.user.fid,
              followers: bufferJson.result.user.followerCount,
              following: bufferJson.result.user.followingCount,
              address: bufferJson.result.extras.custodyAddress,
              username: bufferJson.result.user.username,
            };

            resolve(data);
          } catch (error) {
            reject(error);
          }
        }
      });
    }
  );

  await page.goto(profileUrl);

  const extractedData = await extractDataPromise;

  await onPageExit(page);

  return extractedData;
};

const onPageExit = async (page: Page) => {
  page.removeAllListeners();
  await page.close();
};

const fetchRelevantProfileData = async (username: string) => {
  const responseData = (await (
    await fetch(
      `https://client.warpcast.com/v2/user-by-username?username=${username}`
    )
  ).json()) as ProfileResponse;

  const data: ExtractData = {
    fid: responseData.result.user.fid,
    followers: responseData.result.user.followerCount,
    following: responseData.result.user.followingCount,
    address: responseData.result.extras.custodyAddress,
    username: responseData.result.user.username,
  };

  return data;
};

export const scrapCastUsernameForKeyword = async (
  browser: Browser,
  keyword: string
): Promise<Username[]> => {
  console.log("starting \n");
  let exit = false;
  /***
   * stores only usernames of the casts, will avoid duplicacy as well
   */
  const usernames: Username[] = [];
  const queryUrl = getQueryUrl(keyword);
  const page = await browser.newPage();

  page.on("response", async (res) => {
    if (
      res.url().startsWith(SEARCH_QUERY_URL) &&
      res.request().method() === "GET"
    ) {
      console.log("relevant req \n");
      const buffer = await res.buffer();
      const bufferText = buffer.toString();
      const bufferJson = JSON.parse(bufferText) as CastResponse;

      for (const cast of bufferJson.result.casts) {
        let found = false;
        for (const u of usernames) {
          if (u.username === cast.author.username) {
            found = true;
            break;
          }
        }
        if (!found) {
          /**
           * NOTE: we could use the scrapProfilePromises to scrap user profile using frontend scraping but it's an overkill as we can simply make a fetch call to the endpoint that gives us the profile data. The code works with both, i've made both functions
           *
           * const profileData = await scrapProfilePromises(browser, cast.author.username)
           */

          const profileData = await fetchRelevantProfileData(
            cast.author.username
          );
          usernames.push(profileData);
        }
      }

      if (!bufferJson.next) {
        exit = true;
      }
    }
  });

  await page.goto(queryUrl);

  const elementHandle = await page.waitForSelector(
    "xpath/" + SCROLLABLE_DIV_XPATH,
    {
      timeout: 10000,
    }
  );

  if (!elementHandle) {
    throw new Error("Element not found");
  }

  return new Promise((resolve) => {
    const interval = setInterval(async () => {
      if (exit) {
        clearInterval(interval);
        await onPageExit(page);
        resolve(usernames);
      } else {
        await page.evaluate(() => {
          window.scrollTo({
            top: document.body.scrollHeight,
            behavior: "smooth",
          });
        });
      }
    }, 2000);
  });
};
