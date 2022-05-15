<script>
  import { fade } from "svelte/transition";
</script>

<div transition:fade>Game Over</div>

<style lang="scss">
  @use "../../styles/colors";
  div {
    z-index: 20;
    justify-content: center;
    display: flex;
    align-items: center;
    background-color: colors.$primary;
    position: fixed;
    width: 100vw;
    height: 100vh;
    left: 0;
    top: 0;
  }
</style>
