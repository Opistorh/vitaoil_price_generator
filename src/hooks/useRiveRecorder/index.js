// src\hooks\useRiveRecorder\index.js

import { useRef, useState, useEffect } from "react";
import {
  initFFmpeg,
  handleFFmpegLogs,
  buildFinalVideo,
} from "./ffmpegController";
import { recordFrames } from "./frameRecorder";
import { fetchFile } from "@ffmpeg/util";

export function useRiveRecorder({ addLog, updateLastLog }) {
  const ffmpegRef = useRef(null);
  const [isReady, setIsReady] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const outputResolutionRef = useRef(null);
  useEffect(() => {
    // console.log("[useRiveRecorder] useEffect triggered");
    const initializeFFmpeg = async () => {
      if (ffmpegRef.current) {
        // FFmpeg уже инициализирован, просто обновляем состояние
        setIsReady(true);
        return;
      }

      const ffmpeg = await initFFmpeg(addLog);
      handleFFmpegLogs(ffmpeg, addLog, outputResolutionRef);
      ffmpegRef.current = ffmpeg;
      setIsReady(true);
      addLog("FFmpeg готов к работе.");
    };

    initializeFFmpeg();
  }, []);

  const recordAndDownload = async ({
    rive,
    stateMachineName,
    includeCoffee,
    isCoffeeOn,
    isGasOn,
    isArrowLeft,
  }) => {
    if (!rive) return alert("Rive не инициализирован!");
    if (!isReady) return alert("FFmpeg ещё не готов!");
    if (isProcessing) return alert("Уже идёт запись/конвертация!");

    setIsProcessing(true);

    try {
      const ffmpeg = ffmpegRef.current;
      const resolutionRef = outputResolutionRef;

      await recordFrames({
        rive,
        stateMachineName,
        addLog,
        updateLastLog,
        ffmpeg,
        isCoffeeOn,
        isGasOn,
        isArrowLeft,
      });
      await buildFinalVideo({
        ffmpeg,
        resolutionRef,
        addLog,
        updateLastLog,
        fetchFile,
        includeCoffee,
      });
    } catch (err) {
      addLog("Ошибка: " + err);
      alert("Произошла ошибка:\n" + err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  return { isReady, isProcessing, recordAndDownload };
}
