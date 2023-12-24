import { describe, expect, test, beforeEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { cva, VariantProps } from "class-variance-authority";
import { twc, createTwc, TwcComponentProps } from "./index";
import * as React from "react";
import { twMerge } from "tailwind-merge";
import {
  Button as AriaButton,
  ButtonProps as AriaButtonProps,
} from "react-aria-components";

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

  test("supports attrs", () => {
    const Checkbox = twc.input.attrs({ type: "checkbox" })`text-xl`;
    render(<Checkbox data-testid="checkbox" />);
    const checkbox = screen.getByTestId("checkbox");
    expect(checkbox).toBeDefined();
    expect(checkbox.getAttribute("type")).toBe("checkbox");
  });

  test("supports attrs from props", () => {
    const Checkbox = twc.input.attrs<{ $type?: string }>((props) => ({
      type: props.$type || "checkbox",
      "data-testid": "checkbox",
    }))`text-xl`;
    render(<Checkbox />);
    const checkbox = screen.getByTestId("checkbox");
    expect(checkbox).toBeDefined();
    expect(checkbox.getAttribute("type")).toBe("checkbox");

    cleanup();

    render(<Checkbox $type="radio" />);
    const radio = screen.getByTestId("checkbox");
    expect(radio).toBeDefined();
    expect(radio.getAttribute("type")).toBe("radio");
  });

  test("complex attrs support", () => {
    type LinkProps = TwcComponentProps<"a"> & { $external?: boolean };

    // Accept an $external prop that adds `target` and `rel` attributes if present
    const Link = twc.a.attrs<LinkProps>((props) =>
      props.$external ? { target: "_blank", rel: "noopener noreferrer" } : {},
    )`appearance-none size-4 border-2 border-blue-500 rounded-sm bg-white`;

    render(
      <Link $external href="https://example.com">
        My link
      </Link>,
    );
    const link = screen.getByText("My link");
    expect(link).toBeDefined();
    expect(link.getAttribute("target")).toBe("_blank");
    expect(link.getAttribute("rel")).toBe("noopener noreferrer");
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

  test("accepts custom props", () => {
    type TitleProps = { children: React.ReactNode; className?: string };
    const Title = twc.h1<TitleProps>`text-xl`;
    render(
      // @ts-expect-error `title` is not a valid prop
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
    const button = cva(["font-semibold", "border", "rounded"], {
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
      VariantProps<typeof button>;

    const Button = twc.button<ButtonProps>(({ $intent }) =>
      button({ $intent }),
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

  test("works with render props", () => {
    const Button = twc(AriaButton)<AriaButtonProps>(
      (props) => (renderProps) =>
        props["aria-pressed"] || renderProps.isPressed
          ? "bg-gray-700"
          : "bg-gray-500",
    );

    render(
      <Button
        aria-pressed
        isDisabled
        className={(p) => (p.isDisabled ? "opacity-35" : "")}
      >
        Press me
      </Button>,
    );
    const button = screen.getByText("Press me");
    expect(button).toBeDefined();
    expect(button.classList.contains("bg-gray-700")).toBe(true);
    expect(button.classList.contains("opacity-35")).toBe(true);
  });
});
