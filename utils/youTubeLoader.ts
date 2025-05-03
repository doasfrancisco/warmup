// --- youTubeLoader.ts ---
let youTubeAPIPromise: Promise<typeof YT> | null = null;

export function loadYouTubeAPI(): Promise<typeof YT> {
  if (youTubeAPIPromise) return youTubeAPIPromise;

  youTubeAPIPromise = new Promise((resolve) => {
    // 1) If already on window, resolve immediately
    if (window.YT && window.YT.Player) {
      return resolve(window.YT);
    }

    // 2) Otherwise inject script once
    const tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";
    document.head.appendChild(tag);

    // 3) onYouTubeIframeAPIReady may fire only once
    window.onYouTubeIframeAPIReady = () => {
      resolve(window.YT);
    };
  });

  return youTubeAPIPromise;
}
