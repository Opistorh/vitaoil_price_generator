import React, { useState, useEffect, useRef } from "react";
import "./styles.css";
import { useRive, Layout, Fit, Alignment } from "@rive-app/react-canvas";
// ffmpeg.wasm — офлайн FFmpeg в браузере
import { createFFmpeg, fetchFile } from "@ffmpeg/ffmpeg";

export default function App() {
  const stateMachineName = "State Machine 1";

  // Инициализируем Rive
  const { rive, RiveComponent } = useRive({
    src: "vitaoil.riv",             // Ваш .riv-файл
    stateMachines: stateMachineName, // Название State Machine в редакторе Rive
    autoplay: true,
    layout: new Layout({
      fit: Fit.Cover,
      alignment: Alignment.Center,
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

  // Флаг загрузки ffmpeg / хода конвертации
  const [isConverting, setIsConverting] = useState(false);

  // Загружаем ffmpeg лишь однажды
  const ffmpegRef = useRef(null);
  const [isFFmpegLoaded, setIsFFmpegLoaded] = useState(false);

  useEffect(() => {
    // Инициализируем ffmpeg при первой загрузке
    const initFFmpeg = async () => {
      ffmpegRef.current = createFFmpeg({ log: false });
      await ffmpegRef.current.load();
      setIsFFmpegLoaded(true);
      console.log("FFmpeg loaded");
    };
    initFFmpeg();
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
    setTextValues((prevValues) => ({
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
      console.error("Rive не инициализировано ещё!");
      return;
    }
    if (!isFFmpegLoaded) {
      alert("FFmpeg ещё загружается, попробуйте чуть позже...");
      return;
    }

    // 1) Перезапускаем анимацию с нуля
    try {
      // Сбросить (seek) и потом заново запустить
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

    // Будем складывать полученные куски WebM в массив
    const chunks = [];
    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) {
        chunks.push(e.data);
      }
    };

    // Когда запись закончится
    recorder.onstop = async () => {
      // Собираем финальный WebM
      const webmBlob = new Blob(chunks, { type: "video/webm" });

      // 4) Конвертируем WebM -> MP4 через ffmpeg.wasm
      setIsConverting(true);
      try {
        console.log("Начинаем конвертацию в MP4...");
        const ffmpeg = ffmpegRef.current;

        // Очищаем виртуальную FS, на всякий случай
        ffmpeg.FS("unlink", "input.webm").catch(() => {});
        ffmpeg.FS("unlink", "output.mp4").catch(() => {});

        // Записываем WebM-файл во внутреннюю FS ffmpeg
        await ffmpeg.FS("writeFile", "input.webm", await fetchFile(webmBlob));

        // Запускаем FFmpeg
        // Простой вариант: -i input.webm output.mp4
        // Можно добавить параметры -pix_fmt yuv420p, -r 30, crf, и т.д.
        await ffmpeg.run(
          "-i",
          "input.webm",
          "-c:v",
          "libx264",
          "-preset",
          "fast",
          "-pix_fmt",
          "yuv420p",
          "output.mp4"
        );

        // Считываем полученный mp4
        const data = ffmpeg.FS("readFile", "output.mp4");
        const mp4Blob = new Blob([data.buffer], { type: "video/mp4" });

        // Генерируем ссылку для скачивания
        const mp4Url = URL.createObjectURL(mp4Blob);
        const a = document.createElement("a");
        a.style.display = "none";
        a.href = mp4Url;
        a.download = "animation.mp4";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(mp4Url);

        console.log("MP4 готов и скачан (animation.mp4).");
      } catch (err) {
        console.error("Ошибка при конвертации в MP4:", err);
      } finally {
        setIsConverting(false);
      }
    };

    // 5) Начинаем запись
    recorder.start();
    console.log("Запись запущена...");

    // 8 секунд захвата
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

      <div style={{ marginTop: "20px" }}>
        {/* Кнопка записи */}
        <button onClick={handleRecordClick} disabled={isConverting}>
          {isConverting ? "Идёт конвертация..." : "Записать 8-сек. видео (MP4)"}
        </button>
      </div>
    </div>
  );
}
