//  src\hooks\useRiveRecorder\frameRecorder.js

import { dataURLtoBlob } from "./utils/dataURLtoBlob";
import { getProgressBar } from "./utils/getProgressBar";
import { fetchFile } from "@ffmpeg/util";

export async function recordFrames({
  rive,
  stateMachineName,
  addLog,
  updateLastLog,
  ffmpeg,
}) {
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
        updateLastLog(
          `Шаг 2/6: Запись кадров: ${getProgressBar(progressPercent)}`
        );
      }
      if (elapsed >= maxDuration) {
        clearInterval(timerId);
        resolve();
      }
    }, interval);
  });

  updateLastLog(`Шаг 2/6: Запись завершена, всего ${frames.length} кадров.`);

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
    const percent = Math.min(
      100,
      Math.round((buildCount / TOTAL_PACKETS) * 100)
    );
    updateLastLog(`Шаг 4/6: Сборка видео: ${getProgressBar(percent)}`);
  });

  await ffmpeg.exec([
    "-framerate",
    "30",
    "-start_number",
    "1",
    "-i",
    "frame_%04d.png",
    "-c:v",
    "libx264",
    "-pix_fmt",
    "yuv420p",
    "main.mp4",
  ]);

  updateLastLog("Шаг 4/6: Сборка видео — завершена.");
}
