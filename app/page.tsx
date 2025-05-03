"use client";
import {VideoPlayer} from "@/components/VideoPlayer";

const videos = [
  { id: "L5_-kvfsiGE", start: 474, title: "Lip rolls, Yah-Yah, Uh-Uh" },
  { id: "Lyl_yt0RN0s", start: 78,   title: "Vocal Fry" },
  { id: "OESa_KS1quY", start: 30,  title: "High pitch lip rolls" },
  // { id: "nKhdKJmAIWI", start: 30,  title: "High pitch lip rolls" },
];

export default function HomePage() {
  return (
    <main className="flex flex-col items-center justify-center p-6 space-y-6">
      <h1 className="text-2xl font-bold">Voice warmup videos</h1>
      {videos.map((vid) => (
        <VideoPlayer
          key={vid.id}
          id={vid.id}
          start={vid.start}
          title={vid.title}
        />
      ))}
    </main>
  );
}
