import { swc } from "rollup-plugin-swc3";
import ts from "rollup-plugin-ts";

const swcPlugin = swc({
  tsconfig: false,
  jsc: {
    parser: {
      syntax: "typescript",
    },
    target: "es2018",
  },
});

const tsPlugin = ts({ transpiler: "swc" });

const ignoreRelative = (id) => !/^[./]/.test(id);

const buildEs = ({
  input = "src/index.tsx",
  output = "dist/index.mjs",
  external = ignoreRelative,
} = {}) => ({
  input,
  external,
  output: {
    file: output,
    format: "es",
  },
  plugins: [swcPlugin],
});

const buildTypes = ({
  input = "src/index.tsx",
  output = "dist/index.d.ts",
  external = ignoreRelative,
} = {}) => ({
  input,
  external,
  output: {
    file: output,
    format: "es",
  },
  plugins: [tsPlugin],
});

export default [buildEs(), buildTypes()];
