import * as React from "react";
import { twc } from "./src/index";

function render(element: React.ReactNode) {}

// Basic usage
import { twc } from "react-twc";

const Button = twc.button`text-sm rounded border`;

// Accepts props, merge className
render(
  <Button type="button" className="my-3">
    Press me
  </Button>,
);

// Render as a different component
render(
  <Button asChild>
    <a href="#">It's a link</a>
  </Button>,
);

// Custom component
import * as Progress from "@radix-ui/react-progress";

const ProgressRoot = twc(
  Progress.Root,
)`relative overflow-hidden bg-blackA6 rounded-full w-[300px] h-[25px]`;
const ProgressIndicator = twc(
  Progress.Indicator,
)`bg-white w-full h-full transition-transform duration-[660ms] ease-[cubic-bezier(0.65, 0, 0.35, 1)]`;

function ProgressBar({ progress }: { progress: number }) {
  return (
    <ProgressRoot value={progress}>
      <ProgressIndicator
        style={{ transform: `translateX(-${100 - progress}%)` }}
      />
    </ProgressRoot>
  );
}

// Use with cva
import { cva, VariantProps } from "class-variance-authority";

const button = cva(["font-semibold", "border", "rounded"], {
  variants: {
    intent: {
      primary: ["bg-blue-500", "text-white"],
      secondary: ["bg-white", "text-gray-800"],
    },
  },
  defaultVariants: {
    intent: "primary",
  },
});

type ButtonProps = React.ComponentProps<"button"> & VariantProps<typeof button>;

const Button = twc.button<ButtonProps>(({ intent }) => button({ intent }));

render(<Button intent="secondary">Press me</Button>);
