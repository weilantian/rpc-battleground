import { createMachine } from "xstate";

const gameState = createMachine(
  {
    id: "game",
    initial: "countDown",
    context: {
      playerStats: {
        hp: 100,
        streak: 0,
      },
      cpuStats: {
        hp: 100,
        streak: 0,
      },
      playerDecision: "",
      cpuDecision: "",
      tie: false,
      winner: "",
    },
    states: {
      countDown: {
        on: {
          MAKE_DECISION: {
            target: "makeDecision",
            actions: () => {
              console.log("makeDecision");
            },
          },
        },
      },
      makeDecision: {
        on: {
          SHOW_DECISION: {
            target: "showDecision",
            actions: (context, event) => {
              context.playerDecision = event.decision;
              //Decision can be rock, paper, scissors, make a random decision
              const randomDecision = Math.floor(Math.random() * 3);
              context.cpuDecision = ["rock", "paper", "scissors"][
                randomDecision
              ];

              // Check if is a tie
              if (context.playerDecision === context.cpuDecision) {
                context.tie = true;
                return;
              }

              context.tie = false;

              //Check if the player won
              if (
                (context.playerDecision === "rock" &&
                  context.cpuDecision === "scissors") ||
                (context.playerDecision === "paper" &&
                  context.cpuDecision === "rock") ||
                (context.playerDecision === "scissors" &&
                  context.cpuDecision === "paper")
              ) {
                context.winner = "player";
                context.playerStats.streak++;
                context.cpuStats.streak = 0;
              } else {
                context.winner = "cpu";
                context.cpuStats.streak++;
                context.playerStats.streak = 0;
              }
            },
          },
        },
      },
      showDecision: {
        on: {
          TIE: "countDown",
          ATTACK: "attack",
        },
      },
      attack: {
        on: {
          FINISH_ATTACK: [
            {
              target: "countDown",
              cond: (context) => {
                if (context.winner === "player") {
                  if (context.playerStats.streak == 3) {
                    context.playerStats.hp += 10;
                    context.playerStats.streak = 0;
                    context.cpuStats.hp -= 40;
                  } else context.cpuStats.hp -= 30;
                } else {
                  if (context.cpuStats.streak == 3) {
                    context.cpuStats.hp += 10;
                    context.cpuStats.streak = 0;
                    context.playerStats.hp -= 40;
                  } else context.playerStats.hp -= 30;
                }

                return context.playerStats.hp > 0 && context.cpuStats.hp > 0;
              },
            },
            {
              target: "gameOver",
            },
          ],
        },
      },
      gameOver: {},
    },
  },
  {
    actions: {
      resetMatch: (context, event) => {
        context.tie = false;
        context.winner = "";
      },
    },
  }
);

export default gameState;
