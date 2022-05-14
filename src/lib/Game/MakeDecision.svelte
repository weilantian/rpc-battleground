<script>
  let webcam;
  export let service;
  import { tweened } from "svelte/motion";
  import { cubicOut } from "svelte/easing";
  import useGestureDetection from "./logic/useGestureDetection";
  import { onMount } from "svelte";
  import { onDestroy } from "svelte/internal";
  const bottom = tweened(-410, {
    duration: 1200,
    easing: cubicOut,
  });

  const {
    detectedGesture,
    modalLoaded,
    startGestureDetection,
    stopGestureDetection,
  } = useGestureDetection();
  onMount(() => {
    startGestureDetection(webcam);
  });

  onDestroy(() => {
    stopGestureDetection();
  });

  service.onTransition((state) => {
    if (state.matches("makeDecision")) {
      bottom.set(60);
    } else {
      bottom.set(-410);
    }
  });
</script>

<div style:bottom="{$bottom}px" class="modal">
  <h1>Make Your Move!</h1>
  <div class="container">
    <div style="width: 320px;height:180px;" class="webcam">
      <div
        bind:this={webcam}
        style=" display:{$modalLoaded ? 'block' : 'none'}"
      />

      <div class="loading">
        <h3>Please wait!</h3>
        <p>Loading Gesture Detector...</p>
      </div>
    </div>

    <div class="move">{$detectedGesture}</div>
  </div>
</div>

<style lang="scss">
  @use "../../styles/colors";
  h1 {
    display: block;
    text-align: center;
    margin-bottom: 30px;
  }
  .loading {
    flex-direction: column;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
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
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .webcam {
    border: 5px solid colors.$secondary;
    border-radius: 24px;
    overflow: hidden;
  }
</style>
