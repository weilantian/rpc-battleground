import { createMachine } from "xstate";

const gameState = createMachine({
  id: "game",
  initial: "countDown",
  context: {
    playerStats: {
      hp: 80,
      streak: 0,
    },
    cpuStats: {
      hp: 100,
      streak: 0,
    },
    playerChoice: "",
    cpuChoice: "",
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
    makeDecision: {},
  },
});

export default gameState;
