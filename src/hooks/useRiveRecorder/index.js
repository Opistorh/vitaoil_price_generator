// src\hooks\useRiveRecorder\index.js

import { useState } from "react";
import { useFFmpeg } from "../../components/FFmpegProvider.jsx";
import { buildFinalVideo } from "./ffmpegController";
import { recordFrames } from "./frameRecorder";
import { fetchFile } from "@ffmpeg/util";

export function useRiveRecorder({ addLog, updateLastLog }) {
  const { ffmpeg, isReady, outputResolutionRef } = useFFmpeg();
  const [isProcessing, setIsProcessing] = useState(false);

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
