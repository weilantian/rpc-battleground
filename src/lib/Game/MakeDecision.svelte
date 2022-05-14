<script>
  let detectedGesture = "";
  let webcam;
  export let service;
  import { tweened } from "svelte/motion";
  import { cubicOut } from "svelte/easing";
  import useGestureDetection from "./logic/useGestureDetection";
  import { onMount } from "svelte";
  import { onDestroy, subscribe } from "svelte/internal";
  const bottom = tweened(-300, {
    duration: 1200,
    easing: cubicOut,
  });

  const { detectedGestureStore, startGestureDetection, stopGestureDetection } =
    useGestureDetection();
  onMount(() => {
    startGestureDetection(webcam);
  });
  const unsuscribe = subscribe(detectedGestureStore, (gesture) => {
    detectedGesture = gesture;
  });

  onDestroy(() => {
    unsuscribe();
    stopGestureDetection();
  });

  service.onTransition((state) => {
    if (state.matches("makeDecision")) {
      bottom.set(60);
    } else {
      bottom.set(-300);
    }
  });
</script>

<div style:bottom="{$bottom}px" class="modal">
  <h1>Make Your Move!</h1>
  <div class="container">
    <div style="width: 320px;" bind:this={webcam} class="webcam" />
    <div class="move">{detectedGesture}</div>
  </div>
</div>

<style lang="scss">
  @use "../../styles/colors";
  h1 {
    display: block;
    text-align: center;
    margin-bottom: 30px;
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
    padding: 120px 70px;
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
