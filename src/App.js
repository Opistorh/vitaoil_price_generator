import React, { useState, useEffect, useRef } from "react";
import "./styles.css";
import { useRive, Layout, Fit, Alignment } from "@rive-app/react-canvas";
//import JSZip from "jszip"; 
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
      // Указываем log: true, чтобы включить базовый вывод
      const ffmpeg = new FFmpeg({ log: true });
  
      // Вместо setLogger и setLogLevel, теперь используем событие:
      ffmpeg.on("log", ({ type, message }) => {
        console.log(`[FFmpeg ${type}]: ${message}`);
      });
  
      await ffmpeg.load();
      ffmpegRef.current = ffmpeg;
      setIsFFmpegReady(true);
      console.log("FFmpeg загружен (новый API).");
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
    }
  }, [rive]);

  // Автообновление в Rive при изменении input
  const handleInputChange = (e, variableName) => {
    const { value } = e.target;
    setTextValues(prev => ({ ...prev, [variableName]: value }));
    if (rive) {
      rive.setTextRunValue(variableName, value);
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
      console.log("Анимация сброшена и запущена с нуля.");
    } catch (err) {
      console.error("Ошибка при сбросе анимации:", err);
      return;
    }

    // Очищаем старые кадры, если есть
    setFrames([]);

    // Находим canvas
    const canvas = document.querySelector("canvas");
    if (!canvas) {
      console.error("Canvas с Rive не найден!");
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
      console.log(`Кадр #${newFrames.length} снят.`);
      if (elapsed >= maxDuration) {
        clearInterval(timerId);
        finishRecording(newFrames);
      }
    }, interval);

    // Когда заканчивается
    const finishRecording = async (collectedFrames) => {
      setFrames(collectedFrames);
      setIsRecording(false);
      console.log(`Запись завершена, всего кадров: ${collectedFrames.length}`);

      // 2) Создаём ZIP из PNG
      /*
      const zip = new JSZip();
      collectedFrames.forEach((dataUrl, i) => {
        const filename = `frame_${String(i + 1).padStart(4, "0")}.png`;
        const base64Data = dataUrl.split(",")[1]; // после "base64,"
        zip.file(filename, base64Data, { base64: true });
      });

      // Генерируем ZIP (Blob) и скачиваем
      zip.generateAsync({ type: "blob" }).then(blob => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "frames.zip";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        console.log("frames.zip скачан.");
      });
      */
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

      // На всякий случай попробуем почистить виртуальные файлы
      // Удалять можно выборочно, но проще вызвать "левую" команду с -i
      try {
        await ffmpeg.exec(["-v", "verbose","-y", "-i", "frame_%04d.png", "dummy.webm"]);
      } catch (err) {
        // игнорируем
      }

      // Записываем кадры frame_0001.png, frame_0002.png, ...
      for (let i = 0; i < frames.length; i++) {
        const indexStr = String(i + 1).padStart(4, "0");
        const filename = `frame_${indexStr}.png`;

        const blob = dataURLtoBlob(frames[i]);
        console.log(`Пишем ${filename}, размер blob = ${blob.size} байт...`);
        // Сохраняем во внутреннюю FS ffmpeg
        await ffmpeg.writeFile(filename, await fetchFile(blob));
        try {
          const test = await ffmpeg.readFile(filename);
          console.log("Записалось:", filename, "размер =", test.length);
        } catch (err) {
          console.error("Не удалось прочитать после записи", filename, err);
        }
        
      }

      console.log("Запуск FFmpeg (exec)...");
      // Собираем в output.webm (VP9):
      await ffmpeg.exec([
  "-framerate", "60",            // или 30, как вам нужно
  "-start_number", "1",         // явно говорим, что первый кадр — frame_0001.png
  "-i", "frame_%04d.png",       // шаблон
  //"-frames:v", "64",             // ровно 8 кадров
  "-c:v", "libx264",
  "-pix_fmt", "yuv420p",
  "output.mp4",
]);


      // Проверим размер output.webm
      let outputData;
      try {
        outputData = await ffmpeg.readFile("output.mp4");
        console.log("Размер output.webm:", outputData.length, "байт");
      } catch (err) {
        console.error("Не удалось прочитать output.webm:", err);
        throw err;
      }
  
      if (outputData.length === 0) {
        throw new Error("Файл output.mp4 пуст!");
      }
  
      // Если не 0, значит всё ок
      const webmBlob = new Blob([outputData.buffer], { type: "video/webm" });
      const webmUrl = URL.createObjectURL(webmBlob);
  
      const a = document.createElement("a");
      a.href = webmUrl;
      a.download = "animation.mp4";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(webmUrl);
  
      console.log("Видео готово и скачано (animation.mp4).");
    } catch (err) {
      console.error("Ошибка при сборке видео:", err);
    } finally {
      setIsConverting(false);
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
              {variableName}: {" "}
              <input
                type="text"
                value={textValues[variableName]}
                onChange={e => handleInputChange(e, variableName)}
              />
            </label>
          </div>
        ))}
      </div>
  
      {/* Кнопка записи PNG */}
      <div style={{ marginTop: "20px"}}>
        <button 
        onClick={handleRecordPngClick} 
        disabled={isRecording} 
        style={{ fontSize: "16px", padding: "10px" }}>
          {isRecording ? "Идёт запись..." : "Записать PNG-секвенцию (13 секунд)"}
        </button>
      </div>
  
      {/* Кнопка конвертации в WebM */}
      <div style={{ marginTop: "20px" }}>
        <button
         onClick={handleConvertToVideoClick}
         disabled={isConverting || frames.length === 0}
         style={{ fontSize: "16px", padding: "10px" }}
        >
          {isConverting ? "Конвертация..." : "Сконвертировать в WebM"}
        </button>
      </div>

      
    </div>
  );
  
}
