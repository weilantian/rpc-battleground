// A function which uses speechSynthesis to convert text to speech
// and play it back.
export const speak = (text) => {
  const utterance = new SpeechSynthesisUtterance(text);
  speechSynthesis.speak(utterance);
};
