<script>
  import rockIcon from "../../assets/icons/icon-rock-sm.svg";
  import paperIcon from "../../assets/icons/icon-paper-sm.svg";
  import scissorsIcon from "../../assets/icons/icon-scissors-sm.svg";
  import { fly } from "svelte/transition";
  /**
   * @type {"rock" | "paper" | "scissors"}
   */
  export let decision;
  /**
   * @type {boolean} */
  export let show;
</script>

{#if show}
  <div transition:fly={{ x: 0, y: 60 }} class="container">
    {#if decision === "rock"}
      <img alt="rock" src={rockIcon} />
    {:else if decision === "paper"}
      <img alt="paper" src={paperIcon} />
    {:else if decision === "scissors"}
      <img alt="scissors" src={scissorsIcon} />
    {/if}
  </div>
{/if}

<style lang="scss">
  @use "../../styles/colors";
  .container {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 52px;
    height: 52px;
    border-radius: 32px;
    border: 3px solid colors.$secondary;
    background-color: colors.$primary;
  }

  img {
    width: 32px;
    height: 32px;
  }
</style>
