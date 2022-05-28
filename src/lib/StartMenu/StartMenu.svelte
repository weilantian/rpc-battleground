<script>
  //This file defines the interface and the logic of the game start menu.
  import { blur } from "svelte/transition";
  import { createEventDispatcher } from "svelte";
  import Button from "./Button.svelte";
  import A11yCheckBox from "./A11yCheckBox.svelte";
  import GameModeSwitcher from "./GameModeSwitcher.svelte";
  import How2Play from "./How2Play/How2Play.svelte";

  /* 
  The default of the game mode is to play with a webcam,
  for those who don't have a webcam or would like to 
  play the game using keyboard and mouse they are still able to.
  This variable stores the mode of the game chosen by the player. 
  */
  let gameMode = "webcam";

  /*
  Utilizing the dispatch function allows me to dispatch a event to the parent component.
  */
  const dispatch = createEventDispatcher();

  /*
  The voiceover mode will be activated if is set to true.
  It is s special feature designed to given more detailed verbal information for someone who uses screen reader.
  */
  let voiceOverEnabled = false;

  /*
  When the user clicks the start button, the startGame event is 
  dispatched to the parent component App.svelte, when the App.svelte
  received the event, tell the state machine to start transition to "countDown" phase,
  which will cause side effect including for start menu fade away. 
  */
  const handleNewGameButtonClicked = () => {
    dispatch("startGame", {
      voiceOverEnabled,
      mouseKeyboardInput: gameMode === "mouse",
    });
  };
</script>

<!-- Use the blur transition to add a graceful information when the start menu exists -->
<div transition:blur={{ amount: 10 }} class="home__wrapper">
  <div role="menu" class="home">
    <h1 class="home__title">Rock Paper Scissors Battleground</h1>
    <div class="home__button-group">
      <!-- The checkbox made for users to decided if they would like to enable voiceover mode.-->
      <A11yCheckBox bind:selected={voiceOverEnabled} />
      <!-- The game mode switcher widget designed for users to 
        choose if they want to play the mode using mouse and keyboard -->
      <GameModeSwitcher bind:gameMode />
      <!-- The one of the only button for start the game -->
      <Button on:click={handleNewGameButtonClicked} variant="primary"
        >START</Button
      >
      <Button on:click={() => dispatch("showManual")}>Manual</Button>
    </div>
  </div>
</div>

<style lang="scss">
  @use "../../styles/typography";
  @use "../../styles/utils" as *;
  .home {
    max-width: 800px;
    display: flex;
    flex-direction: column;
    justify-content: center;

    &__wrapper {
      width: 100vw;
      height: 100vh;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    &__title {
      @include typography.heading-font;
      text-align: center;
      font-size: em(48);
    }

    &__button-group {
      flex-direction: column;
      display: flex;
      justify-content: center;
      align-items: center;
      margin-top: em(32);
    }
  }
</style>
