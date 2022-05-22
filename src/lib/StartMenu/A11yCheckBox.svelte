<script>
  import { createEventDispatcher } from "svelte";

  export let selected;

  const dispatch = createEventDispatcher();

  const onToggleSelect = () => {
    dispatch("toggle");
  };
</script>

<button on:click={onToggleSelect}>
  <span style:--checkbox-display={selected ? "block" : "none"} /> Enable Voiceover</button
>

<style lang="scss">
  button {
    display: flex;
    align-items: center;
  }
  span {
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px solid #fff;
    &::after {
      content: "";
      display: var(--checkbox-display);
      background-color: rgb(108, 108, 108);
      width: 18px;
      height: 18px;
    }
  }
</style>
