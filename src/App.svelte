<script>
  /*
  App.svelte is the root component of the game. 
  
  In Svelte, a component  consists the script,  layout and styling of a specific functional part of a website.
  It is defined in a .svelte file just like this one.

  XState is another really helpful library. 
  It allows me to defines all the expected phases and the logic during the transition between each phase of the game.

  I am not a state machine expert, but I know that
  state machine is something that game developer always use to track the game state in a game.

  XState brings state machine onto the web, and it works great with Svelte.
  */
  import { interpret } from "xstate";

  /*
  The gameState.js file contains the state machine defined for the game, this can be consider as
  the core of the whole game experience which defines nearly all the states of the game.

  Here I import the state machine from the gameState.js file.
  */
  import gameState from "./lib/Game/logic/gameState";

  /*
  Here, the Game component is imported from the Game.svelte file. 
  The Game component includes the stats board, battleground as well
  as the gesture detection modal of the game.
  */
  import Game from "./lib/Game/Game.svelte";

  /*
  The StartMenu component 
  */
  import StartMenu from "./lib/StartMenu/StartMenu.svelte";
  import How2Play from "./lib/StartMenu/How2Play/How2Play.svelte";
  // This variable defines weather the game has been started

  /*
  Uses XState's interpret function to wrap the state machine into a trackable service,
  all the components are able to track the changes of the context and states.
  It pass down to all the components as a 'single source of truth' to all the Svelte components.
  */
  const gameService = interpret(gameState, { devTools: true }).start();
</script>

<main>
  <!-- Add a dollar sign($) at the beginning of a variable tells the Svelte to
   re-run the code containing this variable when the value changes.

   In this example, if the currently state of the game is not startMenu,
   the html will be rerendered, the StartMenu component will be mounted
   and at the same time the Game component will be mounted.

   {#if} ... {/if} is a Svelte specific syntax. It bring the if else syntax from javascript to the DOM. 

   As stated in the Svelte tutorial:

   "HTML doesn't have a way of expressing logic, like conditionals and loops. Svelte does.
   To conditionally render some markup, we wrap it in an if block."

   https://svelte.dev/tutorial/if-blocks
   -->

  <How2Play
    service={gameService}
    isShow={$gameService.matches("showingTutorial")}
  />

  {#if $gameService.matches("startMenu") || $gameService.matches("showingTutorial")}
    <StartMenu
      on:showManual={() => gameService.send("TUTORIAL")}
      on:startGame={(e) =>
        gameService.send({
          type: "START",
          voiceOverEnabled: e.detail.voiceOverEnabled,
          mouseKeyboardInput: e.detail.mouseKeyboardInput,
        })}
    />
  {:else}
    <Game {gameService} />
  {/if}
</main>

<!-- A warning will show up in user's browser if the width of the browser is insufficient for the game experience   -->
<div class="insufficient-width-warning">
  <p>This game experience requires more space to work properly.</p>
</div>

<style lang="scss" global>
  @use "./styles/global";
  @use "./styles/colors";
  .insufficient-width-warning {
    display: none;
    position: fixed;
    z-index: 999;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: colors.$secondary;
    transition: all 0.4s;
  }

  /* 
  The warning modal implements CSS's media query to show the 
  warning only when the screen is smaller than 1100px.
   */
  @media (max-width: 1100px) {
    .insufficient-width-warning {
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
</style>
