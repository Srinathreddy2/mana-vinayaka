"use client";

import { useEffect, useRef, useState } from "react";
import { formatDuration } from "@/lib/format";

interface Props {
  onRecorded: (audio: { blob: Blob; durationSec: number } | undefined) => void;
  recorded?: { blob: Blob; durationSec: number };
}

type State = "idle" | "recording" | "done" | "denied";

/** Record a short voice memory in the browser. */
export function Recorder({ onRecorded, recorded }: Props) {
  const [state, setState] = useState<State>(recorded ? "done" : "idle");
  const [seconds, setSeconds] = useState(0);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      streamRef.current?.getTracks().forEach((t) => t.stop());
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const start = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const recorder = new MediaRecorder(stream);
      chunksRef.current = [];
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };
      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: recorder.mimeType || "audio/webm" });
        const url = URL.createObjectURL(blob);
        setPreviewUrl(url);
        onRecorded({ blob, durationSec: secondsRef.current });
        setState("done");
        streamRef.current?.getTracks().forEach((t) => t.stop());
      };
      recorder.start();
      recorderRef.current = recorder;
      setSeconds(0);
      secondsRef.current = 0;
      setState("recording");
      timerRef.current = setInterval(() => {
        secondsRef.current += 1;
        setSeconds(secondsRef.current);
      }, 1000);
    } catch {
      setState("denied");
    }
  };

  const secondsRef = useRef(0);

  const stop = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    recorderRef.current?.stop();
  };

  const reset = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    setSeconds(0);
    secondsRef.current = 0;
    onRecorded(undefined);
    setState("idle");
  };

  return (
    <div className="rounded-[24px] border border-brass-500/12 bg-ink-800/40 px-6 py-8 text-center">
      {state === "idle" && (
        <>
          <div className="text-[2rem] leading-none">🎙️</div>
          <p className="mt-3 font-display text-[1.125rem] text-bone-50">
            Tell us what you want to remember
          </p>
          <p className="mt-1.5 text-[0.875rem] text-bone-400">
            A minute is plenty. Years from now, the voice is the part you cannot recreate.
          </p>
          <button type="button" onClick={start} className="btn btn-primary btn-md mt-5">
            Record
          </button>
        </>
      )}

      {state === "recording" && (
        <>
          <div className="flex items-center justify-center gap-2">
            <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-brass-500" />
            <span className="font-display text-[1.75rem] tabular-nums text-bone-50">
              {formatDuration(seconds) || "0 sec"}
            </span>
          </div>
          <div className="mt-4 flex h-10 items-end justify-center gap-1">
            {Array.from({ length: 28 }, (_, i) => (
              <span
                key={i}
                className="w-[3px] rounded-full bg-saffron/70"
                style={{
                  height: `${20 + Math.abs(Math.sin((seconds + i) * 0.7)) * 70}%`,
                  transition: "height 320ms ease",
                }}
              />
            ))}
          </div>
          <button type="button" onClick={stop} className="btn btn-primary btn-md mt-5">
            Stop recording
          </button>
        </>
      )}

      {state === "done" && (
        <>
          <p className="font-display text-[1.125rem] text-bone-50">Recorded</p>
          <p className="mt-1 text-[0.875rem] text-bone-400">
            {formatDuration(recorded?.durationSec ?? seconds)}
          </p>
          {previewUrl && (
            // eslint-disable-next-line jsx-a11y/media-has-caption
            <audio src={previewUrl} controls className="mx-auto mt-4 w-full max-w-sm" />
          )}
          <button type="button" onClick={reset} className="btn btn-ghost btn-md mt-4">
            Record again
          </button>
        </>
      )}

      {state === "denied" && (
        <>
          <p className="font-display text-[1.125rem] text-bone-50">Microphone not available</p>
          <p className="mt-1.5 text-[0.875rem] text-bone-400">
            Allow microphone access in your browser, or save this as a story instead.
          </p>
          <button type="button" onClick={() => setState("idle")} className="btn btn-ghost btn-md mt-4">
            Try again
          </button>
        </>
      )}
    </div>
  );
}
