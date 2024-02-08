import {NextRequest} from "next/server";
import {ImageResponse} from "next/og";
import {join} from "path";
import * as fs from "fs";
import {useRef} from "react";

export const dynamic = "force-dynamic";
const fontPath = join(process.cwd(), "public/ProtestStrike-Regular.ttf");
let myFont = fs.readFileSync(fontPath);

export async function GET(req: NextRequest) {
  const image_url = `${process.env.NEXT_PUBLIC_HOST}/RaiseEz.png`;

  return new ImageResponse(
    (
      <div
        style={{
          position: "relative",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          paddingLeft: "80px",
          paddingTop: "100px",
          width: "100%",
          height: "100vh",
          backgroundImage: `url(${image_url})`, // You will need the actual path to the image here
          backgroundSize: "cover", // Ensure the image covers the div completely
          backgroundPosition: "center", // Center the background image
        }}
      >
        <div
          style={{
            color: "#f50000",
            fontSize: "124px",
            fontWeight: "700",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          Error, Please try again or visit the website
        </div>
      </div>
    ),
    {
      width: 1528, // Match these dimensions to your image's dimensions
      height: 800,
      fonts: [
        {
          name: "my font",
          data: myFont,
          weight: 700,
          style: "normal",
        },
      ],
    }
  );
}
