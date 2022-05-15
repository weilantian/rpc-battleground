import { writable } from "svelte/store";
import Handsfree from "handsfree";
const useGestureDetection = () => {
  let handsFree = null;

  const detectedGesture = writable("");
  const modalLoaded = writable(false);

  const handleModalLoaded = () => {
    modalLoaded.set(true);
  };

  const handleGestureDetected = (event) => {
    const data = event.detail;
    if (!data.hands || !data.hands.gesture) return;
    data.hands.gesture.forEach((gesture) => {
      if (gesture && gesture.name) {
        detectedGesture.set(gesture.name);
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
    document.addEventListener("handsfree-handsModelReady", handleModalLoaded);
  };

  const stopGestureDetection = () => {
    handsFree.stop();
    document.removeEventListener("handsfree-data", handleGestureDetected);
    document.removeEventListener(
      "handsfree-handsModelReady",
      handleModalLoaded
    );
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

    handsFree.useGesture({
      name: "thumbsDown",
      algorithm: "fingerpose",
      models: "hands",
      confidence: 7.5,
      description: [
        ["addCurl", "Thumb", "NoCurl", 1],
        ["addDirection", "Thumb", "VerticalDown", 0.30434782608695654],
        ["addDirection", "Thumb", "DiagonalDownRight", 1],
        ["addCurl", "Index", "FullCurl", 1],
        ["addDirection", "Index", "HorizontalRight", 1],
        ["addCurl", "Middle", "FullCurl", 1],
        ["addDirection", "Middle", "HorizontalRight", 1],
        ["addCurl", "Ring", "FullCurl", 1],
        ["addDirection", "Ring", "HorizontalRight", 1],
        ["addCurl", "Pinky", "FullCurl", 1],
        ["addDirection", "Pinky", "DiagonalUpRight", 1],
        ["addDirection", "Pinky", "HorizontalRight", 0.034482758620689655],
        ["addDirection", "Thumb", "DiagonalDownLeft", 1],
        ["addDirection", "Index", "HorizontalLeft", 1],
        ["addDirection", "Middle", "HorizontalLeft", 1],
        ["addDirection", "Ring", "HorizontalLeft", 1],
        ["addDirection", "Pinky", "DiagonalUpLeft", 1],
        ["addDirection", "Pinky", "HorizontalLeft", 0.034482758620689655],
      ],
      enabled: true,
    });
  };
  return {
    detectedGesture,
    modalLoaded,
    startGestureDetection,
    stopGestureDetection,
  };
};

export default useGestureDetection;
