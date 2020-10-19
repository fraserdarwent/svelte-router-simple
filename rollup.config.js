import svelte from "rollup-plugin-svelte";
export default {
  input: "src/tests.js",
  output: {
    file: "dist/tests.js",
    format: "cjs",
  },
  plugins: [svelte()],
};
