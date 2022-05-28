/* 
This file contains the state machine defined for the game.
As talked in the App.svelte file, state machine works as a "single source of truth"
for the all components to share a same copy of trackable states.

There is mainly two things the state machines stores,
the first will be what phase the game is currently running at,
and second will be the context, which stores all the information about the game.

XState is used as the state machine framework in this game,
and its debug panel will be opened if the project is running in development mode.
*/

import { createMachine } from "xstate";
import { speak } from "./voiceOver";

// Create state machine by using the createMachine function.
const gameState = createMachine(
  {
    id: "game",
    // The initial phase of the game will be startMenu.
    initial: "startMenu",

    /*
    Theoretically, the game can be paused no matter the phase the game is currently at.

    However due to the limited time given for the assignment, 
    this functionality is left unimplemented.

    It might be made possible to pause the game in the future
    TODO: Implement pause game feature
    */
    on: {
      PAUSED: {
        target: "paused",
      },
    },

    /*
    "
    While finite states are well-defined in finite state machines and statecharts, state that represents quantitative data 
    (e.g., arbitrary strings, numbers, objects, etc.) that can be potentially infinite 
    is represented as extended state (opens new window)instead. T
    his makes statecharts much more useful for real-life applications.
    
    In XState, extended state is known as context. "

    Stated in XState official doc.
    https://xstate.js.org/docs/guides/context.html
    */
    context: {
      // Wether the user choose to play the game with mouse and keyboard
      mouseKeyboardInput: false,
      // Wether the game is paused by the user
      paused: false,
      // Wether the voiceOver is enabled
      voiceOverEnabled: false,
      // The current round of the game
      rounds: 0,
      // HP and the streak value of two characters
      playerStats: {
        hp: 100,
        streak: 0,
      },
      cpuStats: {
        hp: 100,
        streak: 0,
      },

      // The decision made by the player during the current
      playerDecision: "",

      // The decision made by the cpu during the current
      cpuDecision: "",

      // Wether the current round is a tie
      tie: false,

      // Thw winner of each round, which will be decided in each round.
      winner: "",

      // The final winner of the game
      finalWinner: "",
    },
    states: {
      paused: {},
      // The phase during which the manual will be showing on the startMenu.
      showingTutorial: {
        on: {
          /* The start event will make the game transition to the "countDown" phase,
           which will start the game.
          */
          START: {
            target: "countDown",
            /*
            Record the user had read the quickstart manual in the browser, so that
            the manual will only show up the first time they start the game. 
            */
            actions: () => {
              localStorage.setItem("tutorialShown", "yes");
            },
          },
          /*
          Back to the startMenu if user hit "Close" button on the manual modal.
          */
          BACK: {
            target: "startMenu",
          },
        },
      },
      // The phase during which the start menu will be presented
      startMenu: {
        on: {
          TUTORIAL: "showingTutorial",
          START: [
            {
              // The START event will transition the game to countDown phase.
              target: "countDown",
              /*
              The cond function will be executed before the phase transition. If it returns false, 
              the state machine will not transition to the target which contains this condition.
              */
              cond: (context, event) => {
                // If the user enables voiceover, set voiceOverEnabled context to true
                context.voiceOverEnabled = event.voiceOverEnabled;

                // Write down user's choice of using mouse and keyboard as input interface into context
                context.mouseKeyboardInput = event.mouseKeyboardInput;

                // Check if the tutorial has shown, if it had shown, enter the game straightforwardly.
                return localStorage.getItem("tutorialShown") === "yes";
              },
            },
            {
              target: "showingTutorial",
            },
          ],
        },
      },

      // The phase during which the count down will happened before each round
      countDown: {
        on: {
          // After the count down has finished, transition to makeDecision phase.
          MAKE_DECISION: {
            target: "makeDecision",
          },
        },
      },

      // The phase during which the user will be asked to make their move during each round.
      makeDecision: {
        on: {
          // SHOW_DECISION event transitions the phase to showDecision.
          SHOW_DECISION: {
            target: "showDecision",
            actions: (context, event) => {
              // During the transition, record the nth of the round.
              context.rounds++;
              context.playerDecision = event.decision;
              // Make a random decision by cpu. First, a random number between 0-2 will be generated
              const randomDecision = Math.floor(Math.random() * 3);

              // Assert the decision depends on the random number generated
              context.cpuDecision = ["rock", "paper", "scissors"][
                randomDecision
              ];

              // Check if is a tie
              if (context.playerDecision === context.cpuDecision) {
                context.tie = true;

                // Report verbally in voiceover mode.
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

              // Verbally report the winner of the game
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
      // The phase during which the decision made by the user and the cpu will be presented
      showDecision: {
        on: {
          /* 
          The TIE event will be sent if the current round is a tie
          , which will make the game transition into the countDown phase.
          */
          TIE: "countDown",
          /*
          The ATTACK event will be sent if the current round is not a tie,
          which will transition into the attack phase.
          */
          ATTACK: "attack",
        },
      },
      // The phase during which the attack animation will by played in the battleground.
      attack: {
        on: {
          /*
          when the attacking animation ends, 
          the action of this event is defined in a condition.

          During the condition function, the HP of the characters will
          be recalculated based on the attack of the current round.

          If the attack had caused a character lost all the HP,
          the phase of the game will be transitioned to gameOver.
          Otherwise, the next round of the game will begin start shortly
          after the countdown.
          */
          FINISH_ATTACK: [
            /*
            Multiple target can be specified for a event, 
            and the final target which will be decided by the cond function.
            If the cond function defined in a countDown
            */
            {
              target: "countDown",
              // The cond works just like actions.
              cond: (context) => {
                if (context.winner === "player") {
                  if (context.playerStats.streak == 3) {
                    // If the player wins three times in a row, 40 HP lost will be caused.
                    context.playerStats.streak = 0;

                    // A clamp value function is used to make sure that the HP will not be less then 0.
                    context.cpuStats.hp = clampValue(
                      context.cpuStats.hp,
                      40,
                      0,
                      true
                    );

                    // If the voice is enabled, read out to the user that three streaks has made.
                    if (context.voiceOverEnabled) {
                      speak(
                        `You had won three rounds in a row, the monster lost 40 hp!, now the monster has ${context.cpuStats.hp} HP.`
                      );
                    }
                  } else {
                    // The competitor will lost 30 HP is he does not won three times in a row.
                    context.cpuStats.hp = clampValue(
                      context.cpuStats.hp,
                      30,
                      0,
                      true
                    );
                  }

                  if (context.voiceOverEnabled) {
                    speak(
                      `The monster lost 30 hp!, now the monster has ${context.cpuStats.hp} HP.`
                    );
                  }
                } else {
                  // If the cpu won this round, handle the same HP calculation on the player.

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

                /* If during this round, there is no HP left for a character, 
                the condition will return false, so that the target of the event will be pointing to the "gameOver" phase.
                */
                return context.playerStats.hp > 0 && context.cpuStats.hp > 0;
              },
            },
            {
              target: "gameOver",
              actions: (context) => {
                // Assert the final winner of the game.
                if (context.playerStats.hp <= 0) {
                  context.finalWinner = "cpu";
                  if (context.voiceOverEnabled) {
                    // Announcing the final winner.
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
        // When the "Back to StartMenu" button is clicked, reset the game by reload the game window.
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

// A helper function used in the calculate of the HP after an attack
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
