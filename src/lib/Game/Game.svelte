<!-- 
This is the main Game component, it holds the statsboards of the game,
The component for showing the count during the countdown,
the battleground which renders the game characters.

The pop-up asking user's decition in each round will showing up in this component.
 -->
<script>
  /* 
  Svelte built in transution imported from the svelte package, when adding this to the "transition"
  attribute in a html element, a transition animation will be added when this component is mounted 
  (i.e. the if-else syntax which contains this component satstified required conditions.)
  */
  import { fade } from "svelte/transition";

  // Import all the compoennts which will be used.
  import StatsBoard from "./StatsBoard.svelte";
  import BattleGround from "./BattleGround.svelte";
  import CountDown from "./CountDown.svelte";
  import MakeDecision from "./MakeDecision.svelte";
  import GameOver from "./GameOver.svelte";

  // Import all the images which will be used;
  import monsterAvatar from "../../assets/monster-avatar.png";
  import RoundReporter from "./RoundReporter.svelte";
  import MakeDecisionMouse from "./MakeDecisionMouse.svelte";

  // The gameService will be passed down from the App.svelte.
  export let gameService;
</script>

<!-- When the game is over, mount the 
  GameOver component which renders the winner of the game. -->
{#if $gameService.matches("gameOver")}
  <GameOver service={gameService} />
{/if}

<!-- The RoundReporter will render a h1 tag which indicates the stats of each round. -->
<RoundReporter service={gameService} />

<div transition:fade class="game">
  <div class="stats-board-container">
    <!-- The stats of the player as well as the competitor will be showing in Statsboard component.
      Specify the aligenment of the statsboard to oranize the infos in a tindy manner.
     -->
    <StatsBoard
      name="You"
      streak={($gameService.context.playerStats.streak / 3) * 100}
      hp={$gameService.context.playerStats.hp}
      alignment="left"
    />
    <StatsBoard
      avatarImg={monsterAvatar}
      name="CPU"
      streak={($gameService.context.cpuStats.streak / 3) * 100}
      hp={$gameService.context.cpuStats.hp}
      alignment="right"
    />
  </div>

  <!-- Before each round begins, a countdown will taken place, which is made for 
    the auidence to prepare for making the decieition for the next round.
   -->
  {#if $gameService.matches("countDown")}
    <CountDown service={gameService} />
  {/if}

  <!-- 
    There is two types of pop-up modal asking for auidnce's decition in each round.
    If user choosed to play the game with thier mouse and keyboard, the modal which asking for mouse input will shows up,
    otherwise, the modal which will detects auidence's gesture as decition input will show up.
   -->
  <BattleGround service={gameService} />
  {#if !$gameService.context.mouseKeyboardInput}
    <MakeDecision service={gameService} />
  {:else}
    <MakeDecisionMouse service={gameService} />
  {/if}
</div>

<style lang="scss">
  /*
  The background of the game will fill the whole screen, 
  so that the width and height of the container is decided by the viewport.

  Specify background size to cover to let browser automatically 
  adjust the background image based on the screen size.
  */
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
