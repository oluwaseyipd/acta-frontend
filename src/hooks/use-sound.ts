import { useCallback } from "react";
import popSoundFile from "@/assets/pop-sound.mp3";

export function usePopSound() {
  const playPop = useCallback(() => {
    try {
      const audio = new Audio(popSoundFile);
      audio.volume = 0.3;
      audio.play().catch((error) => {
        console.warn("Failed to play pop sound:", error);
      });
    } catch (error) {
      console.warn("Failed to create audio element:", error);
    }
  }, []);

  return { playPop };
}
