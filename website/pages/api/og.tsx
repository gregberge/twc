/* eslint-env node */
import { ImageResponse } from "@vercel/og";

export const config = {
  runtime: "edge",
};

const font = fetch(new URL("./Inter-SemiBold.otf", import.meta.url)).then(
  (res) => res.arrayBuffer(),
);

const bg = fetch(new URL("./og-bg.jpg", import.meta.url)).then((res) =>
  res.arrayBuffer(),
);

export default async function (req) {
  const [inter, bgData] = await Promise.all([font, bg]);

  const { searchParams } = new URL(req.url);

  // ?title=<title>
  const hasTitle = searchParams.has("title");
  const title = hasTitle ? searchParams.get("title")?.slice(0, 100) : "TWC";

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "center",
          padding: 80,
          fontWeight: 600,
          color: "white",
        }}
      >
        <img
          width="1200"
          height="630"
          src={bgData as any}
          style={{ position: "absolute", top: 0, left: 0 }}
        />
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 446 230"
          style={{ position: "absolute", top: 70, left: 80 }}
          height="40"
        >
          <g clipPath="url(#a)">
            <path
              fill="currentColor"
              d="M174.5 192 118 92.5h39l17.5 30.5 18-30.5h-18l48-80.5v54.5H248L174.5 192ZM253 192l-27.5-48 19-34.5L253 123l18-30.5h39L253 192Z"
            />
            <path
              fill="url(#b)"
              d="M174.5 192 118 92.5h39l17.5 30.5 18-30.5h-18l48-80.5v54.5H248L174.5 192Z"
            />
            <path
              fill="url(#b)"
              d="m253 192-27.5-48 19-34.5L253 123l18-30.5h39L253 192Z"
            />
            <path
              fill="currentColor"
              d="M41.28 192V81.792H2.88V57.6h103.68v24.192h-38.4V192H41.28ZM392.88 194.496c-39.936 0-70.08-31.104-70.08-69.504 0-38.592 28.608-69.888 70.08-69.888 21.888 0 37.056 6.72 49.152 21.12l-19.008 16.512c-8.064-8.448-18.048-12.672-30.144-12.672-25.92 0-42.24 20.352-42.24 44.928 0 24.576 16.32 44.544 42.816 44.544 13.056 0 22.848-4.416 30.72-13.056l19.584 16.704c-10.176 12.288-27.456 21.312-50.88 21.312Z"
            />
          </g>
          <defs>
            <linearGradient
              id="b"
              x1={214}
              x2={214}
              y1={12}
              y2={192}
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#73E6FF" />
              <stop offset={1} stopColor="#FFFFFF" />
            </linearGradient>
            <clipPath id="a">
              <path fill="#fff" d="M0 0h446v230H0z" />
            </clipPath>
          </defs>
        </svg>
        <p
          style={{
            position: "absolute",
            bottom: 70,
            left: 80,
            margin: 0,
            fontSize: 30,
            letterSpacing: -1,
          }}
        >
          Supercharge React + Tailwind CSS
        </p>
        <h1
          style={
            {
              fontSize: 70,
              margin: "0 0 40px -2px",
              lineHeight: 1.1,
              textShadow: "0 2px 30px #000",
              letterSpacing: -4,
              backgroundImage: "linear-gradient(90deg, #fff 40%, #C3F4FF)",
              backgroundClip: "text",
              "-webkit-background-clip": "text",
              color: "transparent",
            } as any
          }
        >
          {title}
        </h1>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: [
        {
          name: "inter",
          data: inter,
          style: "normal",
        },
      ],
    },
  );
}
