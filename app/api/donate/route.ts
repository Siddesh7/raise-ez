import {NextRequest, NextResponse} from "next/server";
import {getSSLHubRpcClient, Message} from "@farcaster/hub-nodejs";
import {checkIfBalanceExists, getCampaign} from "../../lib/ethersFunction";
import {CROWDFUNDING_CONTRACT_ABI} from "@/app/constants";
import {BigNumber, ethers} from "ethers";

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

  const message = inputText ?? "";
  if (message === "" || !fid) {
    return new NextResponse("Bad Request", {status: 400});
  }
  let sender = "";
  console.log("fid", fid);

  fetch(`https://api.neynar.com/v2/farcaster/user/bulk?fids=${fid}`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      api_key: "NEYNAR_API_DOCS", // Replace 'NEYNAR_API_DOCS' with your actual API key
    },
  })
    .then((response) => response.json())
    .then(async (data) => {
      // Using async here because we'll use await inside
      console.log(data.users[0].verifications[0]);
      sender = data.users[0].verifications[0];
      console.log("sender", sender);

      // Now that we have the sender, check the balance
      const balanceOfSender: any = await checkIfBalanceExists(sender);
      if (
        balanceOfSender.toString() < 0 ||
        balanceOfSender.toString() < message
      ) {
        return new NextResponse(
          `<!DOCTYPE html>
      <html>
        <head>
          <title>Echo Says:</title>
          <meta property="og:title" content=":" />
          <meta property="og:image" content="${`${process.env.NEXT_PUBLIC_HOST}/api/error/`}" />
          <meta name="fc:frame" content="vNext" />
          <meta name="fc:frame:post_url" content="${postUrl}" />
          <meta name="fc:frame:image" content="${`${process.env.NEXT_PUBLIC_HOST}/api/error/`}" />
          <meta name="fc:frame:button:1" content="Insufficient balance, topup" />
          <meta name="fc:frame:button:1:action" content="link" />
          <meta name="fc:frame:button:1:target" content="https://raise-ez.vercel.app/" />
        
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
      }
      // If sender is not empty, initiate the second fetch without waiting for it to complete
      if (sender !== "") {
        console.log("Donation initiated");
        fetch("https://nn-8kcm.onrender.com/donate", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: ethers.utils.getAddress(sender),
            campaignId: id,
            amount: message,
          }),
        })
          .then((response) => response.json())
          .then((data) => console.log("Donation successful", data))
          .catch((error) => console.error("Error:", error));
      }
    })
    .catch((error) => console.error("Error fetching user data:", error));

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
          <meta name="fc:frame:button:1" content="Deposit funds" />
          <meta name="fc:frame:button:1:action" content="link" />
          <meta name="fc:frame:button:1:target" content="https://raise-ez.vercel.app/" />
        
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
}

export const GET = POST;
