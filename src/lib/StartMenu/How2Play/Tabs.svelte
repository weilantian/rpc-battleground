<script>
  export let currentTab;
</script>

<div role="tablist" aria-orientation="horizontal" class="tabs">
  <button
    on:click={() => (currentTab = "rules")}
    class:tab--selected={currentTab === "rules"}
    aria-controls="tab-0"
    id="tab-0"
    tabindex="0"
    role="tab"
    aria-label="Page 1, Learn about the rules"
    class="tab"
  >
    <span class="circle" aria-hidden="true">1</span>
    Learn About The Rules</button
  >
  <button
    on:click={() => (currentTab = "howToPlay")}
    class:tab--selected={currentTab === "howToPlay"}
    aria-label="Page 2, How to play"
    aria-controls="tab-1"
    id="tab-1"
    tabindex="-1"
    role="tab"
    class="tab"
  >
    <span class="circle" aria-hidden="true">2</span>How To Play</button
  >
</div>

<style lang="scss">
  @use "../../../styles/colors";
  .tabs {
    margin-top: 12px;
    display: block;
    display: flex;
    gap: 24px;
  }

  .tab {
    &--selected {
      background-color: colors.$secondary;
    }
    cursor: pointer;
    padding: 8px 12px;
    background-color: colors.$primary;
    border-radius: 10px;
    border: 2px solid colors.$secondary;
    color: white;
    font-weight: 700;
    font-size: 20px;
  }

  .circle {
    font-size: 16px;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 24px;
    height: 24px;
    border: 2px solid white;
  }
</style>
