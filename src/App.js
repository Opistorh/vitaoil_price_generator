import React, { useState, useEffect } from "react";
import "./styles.css";
import { useRive, Layout, Fit, Alignment } from "@rive-app/react-canvas";

export default function App() {
  const stateMachineName = "State Machine 1";
  const { rive, RiveComponent } = useRive({
    src: "vitaoil.riv",
    stateMachines: stateMachineName,
    autoplay: true,
    layout: new Layout({
      fit: Fit.Cover,
      alignment: Alignment.Center,
    }),
  });

  // Храним значения для каждого текстового поля в объекте
  const [textValues, setTextValues] = useState({
    "95 PREM": "",
    "92 ECO": "",
    "92 EURO": "",
    "DIESEL": "",
    "GAS": "",
    "COFFEE": "",
  });

  // После инициализации Rive, считываем текущие значения текстовых переменных
  useEffect(() => {
    if (rive) {
      setTextValues({
        "95 PREM": rive.getTextRunValue("95 PREM") || "",
        "92 ECO": rive.getTextRunValue("92 ECO") || "",
        "92 EURO": rive.getTextRunValue("92 EURO") || "",
        "DIESEL": rive.getTextRunValue("DIESEL") || "",
        "GAS": rive.getTextRunValue("GAS") || "",
        "COFFEE": rive.getTextRunValue("COFFEE") || "",
      });
    }
  }, [rive]);

  // Обработчик изменения ввода
  const handleInputChange = (e, variableName) => {
    const { value } = e.target;
    setTextValues((prevValues) => ({
      ...prevValues,
      [variableName]: value,
    }));
  };

  // Обработчик нажатия кнопки "Применить"
  const handleApplyClick = (variableName) => {
    if (rive) {
      rive.setTextRunValue(variableName, textValues[variableName]);
    }
  };

  // ------------------------------
  // Запись Canvas в WebM и скачивание
  // ------------------------------
  const handleRecordClick = () => {
    // Находим canvas, который использует Rive:
    // Можно искать по селектору "canvas", если Rive один.
    const canvas = document.querySelector("canvas");
    if (!canvas) {
      console.error("Canvas с Rive не найден!");
      return;
    }

    try {
      // Захватываем поток с 30 кадрами/сек (или 60, если хотим)
      const stream = canvas.captureStream(30);

      // Настраиваем MediaRecorder
      const recorder = new MediaRecorder(stream, {
        mimeType: "video/webm; codecs=vp9",
      });

      // Массив для собираемых кусочков WebM
      const chunks = [];

      // Когда появляется новый кусочек данных - складываем в массив
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunks.push(e.data);
        }
      };

      // Когда запись останавливается - собираем Blob и скачиваем
      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: "video/webm" });
        const url = URL.createObjectURL(blob);

        // Создаём временную ссылку и «кликаем» по ней, чтобы скачать
        const a = document.createElement("a");
        a.style.display = "none";
        a.href = url;
        a.download = "animation.webm"; // Имя файла, под которым скачается
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);

        // Освободим URL-объект
        URL.revokeObjectURL(url);

        console.log("Видео сохранено (animation.webm).");
      };

      // Запускаем запись
      recorder.start();
      console.log("Запись видео начата...");

      // Прекращаем запись через 5 секунд (пример)
      setTimeout(() => {
        recorder.stop();
        console.log("Запись видео остановлена.");
      }, 5000);
    } catch (err) {
      console.error("Ошибка при записи видео:", err);
    }
  };

  return (
    <div className="App">
      <div className="container">
        {/* Сам Rive-компонент */}
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
        <button onClick={handleRecordClick}>Записать 5-секундное видео</button>
      </div>
    </div>
  );
}
