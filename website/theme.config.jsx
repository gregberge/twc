import { useRouter } from "next/router";
import { useConfig } from "nextra-theme-docs";

function By() {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 font-sans pointer-events-none">
      <div className="overflow-hidden">
        <div className="float-right rounded-tl-md bg-white shadow-md pointer-events-auto">
          <a
            className="flex items-center gap-2 px-2 py-1"
            target="_blank"
            rel="nofollow noreferrer"
            href="https://x.com/gregberge_"
          >
            <div className="relative h-7 w-7 overflow-hidden rounded-full">
              <img
                src="https://github.com/gregberge.png"
                alt="Greg Bergé"
                width={28}
                height={28}
              />
              <div className="absolute inset-0 rounded-full border border-black border-opacity-10" />
            </div>
            <p className="text-stone-600 text-sm">
              by{" "}
              <span className="font-medium text-stone-900 transition-colors duration-150 hover:text-stone-600">
                @gregberge_
              </span>
            </p>
          </a>
        </div>
      </div>
    </div>
  );
}

function Logo(props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 446 230"
      {...props}
    >
      <title>TWC</title>
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
          <stop stopColor="#00D1FF" />
          <stop offset={1} stopColor="#6D57FF" />
        </linearGradient>
        <clipPath id="a">
          <path fill="#fff" d="M0 0h446v230H0z" />
        </clipPath>
      </defs>
    </svg>
  );
}

export default {
  logo: <Logo height={40} />,
  logoLink: true,
  project: {
    link: "https://github.com/gregberge/twc",
  },
  chat: {
    link: "https://x.com/gregberge_",
    icon: (
      <svg height={20} fill="none" viewBox="0.254 0.25 500 451.954">
        <path
          fill="currentColor"
          d="M394.033.25h76.67L303.202 191.693l197.052 260.511h-154.29L225.118 294.205 86.844 452.204H10.127l179.16-204.77L.254.25H158.46l109.234 144.417zm-26.908 406.063h42.483L135.377 43.73h-45.59z"
        />
      </svg>
    ),
  },
  docsRepositoryBase: "https://github.com/gregberge/twc/tree/main/website",
  useNextSeoProps() {
    return {
      titleTemplate: "%s – TWC",
    };
  },
  head: function useHead() {
    const { title } = useConfig();
    const { route } = useRouter();
    const socialCard =
      route === "/" || !title
        ? "https://react-twc.vercel.app/og.jpg"
        : `https://react-twc.vercel.app/api/og?title=${title}`;

    return (
      <>
        <meta name="msapplication-TileColor" content="#fff" />
        <meta name="theme-color" content="#fff" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta httpEquiv="Content-Language" content="en" />
        <meta
          name="description"
          content="Create reusable React Tailwind CSS components."
        />
        <meta
          name="og:description"
          content="Create reusable React Tailwind CSS components."
        />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:image" content={socialCard} />
        <meta name="twitter:site:domain" content="react-twc.vercel.app" />
        <meta name="twitter:url" content="https://react-twc.vercel.app" />
        <meta name="og:title" content={title ? title + " – TWC" : "TWC"} />
        <meta name="og:image" content={socialCard} />
        <meta name="apple-mobile-web-app-title" content="TWC" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="icon" href="/favicon.png" type="image/png" />
        <link
          rel="icon"
          href="/favicon-dark.svg"
          type="image/svg+xml"
          media="(prefers-color-scheme: dark)"
        />
        <link
          rel="icon"
          href="/favicon-dark.png"
          type="image/png"
          media="(prefers-color-scheme: dark)"
        />
      </>
    );
  },
  primaryHue: { dark: 190, light: 210 },
  primarySaturation: 100,
  editLink: {
    text: "Edit this page on GitHub →",
  },
  feedback: {
    content: "Question? Give us feedback →",
    labels: "feedback",
  },
  footer: {
    text: (
      <div className="flex w-full flex-col items-center sm:items-start">
        <By />
        <div>
          <a
            className="flex items-center gap-1 text-current"
            target="_blank"
            rel="noopener noreferrer"
            title="X profile"
            href="https://x.com/gregberge_"
          >
            <span>Made with ❤️ by</span>{" "}
            <img
              src="https://github.com/gregberge.png"
              width={20}
              height={20}
              className="rounded-full"
            />{" "}
            Greg Bergé
          </a>
        </div>
        <p className="mt-6 text-xs">© {new Date().getFullYear()} TWC.</p>
      </div>
    ),
  },
};
