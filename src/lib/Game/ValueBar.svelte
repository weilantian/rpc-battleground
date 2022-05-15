<script>
  /** @type {"yellow" | "red"} */
  export let barColor = "red";
  export let progress = 0;

  /** @type {"left" | "right"} */
  export let alignment = "left";
</script>

<div
  style:--flex-direction={alignment === "right" ? "row-reverse" : "row"}
  class="wrapper"
>
  <slot />
  <div class="bar">
    <div
      style:left={alignment === "left" ? "0" : "auto"}
      style:right={alignment === "right" ? "0" : "auto"}
      style:width="{progress}%"
      class:progress-yellow={barColor === "yellow"}
      class:progress-red={barColor === "red"}
      class="progress"
    />
  </div>
</div>

<style lang="scss">
  @use "../../styles/colors";
  .wrapper {
    flex-direction: var(--flex-direction);
    width: 100%;
    display: flex;
    align-items: center;
    margin-top: 8px;
  }

  .bar {
    position: relative;
    margin-left: 12px;
    margin-right: 12px;
    border-radius: 5px;
    background-color: colors.$ui-bar-bg;

    // Take up all the spaces in a flex container left by other elements.
    flex: 1;
    width: 100%;
    height: 30px;
  }

  .progress {
    /*
    The .hp-bar-progress indicates the value of the health. It is absolute positioned, relative
    to the position of the hp-bar, and has the same width. This allowing displaying percentage of
    the HP by setting the width.
     */
    position: absolute;
    border-radius: 5px;
    height: 30px;
    transition: width 0.2s ease-in-out;
  }

  .progress-yellow {
    background-color: colors.$yellow;
  }

  .progress-red {
    background-color: colors.$red;
  }
</style>
