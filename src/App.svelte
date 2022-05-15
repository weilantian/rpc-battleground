<script>
  import { interpret } from "xstate";

  import Game from "./lib/Game/Game.svelte";
  import gameState from "./lib/Game/logic/gameState";

  import StartMenu from "./lib/StartMenu/StartMenu.svelte";
  // This variable defines weather the game has been started

  const gameService = interpret(gameState, { devTools: true }).start();
</script>

<main>
  {#if $gameService.matches("startMenu")}
    <!-- Only show the StartMenu when the game is started -->
    <StartMenu on:startGame={() => gameService.send("START")} />
  {:else}
    <!-- Show the game -->
    <Game {gameService} />
  {/if}
</main>

<style lang="scss" global>
  @use "./styles/global";
</style>
