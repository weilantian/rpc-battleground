<script>
  import playerImage from "../../assets/player.png";
  import monsterImage from "../../assets/monster.png";
  export const attackMonster = () => {
    alert("Monster attcked");
  };
</script>

<div class="battleground">
  <div class="player__container">
    <img class="player" alt="" src={playerImage} />
  </div>
  <div class="monster__container">
    <img class="monster" alt="" src={monsterImage} />
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
