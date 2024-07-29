import { useState, useCallback, useEffect } from "react";

function useSpeechSynthesis() {
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [speechSynthesis, setSpeechSynthesis] = useState(null);

  useEffect(() => {
    setSpeechSynthesis(window.speechSynthesis);
  }, []);

  const speakNotification = useCallback(
    (message) => {
      console.log("Attempting to speak notification:", message);
      console.log("Audio enabled:", audioEnabled);
      console.log("Speech synthesis available:", !!speechSynthesis);

      if (audioEnabled && speechSynthesis) {
        speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(message);
        utterance.lang = "en-US";
        utterance.rate = 0.7;

        utterance.onstart = () => console.log("Speech started");
        utterance.onend = () => console.log("Speech ended");
        utterance.onerror = (event) => console.error("Speech error:", event);

        speechSynthesis.speak(utterance);
      } else {
        console.log("Speech synthesis is disabled or not supported");
      }
    },
    [audioEnabled, speechSynthesis]
  );

  return { audioEnabled, setAudioEnabled, speakNotification };
}

export default useSpeechSynthesis;