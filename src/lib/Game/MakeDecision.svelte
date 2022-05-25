<!-- This is a very important component in the game, as it is where gesture detection with webcam happens.
  It is visually rendered as a pop-up window asking for user input using the webcam.
 -->
<script>
  /* 
  All the gesture detection logic are extracted to a separate javascript file called useGestureDetection.js,
  which is located in the logic folder.
  */
  import useGestureDetection from "./logic/useGestureDetection";

  /* tweened is a function provided by svelte, 
  which help me to build slick user interface that use animation
  to communicate changes.
  https://svelte.dev/tutorial/tweened
  */
  import { tweened } from "svelte/motion";
  // CubicOut is chosen as the easing for the motion
  import { cubicOut } from "svelte/easing";
  import { onMount } from "svelte";

  /*
  Is that like magic? The ValueBar made for displaying 
  the HP and streak is also used to visually showing 
  the time left for the user to make decision.
  */
  import ValueBar from "./ValueBar.svelte";
  import { speak } from "./logic/voiceOver";

  // The fly transition is used to animated the gesture indicator.
  import { fly } from "svelte/transition";

  /* 
  The icons for indicates the gesture detected, they are the same images 
  used as the gesture choices buttons in mouse and keyboard more.
  */
  import scissorsIcon from "../../assets/scissors-btn.png";
  import rockIcon from "../../assets/rock-btn.png";
  import paperIcon from "../../assets/paper-btn.png";

  export let service;

  /*
  The webcam variable is bind to a div element, which is the element designed
  to display what the webcam sees.
  */
  let webcam;

  // This variable defines the 'bottom' value of the css of the pop-up.
  const bottom = tweened(-410, {
    duration: 1200,
    easing: cubicOut,
  });

  // We deconstruct everything defined in the gestureDetection.js
  const {
    detectedGesture,
    modalLoaded,
    startGestureDetection,
    stopGestureDetection,
  } = useGestureDetection();

  onMount(() => {
    // When this pop-up is mounted, tell the gesture detector to start the gesture detection.
    startGestureDetection(webcam);
  });

  /* 
  Total counts defines how many sec is given to the user to think 
  about the decision they are going to made in a round.
  */
  let totalCounts = 5;
  // The counts defines how many sec left for the user to make a move.
  let count = 5;

  // The interval will be set to the interval which runs decreaseCount function each sec.
  let interval;

  /* 
  These two variables marks if the user who enabled voiceover mode are verbally given specific information.
  So they won't need to hear the same thing during each round over and over again.
  */
  let gameStartedReported = false;
  let gestureIsClearReported = false;

  /*
  This function is hooked to the interval, which will be run one sec at a time.
  During each run, the count will be decreased and if there is no count left for user to make the decision,
  destroy the interval to stop the time and avoid the cause of memory leak. 

  If there is no count left, it will also notifies the game state service to tell other component we are heading to the
  "showDecision" phase of the game.
  */
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

  /*
  onTransition function listens the transition in the phase of the state in the state machine.
  */
  service.onTransition((state) => {
    if (state.matches("makeDecision")) {
      /*
    If the phase is makeDecision, the pop-up will be animated to raise from 
    the bottom the screen by setting the value for the tweened variable.
    */
      bottom.set(60);

      /*
      The user will be give more time to think about the next move the are going to make during the first two rounds.
      They will be given less time in the future round to make the game rolling faster.
      */
      count = totalCounts = $service.context.rounds > 1 ? 3 : 5;

      /*
      If the user enables the voiceover mode feature, they will be given more time to make their move as they will
      be spending more time to understand the game rules by hearing information read out by the speechSynthesis.
      */
      if ($service.context.voiceOverEnabled) {
        if ($service.context.rounds == 0) {
          count = totalCounts = 15;
        } else {
          count = totalCounts = 10;
        }
      }

      /* As being said, the decreaseCount will be run 1sec at a time, 
      until the time is up for the user to make the decision.
      */
      interval = setInterval(decreaseCount, 1000);

      /*
      The voiceover will read out in the beginning of each round of the game that is time for the user to make their move.
      */
      if (
        state.context.voiceOverEnabled &&
        $modalLoaded &&
        $service.context.rounds > 0
      ) {
        speak(
          "It's another round. Show you decision by presenting your hand gesture. "
        );
      }
      return;
    }
    // If we are currently not in the phase of asking for user input, set the tweened value to -410 to hide the pop-up.
    bottom.set(-410);
  });

  /*
      When the game has started as the modal for gesture detection has been successfully loaded,
      the voiceover will read out 
       */
  $: {
    if (
      $modalLoaded &&
      !gameStartedReported &&
      $service.context.voiceOverEnabled
    ) {
      gameStartedReported = true;
      speak(
        "The game has now started. Show you decision by presenting your hand gesture, rock, paper or scissors."
      );
    }
  }

  /*
  For some users, it might be hard to know if their hand is positioned in the webcam. That's why when a gesture input
  is detected for the first time, they will be receiving a verbal notice.
  */
  $: {
    if (
      service.state.value === "makeDecision" &&
      service.state.context.voiceOverEnabled &&
      $detectedGesture &&
      !gestureIsClearReported
    ) {
      gestureIsClearReported = true;
      speak(
        `Awesome, the website see you hand clearly, hold your hand and make your decision in 5 seconds.`
      );
    }
  }
