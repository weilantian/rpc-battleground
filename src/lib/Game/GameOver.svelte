<!-- This component will show the result after the game is ended. -->
<script>
  export let service;
  import { fade } from "svelte/transition";
  import Button from "../StartMenu/Button.svelte";
</script>

<div class="wrapper" transition:fade>
  <div class="container">
    <h1>Game Over</h1>
    <!-- Render text based on the winner of the game -->
    {#if $service.context.finalWinner === "player"}
      <p class="text">You win!</p>
    {:else}
      <p class="text">You loose!</p>
    {/if}
    <!-- When the user pressed the Back to start menu, 
      tell the state machine service to reset the game 
      (currently is done by refreshing the page) 
    -->
    <Button on:click={() => service.send("RESET_GAME")}
      >Back to StartMenu</Button
    >
  </div>
</div>

<style lang="scss">
  @use "../../styles/colors";
  .text {
    font-size: 64px;
  }
  .wrapper {
    > .container {
      height: 420px;
      justify-content: space-between;
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 20;
    background-color: colors.$primary;
    position: fixed;
    width: 100vw;
    height: 100vh;
    left: 0;
    top: 0;
  }
  h1 {
    font-size: 38px;
  }
  p {
    margin-top: 12px;
    font-size: 26px;
  }
</style>
