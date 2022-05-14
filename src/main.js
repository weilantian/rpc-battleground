import App from "./App.svelte";
import "handsfree/build/lib/assets/handsfree.css";
import { inspect } from "@xstate/inspect";

if (process.env.NODE_ENV === "development") {
  inspect({
    // options
    // url: 'https://stately.ai/viz?inspect', // (default)
    iframe: false, // open in new window
  });
}

const app = new App({
  target: document.getElementById("app"),
});

export default app;
