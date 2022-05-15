<script>
  import playerImage from "../../assets/player.png";
  import monsterImage from "../../assets/monster.png";
  import gsap from "gsap";
  import DecisionIndicator from "./DecisionIndicator.svelte";
  import { onDestroy, onMount } from "svelte";
  export let service;
  let monster;
  let player;
  let distanceBetweenPlayerAndMonster = 0;
  service.onTransition((state) => {
    if (state.matches("showDecision")) {
      setTimeout(() => {
        if ($service.context.tie) {
          service.send("TIE");
          return;
        }
        service.send("ATTACK");
      }, 2000);
    } else if (state.matches("attack")) {
      if ($service.context.winner === "player") {
        gsap
          .timeline({
            onComplete: () => {
              service.send("FINISH_ATTACK");
            },
          })
          .to(player, {
            duration: 0.5,
            x: distanceBetweenPlayerAndMonster,
          })
          .to(monster, { duration: 0.1, repeat: 5, yoyo: true, x: "-=20" })
          .to(player, {
            duration: 0.5,
            x: 0,
          });

        return;
      }
      gsap
        .timeline({
          onComplete: () => {
            service.send("FINISH_ATTACK");
          },
        })
        .to(monster, {
          duration: 0.5,
          x: -distanceBetweenPlayerAndMonster,
        })
        .to(player, { duration: 0.1, repeat: 5, yoyo: true, x: "-=20" })
        .to(monster, {
          duration: 0.5,
          x: 0,
        });
    }
  });

  const calculateDistanceBetweenCharacters = () => {
    const playerX = player.getBoundingClientRect().x;
    const monsterX = monster.getBoundingClientRect().x;
    distanceBetweenPlayerAndMonster = Math.abs(playerX - monsterX);
  };

  onMount(calculateDistanceBetweenCharacters);
</script>

<svelte:window on:resize={calculateDistanceBetweenCharacters} />

<div class="battleground">
  <div class="player__container">
    <DecisionIndicator
      show={$service.matches("showDecision")}
      decision={$service.context.playerDecision}
    />
    <img bind:this={player} class="player" alt="" src={playerImage} />
  </div>
  <div class="monster__container">
    <DecisionIndicator
      show={$service.matches("showDecision")}
      decision={$service.context.cpuDecision}
    />
    <img bind:this={monster} class="monster" alt="" src={monsterImage} />
  </div>
</div>

<style lang="scss">
  .battleground {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 80vw;
    left: 50%;
    transform: translateX(-50%);
    position: fixed;
    bottom: 120px;
  }

  .player {
    width: 198px;
    object-fit: contain;
    &__container {
      position: relative;
    }
  }

  .monster {
    width: 268px;
    object-fit: contain;
    &__container {
      position: relative;
    }
  }
</style>
