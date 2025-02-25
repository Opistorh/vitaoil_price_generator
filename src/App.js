import React, { useState, useEffect, useRef } from "react";
import "./styles.css";
import { useRive, Layout, Fit, Alignment } from "@rive-app/react-canvas";

// С новыми версиями ffmpeg.wasm:
import { FFmpeg } from "@ffmpeg/ffmpeg";  // вместо createFFmpeg
import { fetchFile } from "@ffmpeg/util"; // отдельный пакет

export default function App() {
  const stateMachineName = "State Machine 1";

  // Инициализируем Rive
  const { rive, RiveComponent } = useRive({
    src: "vitaoil.riv",            // Ваш .riv-файл
    stateMachines: stateMachineName,
    autoplay: true,
    layout: new Layout({
      fit: Fit.Cover,
      alignment: Alignment.Center
    })
  });

  // Храним значения для каждого текстового поля
  const [textValues, setTextValues] = useState({
    "95 PREM": "",
    "92 ECO": "",
    "92 EURO": "",
    DIESEL: "",
    GAS: "",
    COFFEE: ""
  });

  // ffmpeg-объект (новый API)
  // Важно: создаём один экземпляр FFmpeg, не пересоздаём на каждый рендер
  const ffmpegRef = useRef(null);
  const [isFFmpegReady, setIsFFmpegReady] = useState(false);

  // Флаг, показывающий, идёт ли сейчас конвертация
  const [isConverting, setIsConverting] = useState(false);

  // При первом монтировании создаём FFmpeg() и загружаем бинарь
  useEffect(() => {
    (async () => {
      const ffmpeg = new FFmpeg({ log: false });
      await ffmpeg.load();   // загружаем wasm-бинарь
      ffmpegRef.current = ffmpeg;
      setIsFFmpegReady(true);
      console.log("FFmpeg загружен (новый API)");
    })();
  }, []);

  // После инициализации Rive считываем текущие значения текстовых переменных
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

  // Обработчик изменения ввода
  const handleInputChange = (e, variableName) => {
    const { value } = e.target;
    setTextValues(prevValues => ({
      ...prevValues,
      [variableName]: value
    }));
  };

  // Обработчик нажатия кнопки "Применить" (обновляет Rive-текст)
  const handleApplyClick = (variableName) => {
    if (rive) {
      rive.setTextRunValue(variableName, textValues[variableName]);
    }
  };

  // ---------------------------------------
  // Главная функция записи и скачивания MP4
  // ---------------------------------------
  const handleRecordClick = async () => {
    if (!rive) {
      alert("Rive не инициализирован!");
      return;
    }
    if (!isFFmpegReady) {
      alert("FFmpeg ещё не готов, попробуйте чуть позже...");
      return;
    }

    // 1) Перезапускаем анимацию с нуля
    try {
      rive.pause(stateMachineName);
      rive.seek(0, stateMachineName);
      rive.play(stateMachineName);
      console.log("Анимация сброшена и запущена с нуля.");
    } catch (err) {
      console.error("Ошибка при сбросе анимации:", err);
      return;
    }

    // 2) Ищем canvas
    const canvas = document.querySelector("canvas");
    if (!canvas) {
      console.error("Canvas с Rive не найден!");
      return;
    }

    // 3) Захватываем поток (например, 30 fps)
    const stream = canvas.captureStream(30);
    const recorder = new MediaRecorder(stream, {
      mimeType: "video/webm; codecs=vp9"
    });

    // Массив для кусочков WebM
    const chunks = [];
    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) {
        chunks.push(e.data);
      }
    };

    // Когда запись остановится
    recorder.onstop = async () => {
      // Собираем WebM
      const webmBlob = new Blob(chunks, { type: "video/webm" });

      // Конвертируем WebM -> MP4
      setIsConverting(true);

      try {
        const ffmpeg = ffmpegRef.current;

        // Удаляем предыдущие файлы, если были (не обязательно)
        try {
          await ffmpeg.exec(["-y", "-i", "input.webm", "output.mp4"]);
          // или ffmpeg.FS("unlink", "input.webm");
          //    ffmpeg.FS("unlink", "output.mp4");
        } catch (err) {
          // игнорируем, если их не было
        }

        // Пишем WebM-файл во внутреннюю FS ffmpeg
        await ffmpeg.writeFile("input.webm", await fetchFile(webmBlob));

        // Запускаем FFmpeg
        // -y: overwrite
        // -i input.webm: входной файл
        // -c:v libx264: кодек h264
        // -preset fast
        // -pix_fmt yuv420p
        // output.mp4
        await ffmpeg.exec([
          "-y",
          "-i",
          "input.webm",
          "-c:v",
          "libx264",
          "-preset",
          "fast",
          "-pix_fmt",
          "yuv420p",
          "output.mp4"
        ]);

        // Читаем готовый output.mp4
        const data = await ffmpeg.readFile("output.mp4");
        const mp4Blob = new Blob([data.buffer], { type: "video/mp4" });
        const mp4Url = URL.createObjectURL(mp4Blob);

        // Скачиваем файл
        const a = document.createElement("a");
        a.style.display = "none";
        a.href = mp4Url;
        a.download = "animation.mp4";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(mp4Url);

        console.log("MP4 готов (animation.mp4).");
      } catch (err) {
        console.error("Ошибка при конвертации в MP4:", err);
      } finally {
        setIsConverting(false);
      }
    };

    // 4) Начинаем запись
    recorder.start();
    console.log("Запись запущена...");

    // Останавливаем через 8 секунд
    setTimeout(() => {
      recorder.stop();
      console.log("Запись остановлена (8 секунд).");
    }, 8000);
  };

  return (
    <div className="App">
      <div className="container">
        <RiveComponent />
      </div>

      <div className="controls">
        {Object.keys(textValues).map((variableName) => (
          <div className="text-run-control" key={variableName}>
            <label>
              {variableName}:{" "}
              <input
                type="text"
                value={textValues[variableName]}
                onChange={(e) => handleInputChange(e, variableName)}
              />
            </label>
            <button onClick={() => handleApplyClick(variableName)}>
              Применить
            </button>
          </div>
        ))}
      </div>

      {/* Кнопка записи */}
      <div style={{ marginTop: "20px" }}>
        <button onClick={handleRecordClick} disabled={isConverting}>
          {isConverting ? "Конвертация..." : "Записать 8-сек. видео (MP4)"}
        </button>
      </div>
    </div>
  );
}
