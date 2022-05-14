<script>
  //This file defines the interface and the logic of the game startmenu.
  import { blur } from "svelte/transition";
  import { createEventDispatcher } from "svelte";

  import Button from "./Button.svelte";

  const dispatch = createEventDispatcher();

  const handleNewGameButtonClicked = () => {
    dispatch("startGame");
  };
</script>

<div transition:blur={{ amount: 10 }} class="home__wrapper">
  <div class="home">
    <h1 class="home__title">Rock Paper Scissors Battleground</h1>
    <div class="home__button-group">
      <Button on:click={handleNewGameButtonClicked} varients="primary"
        >New Game</Button
      >
      <Button>Billboard</Button>
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
