import React, { useState, useEffect, useRef } from "react";
import "./styles.css";
import { useRive, Layout, Fit, Alignment } from "@rive-app/react-canvas";
import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile } from "@ffmpeg/util";

// Утилита: конвертация dataURL -> Blob (нужно для ffmpeg)
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

  // Хелпер для записи лога на экран + в консоль
  function addLog(message) {
    setLogs((prevLogs) => [message, ...prevLogs].slice(0, 200)); // храним только 200 последних
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

  // Храним кадры (base64 PNG)
  const [frames, setFrames] = useState([]);

  // Флаги
  const [isRecording, setIsRecording] = useState(false);
  const [isConverting, setIsConverting] = useState(false);

  // FFmpeg
  const ffmpegRef = useRef(null);
  const [isFFmpegReady, setIsFFmpegReady] = useState(false);

  // Инициализация FFmpeg (log: true для включения базовых логов)
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

  // Автообновление в Rive при изменении input
  const handleInputChange = (e, variableName) => {
    const { value } = e.target;
    setTextValues((prev) => ({ ...prev, [variableName]: value }));
    if (rive) {
      rive.setTextRunValue(variableName, value);
      addLog(`Поле "${variableName}" изменено на "${value}"`);
    }
  };

  // --------------------------------
  // 1) Записать PNG-секвенцию (13 сек)
  // --------------------------------
  const handleRecordPngClick = () => {
    if (!rive) {
      alert("Rive не инициализирован!");
      return;
    }
    if (isRecording) {
      alert("Сейчас уже идёт запись кадров!");
      return;
    }

    // Сбрасываем анимацию
    try {
      rive.stop(stateMachineName);
      rive.play(stateMachineName);
      addLog("Анимация сброшена и запущена с нуля.");
    } catch (err) {
      addLog("Ошибка при сбросе анимации: " + err);
      return;
    }

    // Очищаем старые кадры, если есть
    setFrames([]);

    // Находим canvas
    const canvas = document.querySelector("canvas");
    if (!canvas) {
      addLog("Canvas с Rive не найден!");
      return;
    }

    // Начинаем «запись»
    setIsRecording(true);

    const newFrames = [];
    const fps = 60;
    const interval = 1000 / fps;
    let elapsed = 0;
    const maxDuration = 13000; // 13 секунд

    const timerId = setInterval(() => {
      elapsed += interval;
      const dataURL = canvas.toDataURL("image/png");
      newFrames.push(dataURL);
      addLog(`Кадр #${newFrames.length} снят.`);
      if (elapsed >= maxDuration) {
        clearInterval(timerId);
        finishRecording(newFrames);
      }
    }, interval);

    const finishRecording = (collectedFrames) => {
      setFrames(collectedFrames);
      setIsRecording(false);
      addLog(`Запись завершена, всего кадров: ${collectedFrames.length}`);
    };
  };

  // ---------------------------------------------------
  // 2) Сконвертировать уже снятые PNG в WebM (через ffmpeg)
  // ---------------------------------------------------
  const handleConvertToVideoClick = async () => {
    if (!isFFmpegReady) {
      alert("FFmpeg ещё не готов...");
      return;
    }
    if (!frames || frames.length === 0) {
      alert("Нет кадров, сначала запишите PNG.");
      return;
    }
    if (isConverting) {
      alert("Уже идёт конвертация!");
      return;
    }

    setIsConverting(true);

    try {
      const ffmpeg = ffmpegRef.current;
      // Почистить виртуальные файлы
      try {
        await ffmpeg.exec(["-v", "verbose","-y", "-i", "frame_%04d.png", "dummy.webm"]);
      } catch (err) {
        // игнор
      }

      // Записываем кадры
      for (let i = 0; i < frames.length; i++) {
        const indexStr = String(i + 1).padStart(4, "0");
        const filename = `frame_${indexStr}.png`;
        const blob = dataURLtoBlob(frames[i]);
        addLog(`Пишем ${filename}, размер blob = ${blob.size} байт...`);
        await ffmpeg.writeFile(filename, await fetchFile(blob));
        try {
          const test = await ffmpeg.readFile(filename);
          addLog(`Записалось: ${filename}, размер = ${test.length}`);
        } catch (err) {
          addLog(`Не удалось прочитать после записи ${filename}: ${err}`);
        }
      }

      addLog("Запуск FFmpeg (exec)...");
      await ffmpeg.exec([
        "-framerate", "60",            // или 30
        "-start_number", "1",         // первый кадр
        "-i", "frame_%04d.png",       // шаблон
        "-c:v", "libx264",
        "-pix_fmt", "yuv420p",
        "output.mp4",
      ]);

      let outputData;
      try {
        outputData = await ffmpeg.readFile("output.mp4");
        addLog(`Размер output.mp4: ${outputData.length} байт`);
      } catch (err) {
        addLog("Не удалось прочитать output.mp4: " + err);
        throw err;
      }

      if (outputData.length === 0) {
        throw new Error("Файл output.mp4 пуст!");
      }

      const webmBlob = new Blob([outputData.buffer], { type: "video/webm" });
      const webmUrl = URL.createObjectURL(webmBlob);

      const a = document.createElement("a");
      a.href = webmUrl;
      a.download = "animation.mp4";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(webmUrl);

      addLog("Видео готово и скачано (animation.mp4).");
    } catch (err) {
      addLog("Ошибка при сборке видео: " + err);
    } finally {
      setIsConverting(false);
    }
  };

  return (
    <div className="App" style={{ fontFamily: "sans-serif", padding: "1rem" }}>
      <div className="container">
        <RiveComponent />
      </div>

      <div className="controls" style={{ marginTop: "1rem" }}>
        {Object.keys(textValues).map((variableName) => (
          <div className="text-run-control" key={variableName} style={{ marginBottom: "0.5rem" }}>
            <label>
              {variableName}: {" "}
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

      <div style={{ marginTop: "20px"}}>
        <button 
          onClick={handleRecordPngClick} 
          disabled={isRecording} 
          style={{ fontSize: "16px", padding: "10px" }}
        >
          {isRecording ? "Идёт запись..." : "Записать PNG-секвенцию (13 секунд)"}
        </button>
      </div>

      <div style={{ marginTop: "20px" }}>
        <button
          onClick={handleConvertToVideoClick}
          disabled={isConverting || frames.length === 0}
          style={{ fontSize: "16px", padding: "10px" }}
        >
          {isConverting ? "Конвертация..." : "Сконвертировать в WebM"}
        </button>
      </div>

      {/* Блок лога */}
      <div style={{ marginTop: "20px" }}>
        <h3>Логи</h3>
        <div
          style={{
            maxHeight: "200px",
            overflowY: "auto",
            border: "1px solid #ccc",
            padding: "0.5rem",
          }}
        >
          {logs.map((log, i) => (
            <div key={i} style={{ marginBottom: "0.2rem" }}>
              {log}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
