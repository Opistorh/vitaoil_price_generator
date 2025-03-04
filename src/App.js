import React, { useState, useEffect, useRef } from "react";
import "./styles.css";
import { useRive, Layout, Fit, Alignment } from "@rive-app/react-canvas";
import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile } from "@ffmpeg/util";

// Утилита: конвертация dataURL -> Blob
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

  // Логи
  const [logs, setLogs] = useState([]);

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
      const ffmpeg = new FFmpeg({ log: true });
      ffmpeg.on("log", ({ type, message }) => {
        addLog(`[FFmpeg ${type}]: ${message}`);
      });

      await ffmpeg.load();
      ffmpegRef.current = ffmpeg;
      setIsFFmpegReady(true);
      addLog("FFmpeg загружен (новый API).");
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
      addLog("Начальное чтение значений текстовых полей из Rive завершено.");
    }
  }, [rive]);

  // ВАЛИДАЦИЯ
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
        // addLog(`Поле "${variableName}" изменено на "${value}"`);
      }
    }
  };

  // Функция записи и скачивания
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
      alert("Уже идёт запись и конвертация!");
      return;
    }

    setIsProcessing(true);

    try {
      // 1) Сбросить и запустить анимацию
      rive.stop(stateMachineName);
      rive.play(stateMachineName);
      addLog("Анимация сброшена и запущена с нуля.");

      // 2) Запись кадров (13 сек)
      const canvas = document.querySelector("canvas");
      if (!canvas) {
        throw new Error("Canvas с Rive не найден!");
      }

      const frames = [];
      const fps = 60;
      const interval = 1000 / fps;
      let elapsed = 0;
      const maxDuration = 13000; // 13 секунд

      addLog("Начинаем запись кадров...");
      await new Promise((resolve) => {
        const timerId = setInterval(() => {
          elapsed += interval;
          const dataURL = canvas.toDataURL("image/png");
          frames.push(dataURL);
          addLog(`Кадр #${frames.length} снят.`);
          if (elapsed >= maxDuration) {
            clearInterval(timerId);
            resolve();
          }
        }, interval);
      });
      addLog(`Запись завершена, всего кадров: ${frames.length}`);

      // 3) Используем FFmpeg для сборки видео
      addLog("Начинаем сборку видео из кадров...");
      const ffmpeg = ffmpegRef.current;

      // Для подстраховки удаляем мусор (если вдруг есть)
      try {
        await ffmpeg.exec(["-v", "verbose", "-y", "-i", "frame_%04d.png", "dummy.webm"]);
      } catch {
        // Игнорируем
      }

      // Записываем все кадры во внутреннюю ФС FFmpeg
      for (let i = 0; i < frames.length; i++) {
        const indexStr = String(i + 1).padStart(4, "0");
        const filename = `frame_${indexStr}.png`;
        const blob = dataURLtoBlob(frames[i]);
        addLog(`Пишем ${filename}, размер blob = ${blob.size} байт...`);
        await ffmpeg.writeFile(filename, await fetchFile(blob));
      }

      // Собираем MP4 (H.264, yuv420p)
      await ffmpeg.exec([
        "-framerate", "60",
        "-start_number", "1",
        "-i", "frame_%04d.png",
        "-c:v", "libx264",
        "-pix_fmt", "yuv420p",
        "output.mp4"
      ]);

      const outputData = await ffmpeg.readFile("output.mp4");
      if (!outputData || outputData.length === 0) {
        throw new Error("Файл output.mp4 пуст или не прочитан!");
      }

      // 4) Скачиваем результат
      addLog(`Видео собрано. Размер output.mp4: ${outputData.length} байт.`);
      const videoBlob = new Blob([outputData.buffer], { type: "video/mp4" });
      const videoUrl = URL.createObjectURL(videoBlob);

      const a = document.createElement("a");
      a.href = videoUrl;
      a.download = "animation.mp4";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(videoUrl);

      addLog("Видео успешно скачано (animation.mp4).");
    } catch (err) {
      addLog("Ошибка в процессе записи или конвертации: " + err);
      alert("Произошла ошибка:\n" + err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  // Стили
  const containerStyle = {
    maxWidth: "320px",
    margin: "0 auto",
    marginBottom: "32px",
  };

  const fullWidthStyle = {
    width: "100%",
  };

  const riveStyle = {
    height: "374px",
    width: "100%",
  };

  return (
    <div className="App" style={{ fontFamily: "sans-serif", padding: "1rem" }}>
      <div style={containerStyle}>
        {/* Rive-анимация на всю ширину */}
        <div style={riveStyle}>
          <RiveComponent />
        </div>

        {/* 
          Показываем блоки ввода и кнопку,
          только если процесс рендеринга/конвертации НЕ идёт 
        */}
        {!isProcessing && (
          <>
            {/* Блок с текстовыми полями */}
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

        {/* Консоль логов */}
        <div style={{ marginTop: "20px", ...fullWidthStyle }}>
          <div
            style={{
              maxHeight: "200px",
              overflowY: "auto",
              //border: "1px solid #ccc",
              padding: "0.5rem",
              backgroundColor: "#000"
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
