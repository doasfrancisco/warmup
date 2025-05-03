import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button"
import { loadYouTubeAPI } from "@/utils/youTubeLoader"; // path to the loader

type VideoDef = {id: string, start: number, title: string}

export function VideoPlayer({ id, start, title }: VideoDef) {
  const containerId = `player-${id}`;
  const playerRef = useRef<YT.Player | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let isMounted = true;

    loadYouTubeAPI().then((YT) => {
      if (!isMounted) return;
      playerRef.current = new YT.Player(containerId, {
        videoId: id,
        playerVars: { start, autoplay: 0 },
        events: {
          onReady: () => setReady(true),
        },
      });
    });

    return () => {
      isMounted = false;
      // optional: destroy playerRef.current here if you want
    };
  }, [containerId, id, start]);

  const goToPart = () => {
    if (playerRef.current && ready) {
      playerRef.current.seekTo(start, true);
      playerRef.current.playVideo();
    }
  };
  const goBack10 = () => {
    if (playerRef.current && ready) {
      const t = Math.max(playerRef.current.getCurrentTime() - 10, 0);
      playerRef.current.seekTo(t, true);
      playerRef.current.playVideo();
    }
  };

  return (
    <div className="flex flex-col items-center space-y-2 w-full max-w-xl">
      <h2 className="text-xl font-semibold">{title}</h2>
      <div className="w-full aspect-video rounded-lg shadow">
        <div id={containerId} className="w-full h-full" />
      </div>
      <div className="flex space-x-3">
        <Button onClick={goToPart} disabled={!ready}>
          Go to Part
        </Button>
        <Button onClick={goBack10} disabled={!ready}>
          10s Back
        </Button>
      </div>
    </div>
  );
}
