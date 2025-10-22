// src\hooks\useRiveRecorder\ffmpegController.js

import { FFmpeg } from "@ffmpeg/ffmpeg";

export async function initFFmpeg(addLog, outputResolutionRef) {
  const ffmpeg = new FFmpeg({ 
    log: true,
    coreURL: '/ffmpeg/ffmpeg-core.js',
    wasmURL: '/ffmpeg/ffmpeg-core.wasm',
    workerURL: '/ffmpeg/ffmpeg-worker.js'
  });
  
  // Подключаем логирование заранее, чтобы видеть процесс загрузки модулей
  handleFFmpegLogs(ffmpeg, addLog, outputResolutionRef);
  addLog("FFmpeg: инициализация...");
  addLog("FFmpeg: загрузка модулей из локальных файлов...");
  await ffmpeg.load();
  addLog("FFmpeg: модули загружены.");
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
  const TARGET_HEIGHT = 374;
  const TARGET_WIDTH = 320;

  async function executeFFmpeg(args, description) {
    addLog(`[FFmpeg] Начало: ${description}...`);
    try {
      await ffmpeg.exec(["-y", ...args]);
      addLog(`[FFmpeg] Успешно: ${description}`);
    } catch (error) {
      addLog(`[FFmpeg] Ошибка: ${description} - ${error.message}`);
      throw error;
    }
  }

  if (includeCoffee) {
    try {
      addLog("Шаг 5/6: Подготовка и склейка с coffee.mp4...");

      // Подготавливаем coffee.mp4
      const coffeeData = await fetchFile("/coffee.mp4");
      await ffmpeg.writeFile("coffee.mp4", coffeeData);

      // Масштабируем main.mp4
      await executeFFmpeg(
        [
          "-i",
          "main.mp4",
          "-vf",
          `scale=${TARGET_WIDTH}:${TARGET_HEIGHT},setsar=1,setdar=${TARGET_WIDTH}/${TARGET_HEIGHT}`,
          "-c:v",
          "libx264",
          "-preset",
          "ultrafast",
          "-crf",
          "23",
          "-pix_fmt",
          "yuv420p",
          "main_scaled.mp4",
        ],
        "Масштабирование main.mp4"
      );

      // Масштабируем coffee.mp4 по высоте, затем crop по ширине
      await executeFFmpeg(
        [
          "-i",
          "coffee.mp4",
          "-vf",
          `scale=-2:${TARGET_HEIGHT},crop=${TARGET_WIDTH}:${TARGET_HEIGHT},setsar=1,setdar=${TARGET_WIDTH}/${TARGET_HEIGHT}`,
          "-c:v",
          "libx264",
          "-preset",
          "ultrafast",
          "-crf",
          "23",
          "-pix_fmt",
          "yuv420p",
          "coffee_scaled.mp4",
        ],
        "Масштабирование по высоте и crop coffee.mp4"
      );

      // Склеиваем видео
      await executeFFmpeg(
        [
          "-i",
          "main_scaled.mp4",
          "-i",
          "coffee_scaled.mp4",
          "-filter_complex",
          "[0:v][1:v]concat=n=2:v=1:a=0[out]",
          "-map",
          "[out]",
          "-c:v",
          "libx264",
          "-preset",
          "ultrafast",
          "-crf",
          "23",
          "-pix_fmt",
          "yuv420p",
          "-movflags",
          "+faststart",
          "output.mp4",
        ],
        "Склейка видео"
      );

      updateLastLog("Шаг 5/6: Склейка завершена");
    } catch (error) {
      addLog(`[FFmpeg] Критическая ошибка: ${error.message}`);
      throw error;
    }
  } else {
    addLog("Шаг 5/6: Копирование main.mp4 без добавления кофе...");
    await executeFFmpeg(
      [
        "-i",
        "main.mp4",
        "-vf",
        `scale=${TARGET_WIDTH}:${TARGET_HEIGHT},setsar=1,setdar=${TARGET_WIDTH}/${TARGET_HEIGHT}`,
        "-c:v",
        "libx264",
        "-preset",
        "ultrafast",
        "-crf",
        "23",
        "-pix_fmt",
        "yuv420p",
        "output.mp4",
      ],
      "Обработка видео без coffee.mp4"
    );
    updateLastLog("Шаг 5/6: Финальная обработка видео завершена");
  }

  addLog("Шаг 6/6: Скачивание результата...");
  const outputData = await ffmpeg.readFile("output.mp4");
  if (!outputData?.length) {
    throw new Error("Файл output.mp4 пуст или не прочитан!");
  }

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
