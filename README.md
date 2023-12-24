![TWC — Supercharge React + Tailwind](.github/assets/banner.png "TWC — Supercharge React + Tailwind")

<p align="center">
  <br/>
  <a href="https://react-twc.vercel.app">TWC</a> creates reusable React + Tailwind components in one line
  <br/><br/>
</p>

## Features

- ⚡️ Lightweight — only 0.46kb
- ✨ Autocompletion in all editors
- 🎨 Adapt the style based on props
- ♻️ Reuse classes with `asChild` prop
- 🦄 Work with all components
- 😎 Compatible with React Server Components
- 🚀 First-class `tailwind-merge` and `cva` support

<br/>

## Documentation

Visit our [official documentation](https://react-twc.vercel.app).

## Usage

**Without `twc`:**

```tsx
import * as React from "react";

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={clsx(
      "rounded-lg border bg-slate-100 text-white shadow-sm",
      className,
    )}
    {...props}
  />
));
```

**With `twc`:**

```tsx
import { twc } from "react-twc";

const Card = twc.div`rounded-lg border bg-slate-100 text-white shadow-sm`;
```

## Contributing

Feel like contributing? That's awesome! We have a
[contributing guide](https://github.com/gregberge/twc/blob/main/CONTRIBUTING.md) to help guide you.

### Want to help improve the docs?

The docsite lives in the [monorepo](./website/pages/docs/).

If you're interested in contributing to the documentation, check out the
[contributing guide](https://github.com/gregberge/twc/blob/main/CONTRIBUTING.md).

## Support

Having trouble? [Ping me on X](https://x.com/gregberge_)

## Acknowledgement

The development of TWC was only possible due to the inspiration and ideas from these amazing projects.

- [styled-components](https://styled-components.com) - where it all started

## License

MIT License © 2023-Present [Greg Bergé](https://github.com/gregberge)
