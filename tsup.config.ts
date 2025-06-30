import { defineConfig } from "tsup";

export default defineConfig([
  {
    entry: ["src/index.tsx"],
    dts: true,
    external: ["react", "react-dom"],
    format: ["esm"],
  },
]);
