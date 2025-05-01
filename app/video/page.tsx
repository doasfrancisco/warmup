"use client"

import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"

const VIDEO_ID = "L5_-kvfsiGE"
const PART_TIME = 474

declare global {
    interface Window {
      onYouTubeIframeAPIReady: () => void;
    }
  }
  

export default function VideoPage() {
  const playerRef = useRef<YT.Player | null>(null);
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const initPlayer = () => {
      playerRef.current = new window.YT.Player("video-player", {
        videoId: VIDEO_ID,
        playerVars: { start: PART_TIME, autoplay: 0 },
        events: {
          onReady: () => setReady(true)
        },
      })
    }

    if (window.YT && window.YT.Player) {
      initPlayer()
    } else {
      const tag = document.createElement("script")
      tag.src = "https://www.youtube.com/iframe_api"
      const firstScript = document.getElementsByTagName("script")[0]
      firstScript?.parentNode?.insertBefore(tag, firstScript)
      window.onYouTubeIframeAPIReady = initPlayer
    }
  }, [])

  const goToPart = () => {
    if (!ready || !playerRef.current) return
    playerRef.current.seekTo(PART_TIME, true)
    playerRef.current.playVideo()
  }

  const goBack10 = () => {
    if (!ready || !playerRef.current) return
    const t = Math.max(playerRef.current.getCurrentTime() - 10, 0)
    playerRef.current.seekTo(t, true)
    playerRef.current.playVideo()
  }

  return (
    <main className="flex flex-col items-center justify-center p-6 space-y-4">
      <h1 className="text-2xl font-bold">Vocal Warm Up</h1>
      <div className="w-full max-w-xl aspect-video">
        <div id="video-player" className="w-full h-full rounded-lg shadow" />
      </div>
      <div className="flex space-x-4">
        <Button onClick={goToPart} disabled={!ready}>
          Go to Part
        </Button>
        <Button onClick={goBack10} disabled={!ready}>
          10 Seconds Before
        </Button>
      </div>

    </main>
  )
}
