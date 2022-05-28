<!-- The is the widget for user to choose 
  wether they want to play the game using a webcam or
  with mouse and keyboard.
-->
<script>
  import mouseIcon from "../../assets/mouse.svg";
  import webcamIcon from "../../assets/webcam.svg";

  export let gameMode;

  // When the button is clicked, toggle the gameMode.
  const toggleGameMode = () => {
    gameMode = gameMode === "mouse" ? "webcam" : "mouse";
  };
</script>

<!-- The button is used to toggle between two modes, which works like a switch. 
  That's why the role of the button has been set to the switch. The aria-checked attributes
  will let the screen reader to read out wether the switch is toggled.
-->
<button
  id="toggle-game-mode"
  on:click={toggleGameMode}
  class="switcher"
  role="switch"
  aria-label="Enable webcam gesture decision"
  aria-checked={gameMode === "webcam"}
>
  GameMode <div class="wrapper">
    <!-- Screen readers users should only be able 
      to select the game mode by toggling the switch, 
      hence the elements inside the switch should be unseletcbale
      so that the user will be correctly guided to the switch element.

      Set the tabindex to -1, to make the inner element 
      unselective when using a screen reader -->
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
      tabindex="-1"
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
