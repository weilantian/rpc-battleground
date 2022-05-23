<script>
  import scissorsBtn from "../../assets/scissors-btn.png";
  import rockBtn from "../../assets/rock-btn.png";
  import paperBtn from "../../assets/paper-btn.png";
  import { tweened } from "svelte/motion";
  import { cubicOut } from "svelte/easing";

  export let service;

  const bottom = tweened(-410, {
    duration: 1200,
    easing: cubicOut,
  });

  service.onTransition((state) => {
    if (state.matches("makeDecision")) {
      bottom.set(60);
      return;
    }
    bottom.set(-410);
  });

  const makeDecition = (move) => {
    service.send({ type: "SHOW_DECISION", decision: move });
  };
</script>

<div role="dialog" style:bottom="{$bottom}px" class="modal">
  <h1>Make Your Move!</h1>
  <p id="describion">Please pick a move:</p>
  <div class="container">
    <button on:click={() => makeDecition("rock")} type="button">
      <img draggable="false" src={rockBtn} alt="Pick Rock" />
    </button>
    <button on:click={() => makeDecition("paper")} type="button">
      <img draggable="false" src={paperBtn} alt="Pick Paper" />
    </button>
    <button on:click={() => makeDecition("scissors")} type="button">
      <img draggable="false" src={scissorsBtn} alt="Pick Scissors" />
    </button>
  </div>
</div>

<style lang="scss">
  @use "../../styles/colors";
  button,
  img {
    background-color: transparent;
    border: none;
    cursor: pointer;
  }

  img {
    width: 120px;
    height: 120px;
    &:hover {
      opacity: 0.5;
    }
  }
  .modal {
    display: flex;
    flex-direction: column;
    justify-content: center;
    transform: translateX(-50%);
    position: fixed;
    display: flex;
    left: 50%;

    width: 60vw;
    padding: 68px 70px;
    background-color: colors.$primary;
    border: 5px solid colors.$secondary;

    border-radius: 24px;
  }

  .container {
    margin-top: 32px;
    display: flex;
    justify-content: space-between;
  }

  h1,
  p {
    display: block;
    text-align: center;
  }
</style>
