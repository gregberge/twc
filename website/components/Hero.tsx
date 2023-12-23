import Link from "next/link";

export function Hero() {
  return (
    <div className="text">
      <div className="text-center mt-10 mb-20 max-w-4xl mx-auto text-balance">
        <h1 className="text-[3rem] leading-none md:text-8xl mb-5 font-semibold font-accent text-transparent bg-clip-text bg-gradient-to-br from-blue-9 to-purple-11">
          Supercharge React + Tailwind
        </h1>
        <p className="text-lg md:text-2xl text-low">
          TWC is a lightweight library to create Tailwind Components in one
          line, write less code and build faster.
        </p>
        <div className="mt-8 flex justify-center gap-4">
          <Link
            className="text-lg rounded-lg text-white ring-1 bg-indigo-9 font-medium px-8 py-3 transition hover:bg-indigo-10"
            href="/docs/getting-started"
          >
            Get started with TWC
          </Link>
        </div>
      </div>
    </div>
  );
}
