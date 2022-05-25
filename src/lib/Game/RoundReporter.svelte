<!-- This component shows the result of each round -->
<script>
  import { fly } from "svelte/transition";
  export let service;
  let isShow = false;
  let text = "";
  service.onTransition((state) => {
    /*
    When the phase of the game is "showDecision", 
    the div will be animated to appear on center of the screen of the user.
    */
    if (state.value === "showDecision") {
      isShow = true;
      /*
      The text which shows the result of the game will be set based on the 
      winner computed in the action defines in the state machine.
      */
      if (state.context.tie) {
        text = "Tie!";
      } else if (state.context.winner === "player") {
        text = "You win!";
      } else {
        text = "You lose!";
      }
      /*
      Hide the div 2 secs after it has been shown.
      */
      setTimeout(() => (isShow = false), 2000);
    }
  });
</script>

{#if isShow}
  <h1 transition:fly={{ y: 30, duration: 800 }}>
    {text}
  </h1>
{/if}

<style lang="scss">
  h1 {
    font-size: 64px;
    font-weight: 800;
    font-style: italic;
    position: fixed;
    text-align: center;
    top: 50%;
    color: white;
    left: 50%;
    transform: translate(-50%, -50%);
  }
</style>
