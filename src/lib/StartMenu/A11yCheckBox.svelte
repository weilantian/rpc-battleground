<script>
  import { createEventDispatcher } from "svelte";
  import { fly } from "svelte/transition";
  import checkMarkIcon from "../../assets/checkmark.svg";

  export let selected;

  const dispatch = createEventDispatcher();

  const onToggleSelect = () => {
    dispatch("toggle");
  };
</script>

<button aria-pressed={selected} on:click={onToggleSelect}>
  <span
    style="background-color:{selected ? 'white' : 'transparent'}"
    class="checkbox"
  >
    {#if selected}
      <img
        src={checkMarkIcon}
        alt="check mark"
        transition:fly={{ y: 10, duration: 300 }}
        class="checked"
      />
    {/if}
  </span> Enable Voiceover Mode</button
>

<style lang="scss">
  button {
    display: flex;
    align-items: center;
    background: none;
    border: none;
    color: white;
    cursor: pointer;
    font-weight: 700;
  }
  .checkbox {
    border-radius: 8px;
    margin-right: 12px;
    width: 28px;
    height: 28px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 2px solid #fff;
    > .checked {
      display: block;

      width: 16px;
      height: 16px;
    }
  }
</style>
