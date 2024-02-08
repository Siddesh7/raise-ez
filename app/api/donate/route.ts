import {NextRequest, NextResponse} from "next/server";
import {getSSLHubRpcClient, Message} from "@farcaster/hub-nodejs";
import {
  callWriteFunction,
  getCampaign,
  transferDonation,
} from "../../lib/ethersFunction";
import {CROWDFUNDING_CONTRACT_ABI} from "@/app/constants";
import {ethers} from "ethers";

const HUB_URL = "nemes.farcaster.xyz:2283";
const hubClient = getSSLHubRpcClient(HUB_URL);

const postUrl = `${process.env.NEXT_PUBLIC_HOST}/api/code`;

export async function POST(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const id = searchParams.get("id") ?? "";
  const res: any = await getCampaign(id);
  console.log(res);
  let imageURL = "";
  if (res) {
    let goal = res?.goal?.toString();
    let p;
    let fundsRaised = res?.fundsRaised?.toString();
    console.log("fundsRaised", fundsRaised);
    console.log("goal", goal);
    p = (Number(fundsRaised) / Number(goal)) * 100;
    console.log("p", p);
    imageURL = `${process.env.NEXT_PUBLIC_HOST}/api/images/?n=${res.name}&d=${res.description}&p=${p}&e=1`;
  }
  const {
    untrustedData: {inputText, fid},
    trustedData: {messageBytes},
  } = await req.json();
  const frameMessage = Message.decode(Buffer.from(messageBytes, "hex"));
  const validateResult = await hubClient.validateMessage(frameMessage);
  if (validateResult.isOk() && validateResult.value.valid) {
    const validMessage = validateResult.value.message;

    let urlBuffer = validMessage?.data?.frameActionBody?.url ?? [];
    const urlString = Buffer.from(urlBuffer).toString("utf-8");
    if (!urlString.startsWith(process.env.NEXT_PUBLIC_HOST ?? "")) {
      return new NextResponse("Bad Request", {status: 400});
    }

    const message = inputText ?? "";
    if (message === "" || !fid) {
      return new NextResponse("Bad Request", {status: 400});
    }
    let sender;
    await fetch(`https://api.neynar.com/v2/farcaster/user/bulk?fids=${fid}`, {
      method: "GET", // Assuming you are making a GET request
      headers: {
        Accept: "application/json",
        api_key: "NEYNAR_API_DOCS", // Replace 'NEYNAR_API_DOCS' with your actual API key
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        sender = data.users[0].verifications[0];
        fetch("https://nn-8kcm.onrender.com/donate", {
          method: "POST",
          headers: {
            "Content-Type": "application/json", // Indicate that we're sending JSON data
          },
          body: JSON.stringify({
            from: ethers.utils.getAddress(sender),
            campaignId: id,
            amount: message,
          }),
        })
          .then((response) => response.json()) // Assuming the server responds with JSON
          .then((data) => console.log(data))
          .catch((error) => console.error("Error:", error));
      })
      .catch((error) => console.error("Error fetching data:", error));
    console.log("sender", sender);
    console.log("id", id);
    console.log("message", message);

    return new NextResponse(
      `<!DOCTYPE html>
      <html>
        <head>
          <title>Echo Says:</title>
          <meta property="og:title" content="Echo Says:" />
          <meta property="og:image" content="${imageURL}" />
          <meta name="fc:frame" content="vNext" />
          <meta name="fc:frame:post_url" content="${postUrl}" />
          <meta name="fc:frame:image" content="${imageURL}" />
          <meta name="fc:frame:button:1" content="FH on X" />
          <meta name="fc:frame:button:1:action" content="link" />
          <meta name="fc:frame:button:1:target" content="https://twitter.com/founderhouse_" />
          <meta name="fc:frame:button:2" content="Deposit Funds" />
          <meta name="fc:frame:button:2:action" content="link" />
          <meta name="fc:frame:button:2:target" content="https://t.me/+ULHESQjzIbI2MjQ1" />
        </head>
        <body/>
      </html>`,
      {
        status: 200,
        headers: {
          "Content-Type": "text/html",
        },
      }
    );
  } else {
    return new NextResponse("Unauthorized", {status: 401});
  }
}

export const GET = POST;
