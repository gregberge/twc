import * as React from "react";
import { clsx } from "clsx";
import { Slot } from "@radix-ui/react-slot";

type AbstractCompose = (...params: any) => string;

type ResultProps<
  TComponent extends React.ElementType,
  TProps,
  TExtraProps,
> = TProps extends undefined
  ? TExtraProps extends undefined
    ? React.ComponentProps<TComponent>
    : React.ComponentProps<TComponent> & TExtraProps
  : TProps;

type Template<
  TComponent extends React.ElementType,
  TCompose extends AbstractCompose,
  TExtraProps,
> = <TProps = undefined>(
  strings:
    | TemplateStringsArray
    | ((
        props: ResultProps<TComponent, TProps, TExtraProps>,
      ) => Parameters<TCompose>[0]),
  ...values: any[]
) => React.ComponentType<ResultProps<TComponent, TProps, TExtraProps>>;

type Twc<TCompose extends AbstractCompose> = (<T extends React.ElementType>(
  component: T,
) => Template<T, TCompose, undefined>) & {
  [Key in keyof HTMLElementTagNameMap]: Template<
    Key,
    TCompose,
    { asChild?: boolean }
  >;
};

type ShouldForwardProp = (prop: string) => boolean;

export type Config<TCompose extends AbstractCompose = typeof clsx> = {
  compose?: TCompose;
  shouldForwardProp?: ShouldForwardProp;
};

function filterProps(
  props: Record<string, any>,
  shouldForwardProp: ShouldForwardProp,
) {
  const filteredProps: Record<string, any> = {};
  const keys = Object.keys(props);
  for (let i = 0; i < keys.length; i++) {
    const prop = keys[i];
    if (shouldForwardProp(prop)) {
      filteredProps[prop] = props[prop];
    }
  }
  return filteredProps;
}

export const createTwc = <TCompose extends AbstractCompose>(
  config: Config<TCompose> = {},
) => {
  const compose = config.compose ?? clsx;
  const shouldForwardProp =
    config.shouldForwardProp ?? ((prop) => prop[0] !== "$");
  const template =
    (Component: React.ElementType) =>
    (stringsOrFn: TemplateStringsArray | Function, ...values: any[]) => {
      const isFn = typeof stringsOrFn === "function";
      const twClassName = isFn
        ? ""
        : String.raw({ raw: stringsOrFn }, ...values);
      return React.forwardRef((props: any, ref) => {
        const { className, asChild, ...rest } = props;
        const filteredProps = filterProps(rest, shouldForwardProp);
        const Comp = asChild ? Slot : Component;
        return (
          <Comp
            ref={ref}
            className={compose(
              isFn ? stringsOrFn(props) : twClassName,
              className,
            )}
            {...filteredProps}
          />
        );
      });
    };

  return new Proxy(
    (component: React.ComponentType) => {
      return template(component);
    },
    {
      get(_, name) {
        return template(name as keyof JSX.IntrinsicElements);
      },
    },
  ) as any as Twc<TCompose>;
};

export const twc = createTwc();
