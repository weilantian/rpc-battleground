<script>
  //This file defines the interface and the logic of the game startmenu.
  import { blur } from "svelte/transition";
  import { createEventDispatcher } from "svelte";

  import Button from "./Button.svelte";
  import A11yCheckBox from "./A11yCheckBox.svelte";
  import GameModeSwitcher from "./GameModeSwitcher.svelte";

  let gameMode = "webcam";

  const dispatch = createEventDispatcher();

  let voiceOverEnabled = false;

  const handleNewGameButtonClicked = () => {
    dispatch("startGame", {
      voiceOverEnabled,
      mouseKeyboardInput: gameMode === "mouse",
    });
  };
</script>

<div transition:blur={{ amount: 10 }} class="home__wrapper">
  <div role="menu" class="home">
    <h1 class="home__title">Rock Paper Scissors Battleground</h1>
    <div class="home__button-group">
      <A11yCheckBox
        selected={voiceOverEnabled}
        on:toggle={() => (voiceOverEnabled = !voiceOverEnabled)}
      />
      <GameModeSwitcher
        on:toggle={(e) => (gameMode = e.detail.gameMode)}
        {gameMode}
      />
      <Button on:click={handleNewGameButtonClicked} varients="primary"
        >START</Button
      >
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
