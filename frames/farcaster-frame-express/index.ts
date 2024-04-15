import dotenv from "dotenv";
import express from "express";

dotenv.config();
const app = express();

const mainImg = "https://i.postimg.cc/JzhbFsrY/Do-you-like-to-code.png";

const yesImgUrl =
  "https://images.unsplash.com/photo-1625314517201-dd442445cf42?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";

const noImageUrl =
  "https://plus.unsplash.com/premium_photo-1698309212534-34594aad29d4?q=80&w=1780&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";

app.get("/hello", (_, res) => {
  res.send("hello world");
});

app.get("/", (req, res) => {
  const fullUrl = req.protocol + "://" + req.get("host") + req.originalUrl;
  console.log("full url", fullUrl);
  const html = `<!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta property="fc:frame" content="vNext" />
      <meta
        property="fc:frame:image"
        content=${mainImg}
      />
      <meta property="fc:frame" content="vNext" />

      <meta property="fc:frame:post_url" content="${fullUrl}" />
      <meta property="fc:frame:button:1" content="Yes" />
      <meta property="fc:frame:button:2" content="No" />
    </head>
  </html>
  `;
  return res.send(html);
});

app.use(express.json());
app.post("/", (req, res) => {
  console.log("POST REQUET", req.body);
  const { buttonIndex, state = null } = req.body.untrustedData;

  if (buttonIndex === 1 && !state) {
    const html = `<!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta property="fc:frame" content="vNext" />
        <meta
        property="fc:frame:image"
        content=${yesImgUrl}
      />
      </head>
    </html>
    `;
    return res.send(html);
  } else if (buttonIndex === 2) {
    const html = `<!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta property="fc:frame" content="vNext" />
        <meta
        property="fc:frame:image"
        content=${noImageUrl}
      />
      <meta property="fc:frame:state" content="Restart" />
      <meta property="fc:frame:button:1" content="Restart" />
      </head>
    </html>
    `;

    res.send(html);
  } else if (state === "Restart") {
    const fullUrl = req.protocol + "://" + req.get("host") + req.originalUrl;

    const html = `<!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta property="fc:frame" content="vNext" />
      <meta
        property="fc:frame:image"
        content=${mainImg}
      />
      <meta property="fc:frame" content="vNext" />

      <meta property="fc:frame:post_url" content="${fullUrl}" />
      <meta property="fc:frame:button:1" content="Yes" />
      <meta property="fc:frame:button:2" content="No" />
    </head>
  </html>
  `;
    return res.send(html);
  }
});
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`listening at ${port} ...\n`);
});
