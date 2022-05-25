<!-- The stats board component works to visualize the stats of the warrior controlled by the player 
  as well as the monster controlled by the cpu 
-->
<script>
  import hpIcon from "../../assets/icon-hp.svg";
  import streakIcon from "../../assets/icon-streak.svg";

  // Import the value bar to visualize the HP of the characters as well the streaks they made.
  import ValueBar from "./ValueBar.svelte";

  /**
   * There will be two stats board in total in the game UI, one for the player and another for the cpu.
   * To group all the stats information together, the alignment of the widgets
   * in the stats board can be specified.
   * @type {"left"|"right"}
   * */
  export let alignment = "left";

  /**
   * The current HP of the character which the stats will be showing
   * @type {number}
   */
  export let hp = 0;

  /**
   * The current made by the character whose stats will be visualize in this stats board.
   * @type {number}
   */
  export let streak = 0;

  /**
   * The name of the character whose stats will be visualize in this stats board.
   * @type {string}
   */
  export let name;

  /**
   * The avatar image of the character whose stats will be visualize in this stats board.
   * @type {string}
   */
  export let avatarImg;
</script>

<div class="stats-board">
  <!-- Dynamically updates the CSS variable value using Svelte's syntactic sugar -->
  <div
    style:--stats-board-flex-direction={alignment === "right"
      ? "row-reverse"
      : "row"}
    class="stats-board__container"
  >
    <div class="avatar__wrapper">
      <!-- The alt tag is bind to the name variable, so that the screen reader users know
        it is the avatar image of which character.
       -->
      <img src={avatarImg} class="avatar" alt={`the avatar of ${name}`} />
    </div>
    <!-- 
     The alignment of the element is reflected on their styles, as the styles are bind to the
     alignment variables.
     -->
    <div
      style="margin-left: {alignment === 'left' ? 18 : 0}px;
        margin-right: {alignment === 'right' ? 18 : 0}px"
      class="stats-board__group"
    >
      <p style:--alignment={alignment} class="stats-board__name">{name}</p>
      <ValueBar {alignment} progress={hp}>
        <img src={hpIcon} alt="Heart Value" />
      </ValueBar>
    </div>
  </div>
  <div style="margin-top: 22px">
    <ValueBar {alignment} barColor="yellow" progress={streak}>
      <img src={streakIcon} alt="Heart Value" />
    </ValueBar>
  </div>
</div>

<style lang="scss">
  @use "../../styles/colors";
  .stats-board {
    &__name {
      font-weight: bold;
      text-align: var(--alignment);
    }
    background-color: fade-out(colors.$primary, 0.2);
    justify-self: center;
    width: 480px;
    border-radius: 32px;
    padding: 30px 30px;

    &__container {
      flex-direction: var(--stats-board-flex-direction);
      display: flex;
      align-items: center;
    }

    &__group {
      flex: 1;

      width: 100%;
    }
  }

  .avatar {
    &__wrapper {
      overflow: hidden;
      border-radius: 16px;
      width: 64px;
      height: 64px;
      background-color: colors.$secondary;
    }
  }
</style>
