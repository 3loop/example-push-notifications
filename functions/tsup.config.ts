import {
  defineConfig
} from "tsup";

const isWatchMode = process.argv.includes("--watch");

export default defineConfig({
  clean: !isWatchMode,
  dts: true,
  bundle: true,
  format: ["esm"],
  target: "node16",
  external: [
    "@google-cloud/functions-framework",
    "@google-cloud/pubsub",
    "cors",
    "firebase-admin",
    "firebase-functions"
  ],
  entry: [
    "src/index.ts"
  ],
  outDir: "lib",
});