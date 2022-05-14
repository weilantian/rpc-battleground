<script>
  let count = 3;
  let interval;
  export let service;
  const decreaseCount = () => {
    count -= 1;
    if (count === 0) {
      clearInterval(interval);
      service.send("MAKE_DECISION");
    }
  };

  interval = setInterval(decreaseCount, 1000);
</script>

<div><h1>{count}</h1></div>
