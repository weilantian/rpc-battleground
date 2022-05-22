import { createMachine } from "xstate";

const gameState = createMachine(
  {
    id: "game",
    initial: "startMenu",

    on: {
      PAUSED: {
        target: "paused",
      },
    },

    context: {
      paused: false,
      voiceOverEnabled: false,
      rounds: 0,
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
      finalWinner: "",
    },
    states: {
      paused: {},
      startMenu: {
        on: {
          START: {
            target: "countDown",
            actions: (context, event) => {
              context.voiceOverEnabled = event.voiceOverEnabled;
            },
          },
        },
      },
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
          STOP_GAME: {
            target: "gameOver",
          },
          SHOW_DECISION: {
            target: "showDecision",
            actions: (context, event) => {
              context.rounds++;
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
                    context.playerStats.hp = clampValue(
                      context.playerStats.hp,
                      10,
                      100
                    );
                    context.playerStats.streak = 0;

                    context.cpuStats.hp = clampValue(
                      context.cpuStats.hp,
                      40,
                      0,
                      true
                    );
                  } else
                    context.cpuStats.hp = clampValue(
                      context.cpuStats.hp,
                      30,
                      0,
                      true
                    );
                } else {
                  if (context.cpuStats.streak == 3) {
                    context.playerStats.hp = clampValue(
                      context.playerStats.hp,
                      10,
                      100
                    );
                    context.cpuStats.streak = 0;

                    context.playerStats.hp = clampValue(
                      context.playerStats.hp,
                      40,
                      0,
                      true
                    );
                  } else
                    context.playerStats.hp = clampValue(
                      context.playerStats.hp,
                      30,
                      0,
                      true
                    );
                }

                return context.playerStats.hp > 0 && context.cpuStats.hp > 0;
              },
            },
            {
              target: "gameOver",
              actions: (context) => {
                if (context.playerStats.hp <= 0) {
                  context.finalWinner = "cpu";
                } else if (context.cpuStats.hp <= 0) {
                  context.finalWinner = "player";
                }
              },
            },
          ],
        },
      },
      gameOver: {
        on: {
          RESET_GAME: {
            target: "resetGame",
            actions: () => location.reload(),
          },
        },
      },
      resetGame: {},
    },
  },
  {
    actions: {
      resetMatch: (context, event) => {
        context.tie = false;
        context.winner = "";
        context.playerStats.hp = 100;
        context.cpuStats.hp = 100;
        context.playerStats.streak = 0;
        context.cpuStats.streak = 0;
        context.rounds = 0;
      },
    },
  }
);

const clampValue = (current, value, clamp, decrease) => {
  if (decrease) {
    if (current - value < clamp) return clamp;
    return current - value;
  } else {
    if (current + value > clamp) return clamp;
    return current + value;
  }
};

export default gameState;
