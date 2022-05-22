import App from "./App.svelte";
import "handsfree/build/lib/assets/handsfree.css";
import { inspect } from "@xstate/inspect";

/*
This file is the entry point of the whole website. 🚀

The first version of the website was built using pure css, html and css . 🤔However, I noticed that
it is hard to reflect changes of the variable defined in javascript directly in the html dom. 

For example, when the player was attacked in the game, the UI elements that indicates the hit points (HP)
of the character should be updated and animated using complex javascript codes.
 
I found theSvelte framework extremely helpful for this project, as it automatically reflect 
the changes of variables in javascript in the dom.

This work like  🪄🪄magic, check this example.

https://svelte.dev/examples/reactive-declarations

Svelte also helps me to arrange reusable html chunks into components, so that I can split complex dom elements
into separate files📄📄, and defines the 🕹logic of that component as well as the 💅styling in the file.

This makes everything super clean and tidy.
*/

// Open the state machine debug panel if the website is running in a debug environment.
if (process.env.NODE_ENV === "development") {
  inspect({
    // options
    // url: 'https://stately.ai/viz?inspect', // (default)
    iframe: false, // open in new window
  });
}

// Mount the Svelte application onto the dom.
const app = new App({
  target: document.getElementById("app"),
});

export default app;
