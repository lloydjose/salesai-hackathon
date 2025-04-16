"use client";

import { useRef, useEffect } from "react";

// Simplified Audio Visualizer Component
export const AudioVisualizer = ({ stream }: { stream: MediaStream | null }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameId = useRef<number | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null); // Use ref for context
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);

  useEffect(() => {
    if (!stream || !canvasRef.current) {
      // Cleanup if stream is removed or component unmounts early
      if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
      if (sourceRef.current && analyserRef.current) sourceRef.current.disconnect(analyserRef.current);
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') audioContextRef.current.close();
      return;
    }

    if (!audioContextRef.current || audioContextRef.current.state === 'closed') {
      if (!(window.AudioContext || (window as any).webkitAudioContext)) {
          console.warn("AudioContext not supported.");
          return;
      }
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    const audioContext = audioContextRef.current;
    
    if (!analyserRef.current) {
        analyserRef.current = audioContext.createAnalyser();
        analyserRef.current.fftSize = 32;
    }
    const analyser = analyserRef.current;

    // Disconnect previous source if exists
    if (sourceRef.current) {
        try { sourceRef.current.disconnect(analyser); } catch (e) {}
    }
    
    try {
        sourceRef.current = audioContext.createMediaStreamSource(stream);
        sourceRef.current.connect(analyser);
    } catch (error) {
        console.error("Error creating/connecting MediaStreamSource:", error);
        return; // Stop if source connection fails
    }

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    const canvas = canvasRef.current;
    const canvasCtx = canvas.getContext('2d');
    if (!canvasCtx) return;

    canvas.width = 50;
    canvas.height = 20;

    const draw = () => {
      if (!analyserRef.current) return;
      animationFrameId.current = requestAnimationFrame(draw);
      analyserRef.current.getByteFrequencyData(dataArray);

      canvasCtx.fillStyle = 'rgb(241, 245, 249)'; // bg-slate-100
      canvasCtx.fillRect(0, 0, canvas.width, canvas.height);

      const barWidth = canvas.width / bufferLength;
      let barHeight;
      let x = 0;
      const barsToDraw = 5;

      for (let i = 0; i < barsToDraw; i++) {
        let sum = 0;
        const samplesPerBar = Math.floor(bufferLength / barsToDraw);
        const startIndex = i * samplesPerBar;
        for (let j = 0; j < samplesPerBar; j++) {
            sum += dataArray[startIndex + j] || 0;
        }
        const avg = samplesPerBar > 0 ? sum / samplesPerBar : 0;
        barHeight = (avg / 255) * canvas.height * 1.5;
        canvasCtx.fillStyle = `rgb(34, 197, 94)`; // green-500
        canvasCtx.fillRect(x, canvas.height - barHeight, barWidth - 1, barHeight);
        x += barWidth;
      }
    };

    draw();

    // Cleanup function
    return () => {
      console.log("Cleaning up AudioVisualizer animation frame");
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
      // Disconnection and context closing handled by the main component's stream management
    };
  }, [stream]);

  // Only render canvas if stream is potentially active (avoids blank box)
  return stream ? <canvas ref={canvasRef} className="rounded" /> : null;
}; 