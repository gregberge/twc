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
import * as AccordionPrimitive from "@radix-ui/react-accordion";

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

  test("allows to pass extra props", () => {
    const Title = twc.div<{ $isHidden?: boolean }>(props => `
      ${props.$isHidden && "hidden"}
    `);
    render(<Title $isHidden aria-hidden="true">Title</Title>);
    const title = screen.getByText("Title");
    expect(title).toBeDefined();
    expect(title.classList.contains("hidden")).toBe(true);
    expect(title.getAttribute("aria-hidden")).toBe("true");
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
    type LinkProps = { $external?: boolean };

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
    const Title = twc.h1`text-xl`;
    render(
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
        props,
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

  test("accepts custom components with extra props", () => {
    const Link: React.FC<React.ComponentProps<"a">> = (props) => <a {...props}>Custom Link</a>;

    const StyledLink = twc(Link)<{ $isActive?: boolean }>((props) => `text-xl ${props.$isActive ? "underlined" : ""}`);
    render(<StyledLink href="https://example.com" $isActive className="font-medium" />);
    const link = screen.getByText("Custom Link");
    expect(link).toBeDefined();
    expect(link.tagName).toBe("A");
    expect(link.classList.contains("text-xl")).toBe(true);
    expect(link.classList.contains("font-medium")).toBe(true);
    expect(link.classList.contains("underlined")).toBe(true);
  });

  test("accepts a function to define className", () => {
    type Props = {
      $size: "sm" | "lg";
    };
    const Title = twc.h1<Props>((props) => ({
      "text-xl": props.$size === "lg",
      "text-sm": props.$size === "sm",
    }));
    render(<Title role="heading" $size="sm">Title</Title>);
    const title = screen.getByText("Title");
    expect(title).toBeDefined();
    expect(title.getAttribute("$size")).toBe(null);
    expect(title.tagName).toBe("H1");
    expect(title.classList.contains("text-sm")).toBe(true);
  });

  test("allows to customize transient props using array", () => {
    type Props = {
      xsize: "sm" | "lg";
    };
    const Title = twc.h1.transientProps(["xsize"])<Props>((props) => ({
      "text-xl": props.xsize === "lg",
      "text-sm": props.xsize === "sm",
    }));
    render(<Title xsize="sm">Title</Title>);
    const title = screen.getByText("Title");
    expect(title).toBeDefined();
    expect(title.getAttribute("xsize")).toBe(null);
    expect(title.tagName).toBe("H1");
    expect(title.classList.contains("text-sm")).toBe(true);
  });

  test("allows to customize transient props using function", () => {
    type Props = {
      xsize: "sm" | "lg";
    };
    const Title = twc.h1.transientProps((prop) => prop === "xsize")<Props>(
      (props) => ({
        "text-xl": props.xsize === "lg",
        "text-sm": props.xsize === "sm",
      }),
    );
    render(<Title xsize="sm">Title</Title>);
    const title = screen.getByText("Title");
    expect(title).toBeDefined();
    expect(title.getAttribute("xsize")).toBe(null);
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

    type ButtonProps = VariantProps<typeof button>;

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

  test("props are correctly typed", () => {
    const Accordion = twc(AccordionPrimitive.Root)<
      React.ComponentProps<typeof AccordionPrimitive.Root>
    >`py-2`;
    render(<Accordion type="single" collapsible></Accordion>);
  });

  test("allows svg", () => {
    const Svg = twc.svg`text-xl`;
    render(<Svg data-testid="svg" />);
    const svg = screen.getByTestId("svg");
    expect(svg).toBeDefined();
    expect(svg.tagName).toBe("SVG");
  });

  test("component props from attrs should respect provided transient props", () => {
    type ButtonProps = TwcComponentProps<"button"> & {
      variant: "primary" | "secondary";
    };
    const Button = twc.button
      .transientProps(["variant"])
      .attrs<ButtonProps>(({ type = "button", variant }) => {
        expect(variant).toBe("primary");
        return { type };
      })`text-xl`;
    render(<Button data-testid="button" variant="primary" />);

    const renderedButton = screen.getByTestId("button");
    expect(renderedButton.getAttribute("variant")).toBeNull();
  });
});
