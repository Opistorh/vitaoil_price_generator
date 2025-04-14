// hooks/useRiveRecorder.js
import { useRef, useState, useEffect } from "react";
import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile } from "@ffmpeg/util";

function dataURLtoBlob(dataURL) {
  const arr = dataURL.split(",");
  const mime = arr[0].match(/:(.*?);/)[1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new Blob([u8arr], { type: mime });
}

function getProgressBar(percent, barLength = 20) {
  const filledLength = Math.round((percent / 100) * barLength);
  const bar = "#".repeat(filledLength) + "-".repeat(barLength - filledLength);
  return `[${bar}] ${percent.toFixed(0)}%`;
}

export function useRiveRecorder({ addLog, updateLastLog }) {
  const ffmpegRef = useRef(null);
  const [isReady, setIsReady] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const outputResolutionRef = useRef(null);

  useEffect(() => {
    (async () => {
      const ffmpeg = new FFmpeg({ log: true });
      ffmpeg.on("log", ({ message }) => {
        addLog(`[ffmpeg] ${message}`);

        if (!outputResolutionRef.current) {
          const match = message.match(/(\d+)x(\d+)/);
          if (match) {
            outputResolutionRef.current = {
              width: parseInt(match[1], 10),
              height: parseInt(match[2], 10),
            };
          }
        }
      });
      await ffmpeg.load();
      ffmpegRef.current = ffmpeg;
      setIsReady(true);
      addLog("FFmpeg готов к работе.");
    })();
  }, []);

  const recordAndDownload = async ({ rive, stateMachineName }) => {
    if (!rive) return alert("Rive не инициализирован!");
    if (!isReady) return alert("FFmpeg ещё не готов!");
    if (isProcessing) return alert("Уже идёт запись/конвертация!");

    setIsProcessing(true);
    try {
      addLog("Шаг 1/6: Запуск анимации...");
      rive.stop(stateMachineName);
      rive.play(stateMachineName);

      const canvas = document.querySelector("canvas");
      if (!canvas) throw new Error("Canvas с Rive не найден!");

      const frames = [];
      const fps = 30;
      const interval = 1000 / fps;
      const maxDuration = 14000;
      const totalFrames = Math.floor((maxDuration / 1000) * fps);
      let elapsed = 0;
      let progressPercent = 0;

      addLog("Шаг 2/6: Запись кадров...");
      await new Promise((resolve) => {
        const timerId = setInterval(() => {
          elapsed += interval;
          const dataURL = canvas.toDataURL("image/png");
          frames.push(dataURL);

          const currentFrame = frames.length;
          const newPercent = Math.floor((currentFrame / totalFrames) * 100);
          if (newPercent !== progressPercent) {
            progressPercent = newPercent;
            updateLastLog(`Шаг 2/6: Запись кадров: ${getProgressBar(progressPercent)}`);
          }
          if (elapsed >= maxDuration) {
            clearInterval(timerId);
            resolve();
          }
        }, interval);
      });

      updateLastLog(`Шаг 2/6: Запись завершена, всего ${frames.length} кадров.`);

      const ffmpeg = ffmpegRef.current;

      addLog("Шаг 3/6: Подготовка кадров...");
      for (let i = 0; i < frames.length; i++) {
        const indexStr = String(i + 1).padStart(4, "0");
        const filename = `frame_${indexStr}.png`;
        const blob = dataURLtoBlob(frames[i]);
        await ffmpeg.writeFile(filename, await fetchFile(blob));

        const percent = Math.floor(((i + 1) / frames.length) * 100);
        updateLastLog(`Шаг 3/6: Подготовка кадров: ${getProgressBar(percent)}`);
      }
      updateLastLog("Шаг 3/6: Подготовка кадров — завершена.");

      addLog("Шаг 4/6: Сборка основного видео...");
      let buildCount = 0;
      const TOTAL_PACKETS = 180;

      ffmpeg.on("progress", () => {
        buildCount++;
        const percent = Math.min(100, Math.round((buildCount / TOTAL_PACKETS) * 100));
        updateLastLog(`Шаг 4/6: Сборка видео: ${getProgressBar(percent)}`);
      });

      await ffmpeg.exec([
        "-framerate", "30",
        "-start_number", "1",
        "-i", "frame_%04d.png",
        "-c:v", "libx264",
        "-pix_fmt", "yuv420p",
        "main.mp4",
      ]);

      updateLastLog("Шаг 4/6: Сборка видео — завершена.");

      // Загружаем coffee.mp4
      addLog("Шаг 5/6: Склейка с coffee.mp4...");
      const coffeeData = await fetchFile("/coffee.mp4");
      await ffmpeg.writeFile("coffee.mp4", coffeeData);

      const resolution = outputResolutionRef.current;
      if (!resolution) throw new Error("Не удалось определить разрешение Rive-видео");

      await ffmpeg.exec([
        "-i", "main.mp4",
        "-r", "30",
        "-i", "coffee.mp4",
        "-filter_complex",
        `[0:v]fps=30,format=yuv420p[v0];` +
        `[1:v]fps=30,scale=${resolution.width}:${resolution.height}:force_original_aspect_ratio=increase,crop=${resolution.width}:${resolution.height},format=yuv420p[v1];` +
        `[v0][v1]concat=n=2:v=1:a=0[out]`,
        "-map", "[out]",
        "-c:v", "libx264",
        "-pix_fmt", "yuv420p",
        "output.mp4",
      ]);

      updateLastLog("Шаг 5/6: Склейка завершена.");

      addLog("Шаг 6/6: Скачивание результата...");
      const outputData = await ffmpeg.readFile("output.mp4");
      if (!outputData?.length) throw new Error("Файл output.mp4 пуст или не прочитан!");

      const videoBlob = new Blob([outputData.buffer], { type: "video/mp4" });
      const videoUrl = URL.createObjectURL(videoBlob);
      const a = document.createElement("a");
      a.href = videoUrl;
      a.download = "animation.mp4";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(videoUrl);

      addLog("Готово! Файл animation.mp4 скачан.");
    } catch (err) {
      addLog("Ошибка: " + err);
      alert("Произошла ошибка:\n" + err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  return { isReady, isProcessing, recordAndDownload };
}