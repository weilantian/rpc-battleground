<script>
  export let service;
  import { fade } from "svelte/transition";
  import playerImage from "../../assets/player.png";
  import monsterImage from "../../assets/monster.png";
  import Button from "../StartMenu/Button.svelte";
</script>

<div transition:fade>
  <h1>Game Over (￣▽￣)</h1>
  {#if $service.context.finalWinner === "player"}
    <p>You win!</p>
    <img class="character" alt="" src={playerImage} />
  {:else}
    <p>You loose!</p>
    <img class="character" alt="" src={monsterImage} />
  {/if}
  <Button on:click={() => service.send("RESET_GAME")}>Back to startmenu</Button>
</div>

<style lang="scss">
  @use "../../styles/colors";
  div {
    z-index: 20;
    justify-content: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: colors.$primary;
    position: fixed;
    width: 100vw;
    height: 100vh;
    left: 0;
    top: 0;
  }
  h1 {
    font-size: 48px;
  }
  p {
    margin-top: 12px;
    font-size: 26px;
  }

  .character {
    width: 240px;
    height: auto;
  }
</style>
