<!-- The components contains the characters as well as the attacking animations of the game. -->
<script>
  /* Import the onMount hook from the svelte. the function passed in the 
  parametor of the onMount function will run once this component is mounted
  */
  import { onMount } from "svelte";

  // Import the image of the player and the monster from the assets folder.
  import playerImage from "../../assets/player.png";
  import monsterImage from "../../assets/monster.png";

  // I will be using gsap to build out a timeline which will animate the character
  import gsap from "gsap";

  /* 
  The DecitionIndicator component renders a small circular view with a icon in the center,
  which uses to indicates the decition in each round made by the cpu as well as thhe player
  */
  import DecisionIndicator from "./DecisionIndicator.svelte";

  // Import the state machine service from the parent component.
  export let service;

  // Defines the monster and player variables, which will be binded to the html elements of two characters.
  // This will make these to variables work as the refernece of the html elements.
  // i.e. monster === document.querySelector('.monster')
  let monster;
  let player;

  /**
   * Defines the relative distance between two characters on the battleground.
   * @type {number}
   */
  let distanceBetweenPlayerAndMonster = 0;

  service.onTransition((state) => {
    /*
    Once the phease of the game is 'showDecision',
    it will tells the state machine (based on the context which shows who won the game)
    to transition to the countDown phease if it is a tie,
    otherwise, transition to playing the attacking animation phease if not.
    */
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
        /* 
        If the player is considered the winner of the round, the animation timeline
        which animates the player character to attack the monster will be played.
        */

        /*
        --- Character attacking timeline ---
        1. Animate the position of the character to competitor's position
        2. Animate the competitor to shake its body to show it is being attacked.
        3. Animate the position of the character back to the original position.

        TIPS: html element binding can be used as targets in gsap.
        */
        gsap
          .timeline({
            onComplete: () => {
              /*
               */
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

  /**
   * Calculate the distance between the two characters.
   */
  const calculateDistanceBetweenCharacters = () => {
    /*
        The distance will need to calculated because when animating, I want the character
        to move to exactly the position of the competitor/

        Use getBoundingClientRect function to access the position of player character
        and the monster character on x-axis.
    */
    const playerX = player.getBoundingClientRect().x;
    const monsterX = monster.getBoundingClientRect().x;

    /*
        Calculate the relative position between two characters,
        use Math.abs to make sure that the distance is always positive.
    */
    distanceBetweenPlayerAndMonster = Math.abs(playerX - monsterX);
  };

  // Run calculaueDistanceBetweenCharacters function on the component is mounted.
  onMount(calculateDistanceBetweenCharacters);
</script>

<!-- Call calculateDistanceBetweenCharacters when the window resizes.
  In svelte, all the window events can be accessed in svelte:window
  -->
<svelte:window on:resize={calculateDistanceBetweenCharacters} />

<div class="battleground">
  <div class="player__container">
    <!-- Show the decition made by the player -->
    <DecisionIndicator
      show={$service.matches("showDecision")}
      decision={$service.context.playerDecision}
    />
    <!--  Bind html to a variable in Svelte equilivent to document.querySelector(...) -->
    <img bind:this={player} class="player" alt="" src={playerImage} />
  </div>
  <div class="monster__container">
    <!-- Show the decition made by the competitor -->
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
