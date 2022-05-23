import { createMachine } from "xstate";
import { speak } from "./voiceOver";

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
      mouseKeyboardInput: false,
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
              context.mouseKeyboardInput = event.mouseKeyboardInput;
            },
          },
        },
      },
      countDown: {
        on: {
          MAKE_DECISION: {
            target: "makeDecision",
            actions: (context) => {},
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
                if (context.voiceOverEnabled) {
                  speak(
                    `During this round, you and the monster both chose the ${context.cpuDecision}, it's a tie!`
                  );
                }
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

              if (context.voiceOverEnabled) {
                speak(
                  `You chose ${context.playerDecision} and the monster chose ${
                    context.cpuDecision
                  }, ${
                    context.winner === "player" ? "you" : "the monster"
                  } won!`
                );
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
                    context.playerStats.streak = 0;

                    context.cpuStats.hp = clampValue(
                      context.cpuStats.hp,
                      40,
                      0,
                      true
                    );

                    if (context.voiceOverEnabled) {
                      speak(
                        `You had won three rounds in a row, the monster lost 40 hp!, now the monster has ${context.cpuStats.hp} HP.`
                      );
                    }
                  } else
                    context.cpuStats.hp = clampValue(
                      context.cpuStats.hp,
                      30,
                      0,
                      true
                    );

                  if (context.voiceOverEnabled) {
                    speak(
                      `The monster lost 30 hp!, now the monster has ${context.cpuStats.hp} HP.`
                    );
                  }
                } else {
                  if (context.cpuStats.streak == 3) {
                    context.cpuStats.streak = 0;

                    context.playerStats.hp = clampValue(
                      context.playerStats.hp,
                      40,
                      0,
                      true
                    );

                    if (context.voiceOverEnabled) {
                      speak(
                        `Oh no, you had lost three rounds in a row, you lost 40 hp!, now you have ${context.playerStats.hp} HP.`
                      );
                    }
                  } else
                    context.playerStats.hp = clampValue(
                      context.playerStats.hp,
                      30,
                      0,
                      true
                    );

                  if (context.voiceOverEnabled) {
                    speak(
                      `You lost 30 hp!, now you have ${context.playerStats.hp} HP.`
                    );
                  }
                }

                return context.playerStats.hp > 0 && context.cpuStats.hp > 0;
              },
            },
            {
              target: "gameOver",
              actions: (context) => {
                if (context.playerStats.hp <= 0) {
                  context.finalWinner = "cpu";
                  if (context.voiceOverEnabled) {
                    speak(
                      `You lost all your HP, the monster won the game! Wish you luck next time!`
                    );
                  }
                } else if (context.cpuStats.hp <= 0) {
                  context.finalWinner = "player";
                  if (context.voiceOverEnabled) {
                    speak(
                      `The monster lost all the HP, you won the game! Congratulations!`
                    );
                  }
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
