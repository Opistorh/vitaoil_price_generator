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
  isCoffeeOn,
  isGasOn,
  isArrowLeft,
}) {
  addLog("Шаг 1/6: Подготовка к записи анимации...");

  // Логируем входные параметры
  // console.log('Параметры для записи:', { isCoffeeOn, isGasOn, isArrowLeft });

  // Перезапускаем анимацию
  rive.stop(stateMachineName);
  rive.play(stateMachineName);

  // Пересоздаём и привязываем fresh ViewModel к новому SM-инстансу
  // console.log('Пересоздание View Model...');
  const vm = rive.viewModelByName("View Model 1");
  if (!vm) throw new Error("ViewModel не найдена");
  
  const newVmi = vm.defaultInstance();
  rive.bindViewModelInstance(newVmi);
  rive.vmi = newVmi;

  // console.log('View Model пересоздана и привязана');

  // Сразу восстанавливаем состояния в новом инстансе
  if (rive.vmi) {
    // console.log('Состояние перед установкой значений в новый инстанс:');
    const beforeState = {
      coffee_price_show: rive.vmi.boolean("coffee_price_show")?.value,
      gas_price_show: rive.vmi.boolean("gas_price_show")?.value,
      arrows_left: rive.vmi.boolean("arrows_left")?.value,
    };
    // console.log(beforeState);

    const coffee = rive.vmi.boolean("coffee_price_show");
    const gas    = rive.vmi.boolean("gas_price_show");
    const arrows = rive.vmi.boolean("arrows_left");

    if (coffee) {
      coffee.value = isCoffeeOn;
      // console.log('Установлено coffee_price_show в новом инстансе:', isCoffeeOn);
    } else {
      // console.warn('Не найдено свойство coffee_price_show');
    }

    if (gas) {
      gas.value = isGasOn;
      // console.log('Установлено gas_price_show в новом инстансе:', isGasOn);
    } else {
      // console.warn('Не найдено свойство gas_price_show');
    }

    if (arrows) {
      arrows.value = isArrowLeft;
      // console.log('Установлено arrows_left в новом инстансе:', isArrowLeft);
    } else {
      // console.warn('Не найдено свойство arrows_left');
    }

    // console.log('Состояние после установки значений в новый инстанс:');
    const afterState = {
      coffee_price_show: rive.vmi.boolean("coffee_price_show")?.value,
      gas_price_show: rive.vmi.boolean("gas_price_show")?.value,
      arrows_left: rive.vmi.boolean("arrows_left")?.value,
    };
    // console.log(afterState);
  } else {
    // console.error('Новый View Model Instance не привязался!');
  }

  const canvas = document.querySelector("canvas");
  if (!canvas) throw new Error("Canvas с Rive не найден!");
  console.log("Canvas width:", canvas.width, "Canvas height:", canvas.height);
  console.log("Canvas style width:", canvas.style.width, "Canvas style height:", canvas.style.height);

  const frames = [];
  const fps = 30;
  const interval = 1000 / fps;
  const maxDuration = 21000;
  const totalFrames = Math.floor((maxDuration / 1000) * fps);
  let elapsed = 0;
  let progressPercent = 0;

  addLog("Шаг 2/6: Запись кадров...");
  await new Promise((resolve) => {
    const timerId = setInterval(() => {
      elapsed += interval;
      const dataURL = canvas.toDataURL("image/png");
      // Проверка размеров кадра
      const img = new window.Image();
      img.src = dataURL;
      img.onload = function() {
        console.log(`Frame ${frames.length + 1}:`, img.width, img.height);
        // Если кадр не 320x374, делаем ресайз
        if (img.width !== 320 || img.height !== 374) {
          const tempCanvas = document.createElement("canvas");
          tempCanvas.width = 320;
          tempCanvas.height = 374;
          const ctx = tempCanvas.getContext("2d");
          ctx.drawImage(img, 0, 0, 320, 374);
          const resizedDataURL = tempCanvas.toDataURL("image/png");
          frames.push(resizedDataURL);
        } else {
          frames.push(dataURL);
        }
      };

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
  
  // Используем количество кадров для более точного отслеживания прогресса
  const expectedFrames = frames.length;
  let processedFrames = 0;

  ffmpeg.on("log", ({ message }) => {
    // Ищем сообщение о текущем кадре в формате frame=xxx
    const frameMatch = message.match(/frame=\s*(\d+)/);
    if (frameMatch) {
      processedFrames = parseInt(frameMatch[1], 10);
      const percent = Math.min(100, Math.round((processedFrames / expectedFrames) * 100));
      updateLastLog(`Шаг 4/6: Сборка видео: ${getProgressBar(percent)}`);
    }
  });
  await ffmpeg.exec([
    "-progress", "1",
    "-v", "info",
    "-framerate",
    "30",
    "-start_number",
    "1",
    "-i",
    "frame_%04d.png",
    "-vf",
    "scale=320:374",
    "-c:v",
    "libx264",
    "-preset",
    "ultrafast",
    "-tune",
    "zerolatency",
    "-crf",
    "23",
    "-pix_fmt",
    "yuv420p",
    "-movflags",
    "+faststart",
    "main.mp4",
  ]);

  updateLastLog("Шаг 4/6: Сборка видео — завершена.");
}
