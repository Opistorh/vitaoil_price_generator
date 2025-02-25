import React, { useState, useEffect, useRef } from "react";
import "./styles.css";
import { useRive, Layout, Fit, Alignment } from "@rive-app/react-canvas";
import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile } from "@ffmpeg/util";

// Конвертация dataURL -> Blob
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

export default function App() {
  const stateMachineName = "State Machine 1";

  // Инициализируем Rive
  const { rive, RiveComponent } = useRive({
    src: "vitaoil.riv",
    stateMachines: stateMachineName,
    autoplay: true,
    layout: new Layout({
      fit: Fit.Cover,
      alignment: Alignment.Center
    })
  });

  // Храним значения для текстовых переменных
  const [textValues, setTextValues] = useState({
    "95 PREM": "",
    "92 ECO": "",
    "92 EURO": "",
    DIESEL: "",
    GAS: "",
    COFFEE: ""
  });

  // FFmpeg
  const ffmpegRef = useRef(null);
  const [isFFmpegReady, setIsFFmpegReady] = useState(false);

  // Флаг процесса (true, когда идёт запись и/или конвертация)
  const [isProcessing, setIsProcessing] = useState(false);

  // Инициализация FFmpeg
  useEffect(() => {
    (async () => {
      const ffmpeg = new FFmpeg({ log: true });
      ffmpeg.on("log", ({ type, message }) => {
        console.log(`[FFmpeg ${type}]: ${message}`);
      });
      await ffmpeg.load();
      ffmpegRef.current = ffmpeg;
      setIsFFmpegReady(true);
      console.log("FFmpeg загружен (новый API).");
    })();
  }, []);

  // После загрузки Rive читаем начальные текстовые значения
  useEffect(() => {
    if (rive) {
      setTextValues({
        "95 PREM": rive.getTextRunValue("95 PREM") || "",
        "92 ECO": rive.getTextRunValue("92 ECO") || "",
        "92 EURO": rive.getTextRunValue("92 EURO") || "",
        DIESEL: rive.getTextRunValue("DIESEL") || "",
        GAS: rive.getTextRunValue("GAS") || "",
        COFFEE: rive.getTextRunValue("COFFEE") || ""
      });
    }
  }, [rive]);

  // Обработчик изменения текстовых инпутов
  const handleInputChange = (e, variableName) => {
    const { value } = e.target;
    setTextValues(prev => ({ ...prev, [variableName]: value }));
  };

  // Применяем новое значение в Rive
  const handleApplyClick = (variableName) => {
    if (rive) {
      rive.setTextRunValue(variableName, textValues[variableName]);
    }
  };

  // Главная кнопка: «Записать 8 сек и скачать видео»
  const handleRecordAndConvertClick = async () => {
    if (!rive) {
      alert("Rive не инициализирован!");
      return;
    }
    if (!isFFmpegReady) {
      alert("FFmpeg ещё не готов, попробуйте позже...");
      return;
    }
    if (isProcessing) {
      alert("Уже идёт процесс записи/конвертации!");
      return;
    }

    setIsProcessing(true);

    try {
      //----------------------------------
      // 1) Сбрасываем анимацию на 0
      //----------------------------------
      try {
        rive.stop(stateMachineName);
        rive.play(stateMachineName);
        console.log("Анимация сброшена и запущена с нуля.");
      } catch (err) {
        console.error("Ошибка при сбросе анимации:", err);
        throw err;
      }

      //----------------------------------
      // 2) Запись кадров (PNG) ~8 секунд
      //----------------------------------
      const canvas = document.querySelector("canvas");
      if (!canvas) {
        throw new Error("Canvas с Rive не найден!");
      }

      const frames = [];
      const fps = 30;
      const interval = 1000 / fps;
      let elapsed = 0;
      const maxDuration = 8000;

      // Запускаем setInterval
      await new Promise(resolve => {
        const timerId = setInterval(() => {
          elapsed += interval;
          const dataURL = canvas.toDataURL("image/png");
          frames.push(dataURL);
          console.log(`Кадр #${frames.length} снят.`);
          if (elapsed >= maxDuration) {
            clearInterval(timerId);
            resolve();
          }
        }, interval);
      });

      console.log(`Запись завершена, всего кадров: ${frames.length}`);

      //----------------------------------
      // 3) Записываем кадры в FS ffmpeg
      //----------------------------------
      const ffmpeg = ffmpegRef.current;

      // Удалим старые файлы, если были
      try {
        await ffmpeg.exec(["-v", "error", "-y", "-i", "frame_%04d.png", "dummy.mp4"]);
      } catch (err) {
        /* игнорируем */
      }

      // Записываем кадры во внутреннюю FS
      for (let i = 0; i < frames.length; i++) {
        const indexStr = String(i + 1).padStart(4, "0");
        const filename = `frame_${indexStr}.png`;
        const blob = dataURLtoBlob(frames[i]);
        await ffmpeg.writeFile(filename, await fetchFile(blob));
      }

      //----------------------------------
      // 4) Вызываем ffmpeg для сборки MP4 (H.264)
      //----------------------------------
      console.log("Запуск FFmpeg...");
      // Укажем -framerate 30, -start_number 1, вход: frame_%04d.png
      await ffmpeg.exec([
        "-framerate", "30",
        "-start_number", "1",
        "-i", "frame_%04d.png",
        "-c:v", "libx264",
        "-pix_fmt", "yuv420p",
        "output.mp4"
      ]);

      //----------------------------------
      // 5) Читаем output.mp4 и скачиваем
      //----------------------------------
      const outputData = await ffmpeg.readFile("output.mp4");
      console.log("Размер output.mp4:", outputData.length, "байт");
      if (outputData.length === 0) {
        throw new Error("Файл output.mp4 пуст!");
      }

      // Создаём Blob, скачиваем как animation.mp4
      const mp4Blob = new Blob([outputData.buffer], { type: "video/mp4" });
      const mp4Url = URL.createObjectURL(mp4Blob);
      const a = document.createElement("a");
      a.href = mp4Url;
      a.download = "animation.mp4";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(mp4Url);

      console.log("Видео готово и скачано (animation.mp4).");
    } catch (err) {
      console.error("Ошибка при записи/сборке видео:", err);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="App">
      <div className="container">
        <RiveComponent />
      </div>

      <div className="controls">
        {Object.keys(textValues).map(variableName => (
          <div className="text-run-control" key={variableName}>
            <label>
              {variableName}:{" "}
              <input
                type="text"
                value={textValues[variableName]}
                onChange={e => handleInputChange(e, variableName)}
              />
            </label>
            <button onClick={() => handleApplyClick(variableName)}>
              Применить
            </button>
          </div>
        ))}
      </div>

      {/* Одна кнопка для записи и конвертации */}
      <div style={{ marginTop: "20px" }}>
        <button onClick={handleRecordAndConvertClick} disabled={isProcessing}>
          {isProcessing
            ? "Подготовка файла..."
            : "Скачать видео"
          }
        </button>
      </div>
    </div>
  );
}
