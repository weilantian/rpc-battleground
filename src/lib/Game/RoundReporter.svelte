<script>
  import { fly } from "svelte/transition";
  export let service;
  let isShow = false;
  let text = "You win!";

  service.onTransition((state) => {
    if (state.value === "showDecision") {
      isShow = true;
      if (state.context.tie) {
        text = "Tie!";
      } else if (state.context.winner === "player") {
        text = "You win!";
      } else {
        text = "You lose!";
      }
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
