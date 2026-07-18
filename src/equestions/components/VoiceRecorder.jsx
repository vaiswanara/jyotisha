// ============================================================
// VoiceRecorder.jsx — MediaRecorder API voice recording
// Record / Stop / Play / Delete
// Audio saved as base64 DataURL (stored in state, passed up)
// ============================================================

import React, { useState, useRef, useEffect } from "react";

const STATES = { IDLE: "idle", RECORDING: "recording", DONE: "done" };

export function VoiceRecorder({ value, onChange }) {
  const [recState, setRecState] = useState(STATES.IDLE);
  const [duration, setDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [error, setError] = useState("");

  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const timerRef = useRef(null);
  const audioRef = useRef(new Audio());

  // If a saved value arrives, treat as DONE
  useEffect(() => {
    if (value && recState === STATES.IDLE) {
      setRecState(STATES.DONE);
    }
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    const onEnd = () => setIsPlaying(false);
    audio.addEventListener("ended", onEnd);
    return () => audio.removeEventListener("ended", onEnd);
  }, []);

  const startRecording = async () => {
    setError("");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      chunksRef.current = [];
      const mr = new MediaRecorder(stream);
      mediaRecorderRef.current = mr;

      mr.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      mr.onstop = () => {
        stream.getTracks().forEach((t) => t.stop());
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        const reader = new FileReader();
        reader.onload = (ev) => {
          onChange(ev.target.result);
          setRecState(STATES.DONE);
        };
        reader.readAsDataURL(blob);
      };

      mr.start();
      setRecState(STATES.RECORDING);
      setDuration(0);
      timerRef.current = setInterval(() => setDuration((d) => d + 1), 1000);
    } catch (err) {
      setError("Microphone access denied. Please allow microphone in browser settings.");
    }
  };

  const stopRecording = () => {
    clearInterval(timerRef.current);
    if (mediaRecorderRef.current?.state !== "inactive") {
      mediaRecorderRef.current.stop();
    }
  };

  const playAudio = () => {
    if (!value) return;
    if (isPlaying) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
    } else {
      audioRef.current.src = value;
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const deleteAudio = () => {
    audioRef.current.pause();
    audioRef.current.src = "";
    setIsPlaying(false);
    setDuration(0);
    onChange(null);
    setRecState(STATES.IDLE);
  };

  const fmtTime = (s) =>
    `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

  return (
    <div className="eq-voice-recorder">
      {recState === STATES.IDLE && (
        <button type="button" className="eq-voice-btn eq-voice-record" onClick={startRecording}>
          <span className="eq-icon">🎙️</span>
          <span>Record Voice</span>
        </button>
      )}

      {recState === STATES.RECORDING && (
        <div className="eq-voice-recording-row">
          <span className="eq-voice-dot" />
          <span className="eq-voice-timer">{fmtTime(duration)}</span>
          <button type="button" className="eq-voice-btn eq-voice-stop" onClick={stopRecording}>
            <span className="eq-icon">⬛</span> Stop
          </button>
        </div>
      )}

      {recState === STATES.DONE && (
        <div className="eq-voice-done-row">
          <span className="eq-voice-icon">🎵</span>
          <span className="eq-voice-ready-label">Voice recorded</span>
          <button type="button" className="eq-voice-btn eq-voice-play" onClick={playAudio}>
            {isPlaying ? "⏸ Pause" : "▶ Play"}
          </button>
          <button type="button" className="eq-voice-btn eq-voice-delete" onClick={deleteAudio}>
            🗑 Delete
          </button>
        </div>
      )}

      {error && <p className="eq-voice-error">{error}</p>}
    </div>
  );
}
