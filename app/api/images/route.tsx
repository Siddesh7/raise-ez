import {NextRequest} from "next/server";
import {ImageResponse} from "next/og";
import {join} from "path";
import * as fs from "fs";
import {useRef} from "react";

export const dynamic = "force-dynamic";
const fontPath = join(process.cwd(), "public/ProtestStrike-Regular.ttf");
let myFont = fs.readFileSync(fontPath);

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const n = searchParams.get("n") ?? "";
  const d = searchParams.get("d") ?? "";
  const p = searchParams.get("p") ?? "";
  const end = searchParams.get("e") ?? "";

  const image_url = `${process.env.NEXT_PUBLIC_HOST}/RaiseEz.png`;

  return new ImageResponse(
    (
      <div
        style={{
          position: "relative",
          display: "flex",
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
        {end && (
          <div
            style={{
              color: "#2deb10",
              fontSize: "84px",
              fontWeight: "700",
            }}
          >
            Thank you for your donation!
          </div>
        )}
        <div
          style={{
            color: "#EF5493",
            fontSize: "124px",
            fontWeight: "700",
          }}
        >
          {n}
        </div>
        <div style={{color: "#242424", fontSize: "52px", fontWeight: "700"}}>
          {d}
        </div>
        <div
          style={{
            position: "absolute",
            bottom: "40px",
            left: "80px",
            display: "flex",
            flexDirection: "column",
            gap: "20px",
          }}
        >
          <div style={{color: "#a3ea1e", fontSize: "32px", fontWeight: "400"}}>
            {` Progress ${p}%`}
          </div>

          <div
            style={{
              display: "flex",
              width: "100%",
              backgroundColor: "#ddd", // Background color of the progress container
              borderRadius: "10px", // Optional: if you want rounded corners
              height: "30px", // Height of the progress container
            }}
          >
            <div
              style={{
                height: "100%", // Full height of the container
                width: `${p}%`, // Width based on the progress variable
                backgroundColor: "#4CAF50", // Color of the progress bar
                borderRadius: "10px", // Match container border-radius
              }}
            ></div>
          </div>
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
