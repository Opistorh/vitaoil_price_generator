import React, { useState, useEffect, useRef } from "react";
import "./styles.css";
import { useRive, Layout, Fit, Alignment } from "@rive-app/react-canvas";
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

// Генерация прогресс-бара в стиле npm
// percent: число от 0 до 100
function getProgressBar(percent, barLength = 20) {
  const filledLength = Math.round((percent / 100) * barLength);
  const bar = "#".repeat(filledLength) + "-".repeat(barLength - filledLength);
  return `[${bar}] ${percent.toFixed(0)}%`;
}

export default function App() {
  const stateMachineName = "State Machine 1";

  const [logs, setLogs] = useState([]);

  // Выводим в консоль + запоминаем в состоянии
  function addLog(message) {
    setLogs((prevLogs) => [message, ...prevLogs].slice(0, 200));
    console.log(message);
  }

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

  // Текстовые значения
  const [textValues, setTextValues] = useState({
    "95 PREM": "",
    "92 ECO": "",
    "92 EURO": "",
    "DIESEL": "",
    "GAS": "",
    "COFFEE": ""
  });

  // FFmpeg
  const ffmpegRef = useRef(null);
  const [isFFmpegReady, setIsFFmpegReady] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Инициализация FFmpeg
  useEffect(() => {
    (async () => {
      const ffmpeg = new FFmpeg({ log: false });
      // Убираем подробные логи ffmpeg.on("log"...), чтобы не засорять вывод

      await ffmpeg.load();
      ffmpegRef.current = ffmpeg;
      setIsFFmpegReady(true);
      addLog("FFmpeg готов к работе.");
    })();
  }, []);

  // После инициализации Rive, считываем текущие значения текстовых полей
  useEffect(() => {
    if (rive) {
      setTextValues({
        "95 PREM": rive.getTextRunValue("95 PREM") || "",
        "92 ECO": rive.getTextRunValue("92 ECO") || "",
        "92 EURO": rive.getTextRunValue("92 EURO") || "",
        "DIESEL": rive.getTextRunValue("DIESEL") || "",
        "GAS": rive.getTextRunValue("GAS") || "",
        "COFFEE": rive.getTextRunValue("COFFEE") || ""
      });
      addLog("Чтение начальных значений текстовых полей завершено.");
    }
  }, [rive]);

  // Валидация
  const handleInputChange = (e, variableName) => {
    const { value } = e.target;
    let pattern;
    if (variableName === "COFFEE") {
      // До 4 цифр
      pattern = /^\d{0,4}$/;
    } else {
      // До 3 целых и 2 знака после запятой
      pattern = /^\d{0,3}(\.\d{0,2})?$/;
    }

    if (value === "" || pattern.test(value)) {
      setTextValues((prev) => ({ ...prev, [variableName]: value }));
      if (rive) {
        rive.setTextRunValue(variableName, value);
      }
    }
  };

  // Запись + скачивание
  const handleRecordAndDownloadClick = async () => {
    if (!rive) {
      alert("Rive не инициализирован!");
      return;
    }
    if (!isFFmpegReady) {
      alert("FFmpeg ещё не готов!");
      return;
    }
    if (isProcessing) {
      alert("Уже идёт запись/конвертация!");
      return;
    }

    setIsProcessing(true);
    setLogs([]); // Очистим логи для нового «прогонa» (по желанию)

    try {
      // Шаг 1: Сброс/запуск анимации
      addLog("Шаг 1/5: Запуск анимации...");
      rive.stop(stateMachineName);
      rive.play(stateMachineName);

      // Шаг 2: Запись кадров (примерно 13 сек)
      addLog("Шаг 2/5: Запись кадров...");
      const canvas = document.querySelector("canvas");
      if (!canvas) {
        throw new Error("Canvas с Rive не найден!");
      }
      const frames = [];
      const fps = 60;
      const interval = 1000 / fps;
      let elapsed = 0;
      const maxDuration = 13000; // 13 секунд
      const totalFrames = Math.floor((maxDuration / 1000) * fps);

      let progressPercent = 0;
      await new Promise((resolve) => {
        const timerId = setInterval(() => {
          elapsed += interval;
          const dataURL = canvas.toDataURL("image/png");
          frames.push(dataURL);

          // Обновим прогресс
          const currentFrame = frames.length;
          const newPercent = Math.floor((currentFrame / totalFrames) * 100);
          // Чтобы не спамить каждую миллисекунду, обновим лог, если процент растёт
          if (newPercent !== progressPercent) {
            progressPercent = newPercent;
            // Рисуем прогресс-бар
            addLog(`   Запись кадров: ${getProgressBar(progressPercent)}`);
          }

          if (elapsed >= maxDuration) {
            clearInterval(timerId);
            resolve();
          }
        }, interval);
      });
      addLog(`   Завершена запись ~${frames.length} кадров.`);

      // Шаг 3: Подготовка FFmpeg
      addLog("Шаг 3/5: Подготовка кадров...");
      const ffmpeg = ffmpegRef.current;

      // На всякий случай чистим старые
      try {
        await ffmpeg.exec([
          "-v",
          "error",
          "-y",
          "-i",
          "frame_%04d.png",
          "dummy.webm"
        ]);
      } catch {
        // игнорируем
      }

      // Запишем кадры во внутреннюю FS FFmpeg
      // Обновим прогресс похожим образом
      addLog("   Загружаем кадры во внутреннюю ФС...");
      for (let i = 0; i < frames.length; i++) {
        const indexStr = String(i + 1).padStart(4, "0");
        const filename = `frame_${indexStr}.png`;
        const blob = dataURLtoBlob(frames[i]);
        await ffmpeg.writeFile(filename, await fetchFile(blob));

        // Прогресс
        const percent = Math.floor(((i + 1) / frames.length) * 100);
        if (i % 10 === 0 || i === frames.length - 1) {
          addLog(`   Подготовка кадров: ${getProgressBar(percent)}`);
        }
      }

      // Шаг 4: Сборка MP4
      addLog("Шаг 4/5: Сборка видео (MP4, libx264)...");
      await ffmpeg.exec([
        "-framerate",
        "60",
        "-start_number",
        "1",
        "-i",
        "frame_%04d.png",
        "-c:v",
        "libx264",
        "-pix_fmt",
        "yuv420p",
        "output.mp4"
      ]);

      // Считываем готовый файл
      const outputData = await ffmpeg.readFile("output.mp4");
      if (!outputData || outputData.length === 0) {
        throw new Error("Файл output.mp4 пуст или не прочитан!");
      }
      addLog("   Видео собрано в память.");

      // Шаг 5: Скачивание
      addLog("Шаг 5/5: Скачивание результата...");
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

  // Стили
  const containerStyle = {
    maxWidth: "320px",
    margin: "0 auto",
    marginBottom: "32px"
  };

  const fullWidthStyle = {
    width: "100%"
  };

  const riveStyle = {
    height: "374px",
    width: "100%"
  };

  return (
    <div className="App" style={{ fontFamily: "sans-serif", padding: "1rem" }}>
      <div style={containerStyle}>
        {/* Rive-анимация */}
        <div style={riveStyle}>
          <RiveComponent />
        </div>

        {!isProcessing && (
          <>
            {/* Инпуты */}
            <div
              className="controls"
              style={{
                display: "flex",
                flexDirection: "column",
                marginTop: "1rem",
                ...fullWidthStyle
              }}
            >
              {Object.keys(textValues).map((variableName) => (
                <div
                  className="text-run-control"
                  key={variableName}
                  style={{ marginBottom: "0.5rem", width: "100%" }}
                >
                  <label
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      width: "100%"
                    }}
                  >
                    {variableName}:
                    <input
                      type="text"
                      value={textValues[variableName]}
                      onChange={(e) => handleInputChange(e, variableName)}
                      style={{ marginLeft: "0.5rem" }}
                    />
                  </label>
                </div>
              ))}
            </div>

            {/* Кнопка "Скачать видео" */}
            <div style={{ marginTop: "20px", ...fullWidthStyle }}>
              <button
                onClick={handleRecordAndDownloadClick}
                disabled={!isFFmpegReady}
                style={{ fontSize: "16px", padding: "10px", width: "100%" }}
              >
                Скачать видео
              </button>
            </div>
          </>
        )}

        {/* Логи */}
        <div style={{ marginTop: "20px", ...fullWidthStyle }}>
          <div
            style={{
              maxHeight: "200px",
              overflowY: "auto",
              backgroundColor: "#000",
              padding: "0.5rem"
            }}
          >
            {logs.map((log, i) => (
              <div
                key={i}
                style={{
                  marginBottom: "0.2rem",
                  color: "#00FF00",
                  fontSize: "10px"
                }}
              >
                {log}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
