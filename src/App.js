import React, { useState, useEffect, useRef } from "react";
import "./styles.css";
import { useRive, Layout, Fit, Alignment } from "@rive-app/react-canvas";
import JSZip from "jszip"; 
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

  // Храним значения для текстовых полей (Rive textRunValue)
  const [textValues, setTextValues] = useState({
    "95 PREM": "",
    "92 ECO": "",
    "92 EURO": "",
    "DIESEL": "",
    "GAS": "",
    "COFFEE": ""
  });

  // Храним массив кадров (base64 PNG)
  const [frames, setFrames] = useState([]);

  // Флаг, показывающий, идёт ли «запись» кадров
  const [isRecording, setIsRecording] = useState(false);

  // ffmpeg (новое API)
  const ffmpegRef = useRef(null);
  const [isFFmpegReady, setIsFFmpegReady] = useState(false);

  // Флаг конвертации в MP4
  const [isConverting, setIsConverting] = useState(false);

  // Инициализируем ffmpeg при монтировании
  useEffect(() => {
    (async () => {
      const ffmpeg = new FFmpeg({ log: true });
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

  // Обновление input
  const handleInputChange = (e, variableName) => {
    const { value } = e.target;
    setTextValues(prev => ({ ...prev, [variableName]: value }));
  };

  // Применяем изменение в Rive
  const handleApplyClick = (variableName) => {
    if (rive) {
      rive.setTextRunValue(variableName, textValues[variableName]);
    }
  };

  // --------------------------------
  // 1) Записать PNG-секвенцию (8 сек)
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
    const fps = 30;
    const interval = 1000 / fps; 
    let elapsed = 0;
    const maxDuration = 8000; // 8 секунд

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
    };
  };

  // ---------------------------------------------------
  // 2) Сконвертировать уже снятые PNG в MP4 (через ffmpeg)
  // ---------------------------------------------------
  const handleConvertToVideoClick = async () => {
    if (!isFFmpegReady) {
      alert("FFmpeg ещё не готов, попробуйте позже...");
      return;
    }
    if (!frames || frames.length === 0) {
      alert("Пока нет снятых кадров. Сначала нажмите «Записать PNG-секвенцию»!");
      return;
    }
    if (isConverting) {
      alert("Уже идёт конвертация!");
      return;
    }

    setIsConverting(true);
    try {
      const ffmpeg = ffmpegRef.current;

      // Удаляем старые файлы во внутренней FS
      // (на случай, если раньше была запись)
      try {
        // Пробуем пачкой удалить, игнорируем ошибки
        await ffmpeg.exec(["-y", "-i", "frame_%04d.png", "output.mp4"]);
      } catch (e) {
        /* ignore */
      }

      // Записываем кадры frame_0001.png, frame_0002.png... 
      for (let i = 0; i < frames.length; i++) {
        const indexStr = String(i + 1).padStart(4, "0"); 
        const filename = `frame_${indexStr}.png`;

        // конвертируем dataURL в Blob
        const blob = dataURLtoBlob(frames[i]); 
        // пишем в виртуальную FS
        await ffmpeg.writeFile(filename, await fetchFile(blob));

        // Например, после writeFile:
        await ffmpeg.writeFile("frame_0001.png", await fetchFile(blob));

        // Можете попробовать:
        try {
          const testData = await ffmpeg.readFile("frame_0001.png");
          console.log("Считали frame_0001.png, размер:", testData.length);
        } catch (e) {
          console.error("Не удалось прочитать frame_0001.png:", e);
        }

      }

      // Собираем в output.mp4
      // -framerate 30, -i frame_%04d.png => output.mp4
      // -pix_fmt yuv420p для совместимости с плеерами
      await ffmpeg.exec([
        "-framerate", "30",
        "-i", "frame_%04d.png",
        "-pix_fmt", "yuv420p",
        "-c:v", "libx264",
        "output.mp4"
      ]);

      // Читаем результат
      const data = await ffmpeg.readFile("output.mp4");
      const mp4Blob = new Blob([data.buffer], { type: "video/mp4" });
      const mp4Url = URL.createObjectURL(mp4Blob);

      // Предлагаем скачать MP4
      const a = document.createElement("a");
      a.href = mp4Url;
      a.download = "animation.mp4";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(mp4Url);

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

      <div style={{ marginTop: "20px" }}>
        {/* Кнопка записи PNG */}
        <button onClick={handleRecordPngClick} disabled={isRecording}>
          {isRecording ? "Идёт запись..." : "Записать PNG-секвенцию (8 секунд)"}
        </button>
      </div>

      <div style={{ marginTop: "20px" }}>
        {/* Кнопка конвертации в MP4 */}
        <button onClick={handleConvertToVideoClick} disabled={isConverting}>
          {isConverting ? "Конвертация..." : "Сконвертировать в MP4"}
        </button>
      </div>
    </div>
  );
}
