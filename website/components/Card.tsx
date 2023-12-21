export function Card(props: { children: React.ReactNode }) {
  return (
    <div className="text">
      <div className="text-center my-10 max-w-4xl mx-auto text-balance">
        <h1 className="text-8xl mb-5 font-semibold font-accent text-transparent bg-clip-text bg-gradient-to-br from-blue-9 to-purple-11">
          Supercharge React + Tailwind
        </h1>
        <p className="text-2xl text-low">
          TWC is a lightweight library to create Tailwind Components in one
          line, write less code and build faster.
        </p>
      </div>
    </div>
  );
}
