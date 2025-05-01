"use client"

import { useEffect, useRef, useState } from 'react'
import { PitchDetector } from 'pitchy'

export default function Home() {
  const [frequency, setFrequency] = useState<number | null>(null)
  const [note, setNote] = useState<string | null>(null)

  const [targetIndex, setTargetIndex] = useState<number>(0)
  const [playing, setPlaying] = useState<boolean>(false)

  const audioCtxRef = useRef<AudioContext | null>(null)

  const scaleFrequencies = [261.63, 293.66, 329.63, 349.23, 392.0, 440.0, 493.88, 523.25]

  const freqToNote = (freq: number) => {
    const NOTES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']
    const A4 = 440
    const semitones = 12 * Math.log2(freq / A4)
    const midi = Math.round(semitones) + 69
    const name = NOTES[midi % 12]
    const octave = Math.floor(midi / 12) - 1
    return `${name}${octave}`
  }

  // Play the ascending scale tones sequentially using a fresh AudioContext
  const playScale = async () => {
    const playCtx = new AudioContext()
    if (playCtx.state === 'suspended') await playCtx.resume()
    setPlaying(true)
    scaleFrequencies.forEach((freq, i) => {
      const osc = playCtx.createOscillator()
      osc.frequency.value = freq
      osc.connect(playCtx.destination)
      const start = playCtx.currentTime + i * 0.8
      osc.start(start)
      osc.stop(start + 0.6)
    })
    // After playback, reset matching
    setTimeout(() => {
      setPlaying(false)
      setTargetIndex(0)
      playCtx.close()
    }, scaleFrequencies.length * 800)
  }

  // Initialize pitch detector and audio processing for mic input
  useEffect(() => {
    let detector: PitchDetector<Float32Array>
    let processor: ScriptProcessorNode

    const init = async () => {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const audioCtx = new AudioContext()
      audioCtxRef.current = audioCtx
      const source = audioCtx.createMediaStreamSource(stream)

      detector = PitchDetector.forFloat32Array(2048)
      processor = audioCtx.createScriptProcessor(2048, 1, 1)
      processor.onaudioprocess = (e) => {
        if (playing) return
        const input = e.inputBuffer.getChannelData(0)
        const [pitch, clarity] = detector.findPitch(input, audioCtx.sampleRate)
        if (clarity > 0.8 && pitch) {
          setFrequency(pitch)
          setNote(freqToNote(pitch))
        }
      }

      source.connect(processor)
      processor.connect(audioCtx.destination)
    }

    init()
    return () => {
      processor.disconnect()
      audioCtxRef.current?.close()
    }
  }, [playing])

  // Check if current pitch matches target scale note
  const isMatch = () => {
    if (!frequency) return false
    const targetFreq = scaleFrequencies[targetIndex]
    const cents = 1200 * Math.log2(frequency / targetFreq)
    return Math.abs(cents) < 20
  }

  // Advance to next note if matched
  const handleNext = () => {
    if (isMatch()) {
      setTargetIndex((i) => Math.min(i + 1, scaleFrequencies.length - 1))
      setFrequency(null)
      setNote(null)
    }
  }

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-6">
      <h1 className="text-3xl font-bold mb-4">🎵 Scale Matching Trainer</h1>
      <button
        onClick={playScale}
        className="mb-4 px-4 py-2 bg-blue-500 text-white rounded"
        disabled={playing}
      >
        {playing ? 'Playing...' : 'Play Scale'}
      </button>
      <div className="text-center">
        <p>Target Note: <strong>{freqToNote(scaleFrequencies[targetIndex])}</strong></p>
        <p>Your Pitch: {frequency ? `${note} (${frequency.toFixed(1)} Hz)` : '–––'}</p>
        <button
          onClick={handleNext}
          className="mt-2 px-4 py-2 bg-green-500 text-white rounded"
          disabled={!frequency}
        >
          {isMatch() ? 'Next Note' : 'Match Note'}
        </button>
      </div>
    </main>
  )
}
