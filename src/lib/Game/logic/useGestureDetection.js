import { onMount } from "svelte";
import { writable } from "svelte/store";
import Handsfree from "handsfree";
const useGestureDetection = () => {
  let handsFree = null;
  const detectedGestureStore = writable("");

  const handleGestureDetected = (event) => {
    const data = event.detail;
    if (!data.hands || !data.hands.gesture) return;
    data.hands.gesture.forEach((gesture) => {
      if (gesture && gesture.name) {
        detectedGestureStore.set(gesture.name);
      }
    });
  };

  const startGestureDetection = (debugWindow) => {
    handsFree = new Handsfree({
      hands: true,
    });
    debugWindow.appendChild(handsFree.debug.$wrap);
    handsFree.showDebugger();
    handsFree.start();
    loadGesturesCharacteristics();
    document.addEventListener("handsfree-data", handleGestureDetected);
  };

  const stopGestureDetection = () => {
    handsFree.stop();
    document.removeEventListener("handsfree-data", handleGestureDetected);
  };

  const loadGesturesCharacteristics = () => {
    handsFree.useGesture({
      name: "paper",
      algorithm: "fingerpose",
      models: "hands",
      confidence: 7.5,
      description: [
        ["addCurl", "Thumb", "NoCurl", 1],
        ["addDirection", "Thumb", "DiagonalUpRight", 1],
        ["addCurl", "Index", "NoCurl", 1],
        ["addDirection", "Index", "VerticalUp", 1],
        ["addDirection", "Index", "DiagonalUpRight", 0.1111111111111111],
        ["addCurl", "Middle", "NoCurl", 1],
        ["addCurl", "Middle", "FullCurl", 0.034482758620689655],
        ["addDirection", "Middle", "VerticalUp", 1],
        ["addCurl", "Ring", "NoCurl", 1],
        ["addDirection", "Ring", "VerticalUp", 1],
        ["addCurl", "Pinky", "NoCurl", 1],
        ["addDirection", "Pinky", "VerticalUp", 1],
        ["addDirection", "Thumb", "DiagonalUpLeft", 1],
        ["addDirection", "Index", "DiagonalUpLeft", 0.1111111111111111],
      ],
      enabled: true,
    });

    handsFree.useGesture({
      name: "rock",
      algorithm: "fingerpose",
      models: "hands",
      confidence: 7.5,
      description: [
        ["addCurl", "Thumb", "NoCurl", 1],
        ["addCurl", "Thumb", "HalfCurl", 0.034482758620689655],
        ["addDirection", "Thumb", "DiagonalUpRight", 0.07142857142857142],
        ["addDirection", "Thumb", "VerticalUp", 1],
        ["addCurl", "Index", "FullCurl", 1],
        ["addDirection", "Index", "DiagonalUpRight", 1],
        ["addCurl", "Middle", "FullCurl", 1],
        ["addDirection", "Middle", "DiagonalUpRight", 1],
        ["addCurl", "Ring", "FullCurl", 1],
        ["addDirection", "Ring", "DiagonalUpRight", 0.034482758620689655],
        ["addDirection", "Ring", "VerticalUp", 1],
        ["addCurl", "Pinky", "FullCurl", 1],
        ["addDirection", "Pinky", "VerticalUp", 1],
        ["addDirection", "Pinky", "DiagonalUpLeft", 0.07142857142857142],
        ["addDirection", "Thumb", "DiagonalUpLeft", 0.07142857142857142],
        ["addDirection", "Index", "DiagonalUpLeft", 1],
        ["addDirection", "Middle", "DiagonalUpLeft", 1],
        ["addDirection", "Ring", "DiagonalUpLeft", 0.034482758620689655],
        ["addDirection", "Pinky", "DiagonalUpRight", 0.07142857142857142],
      ],
      enabled: true,
    });

    handsFree.useGesture({
      name: "scissors",
      algorithm: "fingerpose",
      models: "hands",
      confidence: 7.5,
      description: [
        ["addCurl", "Thumb", "NoCurl", 1],
        ["addDirection", "Thumb", "VerticalUp", 1],
        ["addCurl", "Index", "NoCurl", 1],
        ["addDirection", "Index", "DiagonalUpRight", 1],
        ["addDirection", "Index", "VerticalUp", 0.7647058823529411],
        ["addCurl", "Middle", "NoCurl", 1],
        ["addDirection", "Middle", "VerticalUp", 1],
        ["addCurl", "Ring", "FullCurl", 1],
        ["addDirection", "Ring", "VerticalUp", 1],
        ["addCurl", "Pinky", "FullCurl", 1],
        ["addDirection", "Pinky", "VerticalUp", 1],
        ["addDirection", "Index", "DiagonalUpLeft", 1],
      ],
      enabled: true,
    });
  };
  return { detectedGestureStore, startGestureDetection, stopGestureDetection };
};

export default useGestureDetection;