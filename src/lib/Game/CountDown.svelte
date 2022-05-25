<!--
  This component will be mount every time before each round started, to start a countdown.
-->
<script>
  export let service;

  let count = 4;
  let interval;

  const decreaseCount = () => {
    count -= 1;
    if (count === 0) {
      // When the count reaches 0, tells the state machine to transition to 'makeDecision' phase.
      clearInterval(interval);
      service.send("MAKE_DECISION");
    }
  };

  // Use set interval function to decrease count each 400ms.
  interval = setInterval(decreaseCount, 400);
</script>

<div><h1>{count}</h1></div>

<style>
  /*
  Position the count down indicator in the center of the screen.
  */
  div {
    display: flex;
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    width: 100vw;
    height: 100vh;
    justify-content: center;
    align-items: center;
    text-align: center;
    font-size: 5em;
  }
</style>
