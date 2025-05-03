// global.d.ts
export {}; // make this file a module

declare global {
  interface Window {
    onYouTubeIframeAPIReady: () => void;
  }
}
