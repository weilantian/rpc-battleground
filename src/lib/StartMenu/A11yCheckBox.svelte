<!-- The checkbox component to let the user 
  choose if they would like to enable voiceover mode-->
<script>
  import { fly } from "svelte/transition";
  import checkMarkIcon from "../../assets/checkmark.svg";

  /*
  This variables stores weather the checkbox is checked, 
  this is bind to the 'voiceOverEnabled' variable in the App.svelte.
  */
  export let selected;

  const onToggleSelect = () => {
    selected = !selected;
  };
</script>

<!-- Here, it set the role attribute of the element to a switch, 
  so that the screen reader will read out this element as a switcher element 
  which can be checked or unchecked.

  The aria checked attribute is dynamically set base on wether the checkbox has been checked.
  So that the user will notified when the switcher has been toggled, 
-->
<button role="switch" aria-checked={selected} on:click={onToggleSelect}>
  <!-- The checkbox will be having a white background which will reflects it has been selected -->
  <span
    style="background-color:{selected ? 'white' : 'transparent'}"
    class="checkbox"
  >
    <!-- A check mark will be presented when the checkbox is being checked -->
    {#if selected}
      <img
        aria-hidden="true"
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
