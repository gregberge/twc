/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from "react";
import { clsx } from "clsx";
import { Slot } from "@radix-ui/react-slot";

export { clsx as cx };

type AbstractCompose = (...params: any) => any;

type ResultProps<
  TComponent extends React.ElementType,
  TProps,
  TExtraProps,
  TCompose extends AbstractCompose,
> = TProps extends undefined
  ? TExtraProps extends undefined
    ? Omit<React.ComponentProps<TComponent>, "className"> & {
        className?: Parameters<TCompose>[0];
      }
    : Omit<React.ComponentProps<TComponent>, "className"> & {
        className?: Parameters<TCompose>[0];
      } & TExtraProps
  : TProps;

type Template<
  TComponent extends React.ElementType,
  TCompose extends AbstractCompose,
  TExtraProps,
  TParentProps = undefined,
> = <TProps = TParentProps>(
  strings:
    | TemplateStringsArray
    | ((
        props: ResultProps<TComponent, TProps, TExtraProps, TCompose>,
      ) => "className" extends keyof TProps
        ? TProps["className"]
        : Parameters<TCompose>[0]),
  ...values: any[]
) => React.ForwardRefExoticComponent<
  ResultProps<TComponent, TProps, TExtraProps, TCompose>
>;

type ElementTagName = Exclude<
  keyof HTMLElementTagNameMap | keyof SVGElementTagNameMap,
  "set"
>;

type FirstLevelTemplate<
  TComponent extends React.ElementType,
  TCompose extends AbstractCompose,
  TExtraProps,
> = Template<TComponent, TCompose, TExtraProps> & {
  attrs: <TProps = undefined>(
    attrs:
      | Record<string, any>
      | ((
          props: ResultProps<TComponent, TProps, TExtraProps, TCompose>,
        ) => Record<string, any>),
  ) => Template<TComponent, TCompose, TExtraProps, TProps>;
};

type Twc<TCompose extends AbstractCompose> = (<T extends React.ElementType>(
  component: T,
) => FirstLevelTemplate<T, TCompose, undefined>) & {
  [Key in ElementTagName]: FirstLevelTemplate<
    Key,
    TCompose,
    { asChild?: boolean }
  >;
};

type ShouldForwardProp = (prop: string) => boolean;

export type TwcComponentProps<
  TComponent extends React.ElementType,
  TCompose extends AbstractCompose = typeof clsx,
> = ResultProps<TComponent, undefined, { asChild?: boolean }, TCompose>;

export type Config<TCompose extends AbstractCompose> = {
  /**
   * The compose function to use. Defaults to `clsx`.
   */
  compose?: TCompose;
  /**
   * The function to use to determine if a prop should be forwarded to the
   * underlying component. Defaults to `prop => prop[0] !== "$"`.
   */
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

type Attributes = Record<string, any> | ((props: any) => Record<string, any>);

export const createTwc = <TCompose extends AbstractCompose = typeof clsx>(
  config: Config<TCompose> = {},
) => {
  const compose = config.compose || clsx;
  const shouldForwardProp =
    config.shouldForwardProp || ((prop) => prop[0] !== "$");
  const wrap = (Component: React.ElementType) => {
    const createTemplate = (attrs?: Attributes) => {
      const template = (
        stringsOrFn: TemplateStringsArray | Function,
        ...values: any[]
      ) => {
        const isClassFn = typeof stringsOrFn === "function";
        const tplClassName =
          !isClassFn && String.raw({ raw: stringsOrFn }, ...values);
        return React.forwardRef((p: any, ref) => {
          const { className: classNameProp, asChild, ...rest } = p;
          const rp =
            typeof attrs === "function" ? attrs(p) : attrs ? attrs : {};
          const fp = filterProps({ ...rp, ...rest }, shouldForwardProp);
          const Comp = asChild ? Slot : Component;
          const resClassName = isClassFn ? stringsOrFn(p) : tplClassName;
          return (
            <Comp
              ref={ref}
              className={
                typeof resClassName === "function"
                  ? (renderProps: any) =>
                      compose(
                        resClassName(renderProps),
                        typeof classNameProp === "function"
                          ? classNameProp(renderProps)
                          : classNameProp,
                      )
                  : compose(resClassName, classNameProp)
              }
              {...fp}
            />
          );
        });
      };

      if (attrs === undefined) {
        template.attrs = (attrs: Attributes) => {
          return createTemplate(attrs);
        };
      }

      return template;
    };

    return createTemplate();
  };

  return new Proxy(
    (component: React.ComponentType) => {
      return wrap(component);
    },
    {
      get(_, name) {
        return wrap(name as keyof JSX.IntrinsicElements);
      },
    },
  ) as any as Twc<TCompose>;
};

export const twc = createTwc();
