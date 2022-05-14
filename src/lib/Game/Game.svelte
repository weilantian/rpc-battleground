<script>
  import { interpret } from "xstate";
  import { fade } from "svelte/transition";
  import { onMount } from "svelte";
  import { onDestroy, setContext, subscribe } from "svelte/internal";

  import useGestureDetection from "./logic/useGestureDetection";
  import StatsBoard from "./StatsBoard.svelte";
  import BattleGround from "./BattleGround.svelte";
  import gameState from "./logic/gameState";
  import CountDown from "./CountDown.svelte";
  import MakeDecision from "./MakeDecision.svelte";
  let debugWindow;

  let battleground;

  const gameService = interpret(gameState, { devTools: true }).start();

  const gameContext = $gameService.context;
</script>

<div transition:fade class="game">
  <div class="stats-board-container">
    <StatsBoard
      name="You"
      streak={gameContext.playerStats.streak}
      hp={gameContext.playerStats.hp}
      alignment="left"
    />
    <StatsBoard
      name="CPU"
      streak={gameContext.cpuStats.streak}
      hp={gameContext.cpuStats.hp}
      alignment="right"
    />
  </div>
  <CountDown service={gameService} />
  <BattleGround bind:this={battleground} />
  <MakeDecision service={gameService} />
  <div style="width: 300px; height: 300px" bind:this={debugWindow} />
</div>

<style lang="scss">
  .game {
    width: 100vw;
    height: 100vh;
    background-image: url("../../assets/background.png");
    background-repeat: no-repeat;
    background-size: cover;
  }
  .stats-board-container {
    padding: 36px 26px;

    /*
    Wraps the two stats board of the monster and the player in a gird layout.
    As there are two stats board, I define the template-columns to be 2, each has one
    fraction unit maximum.
     */
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));

    // Separate the stats board to position at left and right side of the screen.
    justify-content: space-between;

    // Let the stats boards stays at the top of the screen.
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
  }
</style>