</script>

<!-- Bind the value of the bottom variable to the bottom variable of the style of the pop-up. -->
<div style:bottom="{$bottom}px" class="modal">
  <h1>Make Your Move!</h1>
  <!-- The count will be showing in this p tag, using {} syntax of Svelte to 
    dynamically render the value of the count overtime the count changes
  -->
  <p>In {count}</p>

  <!-- Calculate the position of the element indicates the time left by using the 
    value of count divided by totalCounts then multiply by 100. -->
  <div style="width: 320px;margin:0 auto;">
    <ValueBar progress={(count / totalCounts) * 100} />
  </div>

  <div class="container">
    <div style="width: 320px;height:180px;" class="webcam">
      <!-- The webcam image input renderer will be injected in this div. -->

      <div
        bind:this={webcam}
        style=" display:{$modalLoaded ? 'block' : 'none'}"
      />

      <!-- After the modal for gesture detection is loaded, these text which 
        indicates the modal is loading will be replaced by the webcam input. -->
      <div class="loading">
        <h3>Please wait!</h3>
        <p>Loading Gesture Detector...</p>
      </div>
    </div>

    <div class="move">
      <!-- Present the icon which represents which gesture is detected with proper animation.
        It is achieved by using the if else syntax of Svelte as well as the transition helpers.
       -->
      {#if $detectedGesture === "rock"}
        <img
          in:fly={{ duration: 400, x: -20 }}
          draggable="false"
          src={rockIcon}
          alt="Pick Rock"
        />
      {:else if $detectedGesture === "paper"}
        <img
          in:fly={{ duration: 400, x: -20 }}
          draggable="false"
          src={paperIcon}
          alt="Pick Paper"
        />
      {:else if $detectedGesture === "scissors"}
        <img
          in:fly={{ duration: 400, x: -20 }}
          draggable="false"
          src={scissorsIcon}
          alt="Pick Scissors"
        />
      {/if}
      {$detectedGesture}
    </div>
  </div>
</div>

<style lang="scss">
  @use "../../styles/colors";
  .move {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-right: 32px;
  }
  h1,
  p {
    display: block;
    text-align: center;
  }

  img {
    width: 120px;
    height: 120px;
  }
  .loading {
    flex-direction: column;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .modal {
    /*
    Fix the pop-up window in the centering it at the bottom of the window.
    It is always a research proposition regards to centering elements using the CSS.

    I usually center fixed element in CSS by setting the position to fixed, left and top to 50%,
    and uses the transform translate to move the element 50% of its width and 50% of its height.
    */
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
