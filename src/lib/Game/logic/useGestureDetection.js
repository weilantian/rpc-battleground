// This is the core for the gesture detection logic.

import { writable } from "svelte/store";

/*
The gesture detection capability is mainly achieved using the library called handsfree created by Oz Ramos, 
which is a wrapper around machine learning library ml5.js.

https://github.com/midiblocks/handsfree

It gives more helpers comparing to the original ml5.js related to 
detection in hand gesture as well as pose detection.
*/
import Handsfree from "handsfree";
const useGestureDetection = () => {
  let handsFree;

  // writable function allows me to define trackable variables outside of a Svelte component.

  /**
   * The gesture detected, which will be dynamically updated when detected a new gesture.
   * @type { import("svelte/store").Writable<"rock" | "paper" | "scissors" | null> }
   */
  const detectedGesture = writable(null);

  /**
   * Defines wether the modal for gesture detection has been loaded
   * @type {import("svelte/store").Writable<boolean>}
   */
  const modalLoaded = writable(false);

  /**
   * This function will be called when the handsfree module claims
   * it has prepared and loaded the gesture detection modal.
   */
  const handleModalLoaded = () => {
    modalLoaded.set(true);
  };

  // This function will be called when a gesture is detected by the handsfree.
  const handleGestureDetected = (event) => {
    const data = event.detail;
    if (!data.hands || !data.hands.gesture) return;
    data.hands.gesture.forEach((gesture) => {
      /*
      If the gesture is known to the handsfree, it will 
      be reported by setting the detectedGesture variable.

      Noted that writable object can not be changed directly, it should be only mutated
      by calling the set function and passing the value.
      */
      if (gesture && gesture.name) {
        detectedGesture.set(gesture.name);
      }
    });
  };

  /**
   * Call this function when the gesture detection service needs to be activated.
   * @param {HTMLElement} webcamCOntainer
   */
  const startGestureDetection = (webcamCOntainer) => {
    /**
     * Initialize the handsFree instance,
     * and sets the hands option to true to enable
     * gesture detection.
     */
    handsFree = new Handsfree({
      hands: true,
    });

    // Inject the webcam video element into the webcamContainer
    webcamCOntainer.appendChild(handsFree.debug.$wrap);

    /* 
    Handsfree required to call showDebugger method to output
     webcam video signal to a video element.
     */
    handsFree.showDebugger();

    // Tell the Handsfree to start its gesture detection service.
    handsFree.start();

    /* This function describes all the gesture should be identified, 
    which will be called to tell the Hanfsfree to keep a eye on the gesture described.
    */
    loadGesturesCharacteristics();

    /*
    Call handleGestureDetected function when a gesture is detected. Handsfree will dispatch 
    handsfree-data event when a gesture is detected.
    */
    document.addEventListener("handsfree-data", handleGestureDetected);

    /*
    Call handleModalLoaded function when handsfree is prepared to be detecting the gesture.
    */
    document.addEventListener("handsfree-handsModelReady", handleModalLoaded);
  };

  /**
   * A clean up function which stops handsFree's gesture detection service,
   * and remove all the event listeners.
   */
  const stopGestureDetection = () => {
    handsFree.stop();
    document.removeEventListener("handsfree-data", handleGestureDetected);
    document.removeEventListener(
      "handsfree-handsModelReady",
      handleModalLoaded
    );
  };

  /**
   * Describe the gestures needs to be detected by Handsfree
   */
  const loadGesturesCharacteristics = () => {
    /* 
    A gesture can be described using handsFree's built-in useGesture method.
    The gesture is given a name, and description of the gesture is defined using
    a Handsfree-specific syntax, basically I need to specify the characteristics of each finger, 
    wether they are curled or not, as well as the direction they are positing to.

    The gesture description can be automatically generated on Handsfree's website:
    https://handsfree.js.org/gesture/
    */
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
  return {
    detectedGesture,
    modalLoaded,
    startGestureDetection,
    stopGestureDetection,
  };
};

/* 
export the function which contains the gesture detection logic, 
which can be later used.
*/
export default useGestureDetection;
