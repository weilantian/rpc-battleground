<script>
  export let type = "gestures";
  import gsap from "gsap";
  import scissorsBtn from "../../../assets/scissors-btn.png";
  import rockBtn from "../../../assets/rock-btn.png";
  import paperBtn from "../../../assets/paper-btn.png";

  import { onMount } from "svelte";

  onMount(() => {
    if (type === "gestures") {
      gsap
        .timeline({ repeat: -1 })
        .from(".gesture-icon", {
          opacity: 0,
          duration: 0.4,
          stagger: 0.2,
        })
        .to(".gesture-icon", {
          opacity: 0,
          duration: 0.4,
          stagger: 0.2,
        });
    }
  });
</script>

{#if type === "gestures"}
  <div class="gestures">
    <img class="gesture-icon" alt="rock" src={rockBtn} />
    <img class="gesture-icon" alt="paper" src={paperBtn} />
    <img class="gesture-icon" alt="Scissors" src={scissorsBtn} />
  </div>
{/if}

<style lang="scss">
  .gestures {
    > img {
      width: 128px;
      height: 128px;
    }
    justify-content: center;
    display: flex;
    align-items: center;
    gap: 24px;
  }
</style>
