<script>
  import Game from "./lib/Game/Game.svelte";

  import StartMenu from "./lib/StartMenu/StartMenu.svelte";
  // This variable defines weather the game has been started
  let gameStarted = false;
</script>

<main>
  {#if !gameStarted}
    <!-- Only show the StartMenu when the game is started -->
    <StartMenu on:startGame={() => (gameStarted = true)} />
  {:else}
    <!-- Show the game -->
    <Game />
  {/if}
</main>

<style lang="scss" global>
  @use "./styles/global";
</style>
