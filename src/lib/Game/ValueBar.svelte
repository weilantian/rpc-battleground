<!-- This component is used to visualize numerals values like 
  the hit points of the characters as well as used to indicates how many times the
  user have before their detected gesture will be captured in each round.
-->
<script>
  /**
   * The color of the value bar
   * @type {"yellow" | "red"}
   * */
  export let barColor = "red";

  /**
   * The value of the bar
   * (the bar will be filled if it is set to 100, will be left empty if it is set to 0)
   */
  export let progress = 0;

  /**
   * The aliment of the bar can be specified, as this component can
   * wrap a icon which can be positioned and left or right,
   * this property will specify wether the icon will be situated at left or the right
   * side of the bar.
   * @type {"left" | "right"} */
  export let alignment = "left";
</script>

<!-- it is another syntactic sugar of Svelte, you can use style:<css-variable> syntax to dynamically
  set the value of a css variable, and the variable can be used among style tag.
   -->
<div
  style:--flex-direction={alignment === "right" ? "row-reverse" : "row"}
  class="wrapper"
>
  <slot />
  <div class="bar">
    <!-- The styling of a element also can be dynamically update based on the variable defined. -->
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
