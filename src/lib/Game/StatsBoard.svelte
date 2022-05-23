<script>
  import hpIcon from "../../assets/icon-hp.svg";
  import streakIcon from "../../assets/icon-streak.svg";
  import playerAvatar from "../../assets/player-avatar.png";

  import ValueBar from "./ValueBar.svelte";

  /** @type {"left"|"right"} */
  export let alignment = "left";
  export let hp = 0;
  export let streak = 0;
  export let name;
  export let avatarImg = playerAvatar;
</script>

<div class="stats-board">
  <div
    style:--stats-board-flex-direction={alignment === "right"
      ? "row-reverse"
      : "row"}
    class="stats-board__container"
  >
    <div class="avatar__wrapper">
      <img src={avatarImg} class="avatar" alt="" />
    </div>
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
