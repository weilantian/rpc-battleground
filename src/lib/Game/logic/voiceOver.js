// A function which uses speechSynthesis to convert text to speech
// and play it back.

// Check if SpeechSynthesis API is available on user's browser
export const isSpeechSynthesisAPIAvailable =
  typeof speechSynthesis !== "undefined";

export const speak = (text) => {
  //Wrap the test to a SPeechSynthesisUtterance, which can be speak out by the speechSynthesis API.
  const utterance = new SpeechSynthesisUtterance(text);
  speechSynthesis.speak(utterance);
};
