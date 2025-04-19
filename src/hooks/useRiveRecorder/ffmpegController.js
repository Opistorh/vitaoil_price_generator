// src\hooks\useRiveRecorder\ffmpegController.js

import { FFmpeg } from "@ffmpeg/ffmpeg";

export async function initFFmpeg(addLog) {
  const ffmpeg = new FFmpeg({ log: true });
  await ffmpeg.load();
  return ffmpeg;
}

export function handleFFmpegLogs(ffmpeg, addLog, outputResolutionRef) {
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
}

export async function buildFinalVideo({
  ffmpeg,
  resolutionRef,
  addLog,
  updateLastLog,
  fetchFile,
  includeCoffee,
}) {
  const { width, height } = resolutionRef.current || {};
  if (!width || !height)
    throw new Error("Не удалось определить разрешение Rive-видео");

  if (includeCoffee) {
    addLog("Шаг 5/6: Склейка с coffee.mp4...");
    const coffeeData = await fetchFile("/coffee.mp4");
    await ffmpeg.writeFile("coffee.mp4", coffeeData);

    await ffmpeg.exec([
      "-i",
      "main.mp4",
      "-r",
      "30",
      "-i",
      "coffee.mp4",
      "-filter_complex",
      `[0:v]fps=30,format=yuv420p[v0];` +
        `[1:v]fps=30,scale=${width}:${height}:force_original_aspect_ratio=increase,crop=${width}:${height},format=yuv420p[v1];` +
        `[v0][v1]concat=n=2:v=1:a=0:unsafe=1[out]`,
      "-map",
      "[out]",
      "-c:v",
      "libx264",
      "-pix_fmt",
      "yuv420p",
      "-t",
      "19",
      "output.mp4",
    ]);

    updateLastLog("Шаг 5/6: Склейка завершена.");
  } else {
    addLog("Шаг 5/6: Копирование main.mp4 без добавления кофе...");
    await ffmpeg.rename("main.mp4", "output.mp4");
    updateLastLog("Шаг 5/6: Пропущена склейка, используем только Rive-видео.");
  }

  addLog("Шаг 6/6: Скачивание результата...");
  const outputData = await ffmpeg.readFile("output.mp4");
  if (!outputData?.length)
    throw new Error("Файл output.mp4 пуст или не прочитан!");

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
}
