import React, { useState, useEffect, useRef } from "react";
import "./styles.css";
import { useRive, Layout, Fit, Alignment } from "@rive-app/react-canvas";
import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile } from "@ffmpeg/util";

// Преобразуем dataURL в Blob
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
function getProgressBar(percent, barLength = 20) {
  const filledLength = Math.round((percent / 100) * barLength);
  const bar = "#".repeat(filledLength) + "-".repeat(barLength - filledLength);
  return `[${bar}] ${percent.toFixed(0)}%`;
}

// Функция разбора лога: подсвечивает часть с прогресс-баром
function parseLog(log) {
  // Поищем что-то вида [##--] 25%
  const progressBarRegex = /\[[#-]+\]\s?\d+%/;
  const match = log.match(progressBarRegex);

  // Если прогресс-бара в строке нет, выводим целиком белым
  if (!match) {
    return log;
  }

  // Иначе "рвём" строку, а нужный кусок красим в зелёный
  const index = match.index;
  const progressPart = match[0];
  const before = log.slice(0, index);
  const after = log.slice(index + progressPart.length);

  return (
    <>
      {before}
      <span style={{ color: "#00FF00" }}>{progressPart}</span>
      {after}
    </>
  );
}

export default function App() {
  const stateMachineName = "State Machine 1";

  // Логи и функция для добавления лог-сообщений
  const [logs, setLogs] = useState([]);

  function addLog(message) {
    setLogs((prevLogs) => [message, ...prevLogs].slice(0, 200));
    console.log(message);
  }

  function updateLastLog(newMessage) {
    setLogs((prevLogs) => {
      if (prevLogs.length === 0) {
        return [newMessage];
      }
      const newLogs = [...prevLogs];
      newLogs[0] = newMessage;
      return newLogs;
    });
    console.log("\r" + newMessage);
  }

  // Инициализация Rive
  const { rive, RiveComponent } = useRive({
    src: "vitaoil_discount.riv",
    stateMachines: stateMachineName,
    autoplay: true,
    layout: new Layout({
      fit: Fit.Cover,
      alignment: Alignment.Center
    })
  });

  // Текстовые значения (из текст-ранов в Rive)
  const [textValues, setTextValues] = useState({
    "95 PREM": "",
    "92 ECO": "",
    "92 EURO": "",
    "DIESEL": "",
    "GAS": "",
    "COFFEE": ""
  });

  // FFmpeg – создаём только один раз
  const ffmpegRef = useRef(null);
  const [isFFmpegReady, setIsFFmpegReady] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Загружаем FFmpeg (с логами)
  useEffect(() => {
    (async () => {
      const ffmpeg = new FFmpeg({ log: true });
      ffmpeg.on("log", ({ message }) => {
        addLog(`[ffmpeg] ${message}`);
      });

      await ffmpeg.load();
      ffmpegRef.current = ffmpeg;
      setIsFFmpegReady(true);
      addLog("FFmpeg готов к работе.");
    })();
  }, []);

  // После инициализации Rive — читаем текущие значения текст-ранов
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

  // Обработчик ввода
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

  // Непосредственно запись, сборка и скачивание
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
    setLogs([]); // очистим логи для нового прогона

    try {
      // Шаг 1
      addLog("Шаг 1/5: Запуск анимации...");
      rive.stop(stateMachineName);
      rive.play(stateMachineName);

      // Шаг 2: Запись ~13 секунд
      addLog("Шаг 2/5: Запись кадров...");
      const canvas = document.querySelector("canvas");
      if (!canvas) {
        throw new Error("Canvas с Rive не найден!");
      }
      const frames = [];
      const fps = 60;
      const interval = 1000 / fps;
      let elapsed = 0;
      const maxDuration = 14000; // 13 секунд
      const totalFrames = Math.floor((maxDuration / 1000) * fps);

      let progressPercent = 0;
      await new Promise((resolve) => {
        const timerId = setInterval(() => {
          elapsed += interval;
          const dataURL = canvas.toDataURL("image/png");
          frames.push(dataURL);

          // Прогресс записи
          const currentFrame = frames.length;
          const newPercent = Math.floor((currentFrame / totalFrames) * 100);
          if (newPercent !== progressPercent) {
            progressPercent = newPercent;
            updateLastLog(
              `Шаг 2/5: Запись кадров: ${getProgressBar(progressPercent)}`
            );
          }

          if (elapsed >= maxDuration) {
            clearInterval(timerId);
            resolve();
          }
        }, interval);
      });
      updateLastLog(`Шаг 2/5: Запись кадров завершена, всего ${frames.length} кадров.`);

      // Шаг 3
      addLog("Шаг 3/5: Подготовка кадров...");
      const ffmpeg = ffmpegRef.current;

      // Очищаем старые файлы (если были)
      try {
        await ffmpeg.exec(["-v", "error", "-y", "-i", "frame_%04d.png", "dummy.webm"]);
      } catch {
        // Игнорируем ошибку
      }

      // Загружаем кадры
      addLog("   Загружаем кадры во внутреннюю ФС...");
      for (let i = 0; i < frames.length; i++) {
        const indexStr = String(i + 1).padStart(4, "0");
        const filename = `frame_${indexStr}.png`;
        const blob = dataURLtoBlob(frames[i]);
        await ffmpeg.writeFile(filename, await fetchFile(blob));

        const percent = Math.floor(((i + 1) / frames.length) * 100);
        updateLastLog(`Шаг 3/5: Подготовка кадров: ${getProgressBar(percent)}`);
      }
      updateLastLog("Шаг 3/5: Подготовка кадров — завершена.");

      // Шаг 4: Сборка
      addLog("Шаг 4/5: Сборка видео (MP4, libx264)...");
      let buildCount = 0;
      const TOTAL_PACKETS = 80; // Условная оценка
      ffmpeg.on("progress", () => {
        buildCount++;
        const percent = Math.min(
          100,
          Math.round((buildCount / TOTAL_PACKETS) * 100)
        );
        updateLastLog(`Шаг 4/5: Сборка видео: ${getProgressBar(percent)}`);
      });

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

      updateLastLog("Шаг 4/5: Сборка видео — завершена.");

      // Шаг 5: Скачивание
      addLog("Шаг 5/5: Скачивание результата...");
      const outputData = await ffmpeg.readFile("output.mp4");
      if (!outputData || outputData.length === 0) {
        throw new Error("Файл output.mp4 пуст или не прочитан!");
      }
      addLog("   Видео собрано в память.");

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
        <div style={riveStyle}>
          <RiveComponent />
        </div>

        {!isProcessing && (
          <>
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

        {/* "Консоль" логов */}
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
                  color: "#FFFFFF",
                  fontSize: "10px"
                }}
              >
                {parseLog(log)}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
