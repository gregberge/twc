import { describe, expect, test, beforeEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { cva, VariantProps } from "class-variance-authority";
import { twc, createTwc } from "./index";
import * as React from "react";
import { twMerge } from "tailwind-merge";

describe("twc", () => {
  beforeEach(cleanup);

  test("specifies the accurate tag", () => {
    const Title = twc.h1`text-xl`;
    render(<Title>Title</Title>);
    const title = screen.getByText("Title");
    expect(title).toBeDefined();
    expect(title.tagName).toBe("H1");
    expect(title.classList.contains("text-xl")).toBe(true);
  });

  test("allows to pass props", () => {
    const Title = twc.h1`text-xl`;
    render(<Title data-foo="bar">Title</Title>);
    const title = screen.getByText("Title");
    expect(title).toBeDefined();
    expect(title.dataset.foo).toBe("bar");
  });

  test("merges classes", () => {
    const Title = twc.h1`text-xl`;
    render(<Title className="font-medium">Title</Title>);
    const title = screen.getByText("Title");
    expect(title).toBeDefined();
    expect(title.classList.contains("text-xl")).toBe(true);
    expect(title.classList.contains("font-medium")).toBe(true);
  });

  test("accepts clsx classes", () => {
    const Title = twc.h1`text-xl`;
    render(<Title className={["font-medium"]}>Title</Title>);
    const title = screen.getByText("Title");
    expect(title).toBeDefined();
    expect(title.classList.contains("text-xl")).toBe(true);
    expect(title.classList.contains("font-medium")).toBe(true);
  });

  test("accepts additional props", () => {
    type TitleProps = { children: React.ReactNode; className?: string };
    const Title = twc.h1<TitleProps>`text-xl`;
    render(
      // title should still be a valid prop as its inherited from h1
      <Title className="font-medium" title="x">
        Title
      </Title>,
    );
    const title = screen.getByText("Title");
    expect(title).toBeDefined();
    expect(title.classList.contains("text-xl")).toBe(true);
    expect(title.classList.contains("font-medium")).toBe(true);
  });

  test("accepts custom components", () => {
    const CustomTitle = React.forwardRef(
      (
        props: { className?: string },
        ref: React.ForwardedRef<HTMLHeadingElement>,
      ) => (
        <h1 ref={ref} {...props}>
          Custom Title
        </h1>
      ),
    );
    const Title = twc(CustomTitle)`text-xl`;
    const dummyRef = () => {};
    render(<Title ref={dummyRef} className="font-medium" />);
    const title = screen.getByText("Custom Title");
    expect(title).toBeDefined();
    expect(title.tagName).toBe("H1");
    expect(title.classList.contains("text-xl")).toBe(true);
    expect(title.classList.contains("font-medium")).toBe(true);
  });

  test("accepts a function to define className", () => {
    type Props = {
      size: "sm" | "lg";
      children: React.ReactNode;
    };
    const Title = twc.h1<Props>((props) => ({
      "text-xl": props.size === "lg",
      "text-sm": props.size === "sm",
    }));
    render(<Title size="sm">Title</Title>);
    const title = screen.getByText("Title");
    expect(title).toBeDefined();
    expect(title.tagName).toBe("H1");
    expect(title.classList.contains("text-sm")).toBe(true);
  });

  test("works with cva", () => {
    const buttonVariants = cva(["font-semibold", "border", "rounded"], {
      variants: {
        $intent: {
          primary: ["bg-blue-500", "text-white"],
          secondary: ["bg-white", "text-gray-800"],
        },
      },
      defaultVariants: {
        $intent: "primary",
      },
    });

    type ButtonProps = React.ComponentProps<"button"> &
      VariantProps<typeof buttonVariants>;

    const Button = twc.button<ButtonProps>(({ $intent }) =>
      buttonVariants({ $intent }),
    );

    render(
      <Button $intent="secondary" className="foo">
        Press me
      </Button>,
    );
    const title = screen.getByText("Press me");
    expect(title).toBeDefined();
    expect(title.tagName).toBe("BUTTON");
    expect(title.getAttribute("$intent")).toBe(null);
    expect(title.classList.contains("bg-white")).toBe(true);
    expect(title.classList.contains("text-gray-800")).toBe(true);
  });

  test('works with "asChild" prop', () => {
    const Title = twc.h1`text-xl`;
    render(
      <Title asChild>
        <h2>Title</h2>
      </Title>,
    );
    const title = screen.getByText("Title");
    expect(title).toBeDefined();
    expect(title.tagName).toBe("H2");
    expect(title.classList.contains("text-xl")).toBe(true);
  });

  test("works with cva and asChild", () => {
    const titleVariants = cva("text-xl", {
      variants: {
        $intent: {
          primary: ["font-extrabold"],
          secondary: ["font-bold"],
        },
      },
      defaultVariants: {
        $intent: "primary",
      },
    });

    type TitleProps = React.ComponentProps<"h1"> &
      VariantProps<typeof titleVariants>;

    const Title = twc.button<TitleProps>(({ $intent }) =>
      titleVariants({ $intent }),
    );

    render(
      <Title $intent="secondary" asChild>
        <h2>Title</h2>
      </Title>,
    );
    const title = screen.getByText("Title");
    expect(title).toBeDefined();
    expect(title.tagName).toBe("H2");
    expect(title.getAttribute("$intent")).toBe(null);
    expect(title.classList.contains("text-xl")).toBe(true);
    expect(title.classList.contains("font-bold")).toBe(true);
  });

  test("works with tailwind-merge", () => {
    const twx = createTwc({
      compose: twMerge,
    });

    const Title = twx.h1`font-bold`;

    render(<Title className="font-medium">Title</Title>);
    const title = screen.getByText("Title");
    expect(title).toBeDefined();
    expect(title.classList.contains("font-medium")).toBe(true);
    expect(title.classList.contains("font-bold")).toBe(false);
  });
});
