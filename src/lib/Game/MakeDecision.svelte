<script>
  import { tweened } from "svelte/motion";
  import { cubicOut } from "svelte/easing";
  import useGestureDetection from "./logic/useGestureDetection";
  import { onMount } from "svelte";
  import ValueBar from "./ValueBar.svelte";
  import { speak } from "./logic/voiceOver";

  export let service;

  let webcam;

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
  let totalCounts = 5;
  let count = 5;
  let interval;
  let gameStartedReported = false;
  let gestureIsClearReported = false;

  const decreaseCount = () => {
    if (!$modalLoaded) {
      return;
    }
    count -= 1;
    if (count === 0) {
      clearInterval(interval);
      service.send({ type: "SHOW_DECISION", decision: $detectedGesture });
    }
  };

  service.onTransition((state) => {
    if (state.matches("makeDecision")) {
      bottom.set(60);

      count = totalCounts = $service.context.rounds > 1 ? 3 : 5;
      if ($service.context.voiceOverEnabled) {
        if ($service.context.rounds == 0) {
          count = totalCounts = 15;
        } else {
          count = totalCounts = 10;
        }
      }

      interval = setInterval(decreaseCount, 1000);

      if (
        state.context.voiceOverEnabled &&
        $modalLoaded &&
        $service.context.rounds > 0
      ) {
        speak(
          "It's another round. Show you decition by presenting your hand gesture. "
        );
      }
      return;
    }
    bottom.set(-410);
  });

  $: {
    if (
      $modalLoaded &&
      !gameStartedReported &&
      $service.context.voiceOverEnabled
    ) {
      gameStartedReported = true;
      speak(
        "The game has now started. Show you decition by presenting your hand gesture, rock, paper or scissors."
      );
    }
  }

  $: {
    if (
      service.state.value === "makeDecision" &&
      service.state.context.voiceOverEnabled &&
      $detectedGesture &&
      !gestureIsClearReported
    ) {
      gestureIsClearReported = true;
      speak(
        `Awesome, the website see you hand clearly, hold your hand and make your decition in 5 seconds.`
      );
    }
  }
</script>

<div style:bottom="{$bottom}px" class="modal">
  <h1>Make Your Move!</h1>
  <p>In {count}</p>
  <div style="width: 320px;margin:0 auto;">
    <ValueBar progress={(count / totalCounts) * 100} />
  </div>

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
  h1,
  p {
    display: block;
    text-align: center;
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
    margin-top: 30px;
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
