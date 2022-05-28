<script>
  import { fly, fade } from "svelte/transition";
  import Button from "../Button.svelte";
  import Demos from "./Demos.svelte";
  import Tabs from "./Tabs.svelte";
  export let service;
  export let isShow;
  let currentTab = "rules";

  import successAttack from "../../../assets/videos/successAttack.mp4";
  import gestureDetection from "../../../assets/videos/gestureDetection..mp4";

  import enableCamera from "../../../assets/enableCamera.png";

  import correctExampleImg from "../../../assets/correct-example.png";
  import incorrectExampleImg from "../../../assets/incorrect-example.png";
</script>

{#if isShow}
  <div
    role="dialog"
    class="wrapper how2play"
    transition:fly={{ duration: 600, y: 80 }}
  >
    <h1>Quick Start Manual</h1>

    <Tabs bind:currentTab />

    <div class="body">
      {#if currentTab === "rules"}
        <div transition:fade class="rules-container">
          <Demos />
          <p>
            You will be controlling the warrior competing with the monster
            (controls by CPU) by playing the rock-paper-scissor game.
          </p>
          <video muted controls autoplay loop src={successAttack} />
          <p>
            The one who won in a round will made their success to attack the
            competitor. And if you won three times in a row during rounds, you
            will be able to attack the competitor and causing significant
            damage.
          </p>
        </div>
      {:else}
        <div transition:fade class="how-to-play-container">
          <img src={enableCamera} alt="Allow thr web page access the webcam" />
          <p>Guess what, you can play the game without mouse and keyboard.</p>
          <video controls muted autoplay loop src={gestureDetection} />
          <p>
            The game knows the move you want to make after you show gesture in
            front of the webcam. When the modal shows up, make your move by
            showing hand gesture.
          </p>

          <div class="example-wrapper">
            <img
              class="example-img"
              alt="Correct gesture example, the hand is perpendicular to the view"
              src={correctExampleImg}
            />
            <img
              class="example-img"
              alt="Incorrect example, the hand is not perpendicular to the view"
              src={incorrectExampleImg}
            />
          </div>

          <p>
            IMPORTANT: Make sure your hand is perpendicular to the webcam when
            showing the gesture.
          </p>
        </div>
      {/if}
    </div>

    <div class="button-group">
      {#if currentTab === "rules"}
        <Button on:click={() => service.send("BACK")}>Close</Button>
        <Button on:click={() => (currentTab = "howToPlay")} variant="primary"
          >Next</Button
        >
      {:else}
        <Button on:click={() => (currentTab = "rules")}>Back</Button>
        <Button on:click={() => service.send("START")} variant="primary"
          >Start the game!</Button
        >{/if}
    </div>
  </div>
{/if}

<style lang="scss">
  @use "../../../styles/colors";
  .wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    border-radius: 20px;
    height: 98vh;
    width: 80vw;
    position: fixed;
    z-index: 20;
    left: 50%;
    padding: 46px;
    top: 50%;
    transform: translate(-50%, -50%);
    background-color: colors.$primary;
    border: 3px solid colors.$secondary;
  }

  .body {
    text-align: center;
    padding: 24px 0;
    width: 100%;
    height: 100%;
    flex: 1;
    overflow-y: scroll;
  }

  .button-group {
    display: flex;
    gap: 24px;
  }

  p {
    display: block;

    width: 680px;
    margin: 38px auto;
  }

  video,
  img {
    margin: 0 auto;
    height: auto;
    width: 420px;
  }

  .example-wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12px;

    > .example-img {
      margin: 0 !important;
      width: 260px !important;
      height: 260px !important;
    }
  }
</style>
