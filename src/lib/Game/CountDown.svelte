<script>
  export let service;

  let count = 4;
  let interval;

  const decreaseCount = () => {
    count -= 1;
    if (count === 0) {
      clearInterval(interval);
      service.send("MAKE_DECISION");
    }
  };

  interval = setInterval(decreaseCount, 400);
</script>

<div><h1>{count}</h1></div>

<style>
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
