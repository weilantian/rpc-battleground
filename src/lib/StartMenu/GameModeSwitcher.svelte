<script>
  import mouseIcon from "../../assets/mouse.svg";
  import webcamIcon from "../../assets/webcam.svg";
  import { fly } from "svelte/transition";
  import { createEventDispatcher } from "svelte";

  export let gameMode;

  const dispatch = createEventDispatcher();

  const toggleGameMode = () => {
    gameMode = gameMode === "mouse" ? "webcam" : "mouse";
    dispatch("toggle", { gameMode });
  };
</script>

<button
  id="toggle-game-mode"
  on:click={toggleGameMode}
  class="switcher"
  role="switch"
  aria-label="Enable webcam gesture dection"
  aria-checked={gameMode === "webcam"}
>
  GameMode <div class="wrapper">
    <div
      role="radio"
      tabindex="-1"
      data-value="Mouse"
      style="padding-left: 12px;margin-right:12px"
      class="item"
      class:selected={gameMode === "mouse"}
    >
      <img src={mouseIcon} alt="" />
      {#if gameMode === "mouse"}
        <span>Mouse</span>
      {/if}
    </div>
    <div
      role="radio"
      tabindex="0"
      data-value="Webcam"
      class="item"
      class:selected={gameMode === "webcam"}
    >
      <img src={webcamIcon} alt="" />
      {#if gameMode === "webcam"}
        <span>Webcam</span>
      {/if}
    </div>
  </div></button
>

<style lang="scss">
  @use "../../styles/colors";
  @use "../../styles/typography";
  .item {
    display: flex;
    align-items: center;
  }
  .selected {
    border-radius: 18px;
    background-color: colors.$secondary;
    padding: 12px 26px;
  }
  .switcher {
    cursor: pointer;
    @include typography.heading-font;
    background-color: transparent;
    border: none;
    color: white;
    display: flex;
    align-items: center;
    margin-top: 18px;
  }
  .wrapper {
    width: 220px;
    display: flex;
    align-items: center;
    margin-left: 24px;
    border: 4px solid colors.$secondary;
    border-radius: 24px;
  }
</style>
