<script>
  /** @type {"default"|"primary"} */
  export let varients = "default";
</script>

<button class:primary={varients === "primary"} on:click>
  <slot />
</button>

<style lang="scss">
  @use "../../styles/colors";
  @use "../../styles/typography";
  @use "../../styles/utils" as *;
  button {
    cursor: pointer;
    margin-top: em(24);

    color: white;
    border: 4px solid colors.$secondary;
    @include typography.heading-font;
    min-width: em(250);
    padding: em(16) em(20);
    font-size: em(24);
    background-color: transparent;
    border-radius: 24px;
    &:hover {
      color: darken(white, 20%);
    }
  }
  .primary {
    background-color: colors.$secondary;
    &:hover {
      background-color: darken(colors.$secondary, 10%);
    }
  }
</style>
