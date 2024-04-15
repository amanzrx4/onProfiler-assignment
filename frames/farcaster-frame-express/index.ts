import dotenv from "dotenv";
import express from "express";

dotenv.config();
const app = express();

const yesImgUrl =
  "https://images.unsplash.com/photo-1595853035070-59a39fe84de3?q=80&w=1925&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";

const noImageUrl =
  "https://plus.unsplash.com/premium_photo-1685693685482-c319b7868cb7?q=80&w=1780&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";

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
        content="https://images.unsplash.com/photo-1461749280684-dccba630e2f6?q=80&w=2069&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
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
        content="https://images.unsplash.com/photo-1461749280684-dccba630e2f6?q=80&w=2069&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
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

// {
//   untrustedData: {
//     fid: 469434,
//     url: 'https://bac1-36-255-86-47.ngrok-free.app',
//     messageHash: '0xc0eca959a23fe65b4b732f763376626524dfcaa5',
//     timestamp: 1712999265000,
//     network: 1,
//     buttonIndex: 1,
//     castId: { fid: 469434, hash: '0x0000000000000000000000000000000000000001' }
//   },
//   trustedData: {
//     messageBytes: '0a58080d10bad31c18e1caaf3120018201480a2868747470733a2f2f626163312d33362d3235352d38362d34372e6e67726f6b2d667265652e61707010011a1a08bad31c121400000000000000000000000000000000000000011214c0eca959a23fe65b4b732f763376626524dfcaa518012240139bc3e4259d3219e1f523b4671b18699293696dda199681e90f2472b75a79ef8b649e502212ae4dbb44c1ac6c72b35d49f2b19ee55dfb7b41772dbaf454650828013220c447698d00371b1092a04698d3bd9bd537f9898bdf688912e223488438e342bb'
//   }
// }
