import React, { useState, useEffect, useRef } from "react";
import "./styles.css";
import { useRive, Layout, Fit, Alignment } from "@rive-app/react-canvas";
import JSZip from "jszip"; // Библиотека для создания ZIP

export default function App() {
  const stateMachineName = "State Machine 1";

  // Инициализируем Rive
  const { rive, RiveComponent } = useRive({
    src: "vitaoil.riv", // Ваш .riv-файл
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
    "DIESEL": "",
    "GAS": "",
    "COFFEE": ""
  });

  // Флаг, показывающий, идёт ли сейчас «запись» кадров
  const [isRecording, setIsRecording] = useState(false);

  useEffect(() => {
    // Когда Rive готов, считываем начальные значения текстовых полей
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

  // Обработчик изменения ввода
  const handleInputChange = (e, variableName) => {
    const { value } = e.target;
    setTextValues(prevValues => ({
      ...prevValues,
      [variableName]: value
    }));
  };

  // Обновляем значение текстовой переменной в Rive
  const handleApplyClick = (variableName) => {
    if (rive) {
      rive.setTextRunValue(variableName, textValues[variableName]);
    }
  };

  // ---------------------------------------
  // Функция записи PNG-секвенции (8 секунд)
  // ---------------------------------------
  const handleRecordClick = () => {
    if (!rive) {
      alert("Rive не инициализирован!");
      return;
    }
    if (isRecording) {
      alert("Запись уже идёт...");
      return;
    }

    // Сбрасываем и запускаем анимацию заново
    try {
      rive.stop(stateMachineName);
      rive.play(stateMachineName);
      console.log("Анимация сброшена и запущена с нуля.");
    } catch (err) {
      console.error("Ошибка при сбросе анимации:", err);
      return;
    }

    // Ищем canvas
    const canvas = document.querySelector("canvas");
    if (!canvas) {
      console.error("Canvas с Rive не найден!");
      return;
    }

    // Начинаем «запись» кадров
    setIsRecording(true);

    const frames = [];
    const fps = 30;
    const interval = 1000 / fps; // период в мс

    let elapsed = 0;
    const maxDuration = 8000; // 8 секунд

    // Функция, которая будет вызываться каждые interval мс
    const captureFrame = () => {
      elapsed += interval;
      // Снимаем скриншот canvas
      const dataURL = canvas.toDataURL("image/png");
      frames.push(dataURL);
      console.log(`Кадр #${frames.length} захвачен`);

      if (elapsed >= maxDuration) {
        // Время вышло, останавливаем
        clearInterval(timerId);
        finishRecording(frames);
      }
    };

    // Запускаем setInterval
    const timerId = setInterval(captureFrame, interval);

    // Если вдруг нужно остановить ещё и по клику — можно хранить timerId и вызывать clearInterval

    // Когда запись заканчивается, собираем ZIP:
    const finishRecording = (collectedFrames) => {
      console.log("Запись завершена. Идёт упаковка PNG в ZIP...");

      const zip = new JSZip();

      // Добавляем файлы в архив
      collectedFrames.forEach((dataUrl, i) => {
        // Имя файла: frame_0001.png, frame_0002.png, ...
        const filename = `frame_${String(i + 1).padStart(4, "0")}.png`;

        // dataUrl имеет формат "data:image/png;base64,...."
        // Нужно вырезать "base64," и оставшуюся часть сохранить в zip как base64
        const base64Data = dataUrl.substring(dataUrl.indexOf(",") + 1);

        // Добавляем в zip
        zip.file(filename, base64Data, { base64: true });
      });

      // Генерируем ZIP как Blob
      zip.generateAsync({ type: "blob" }).then(blob => {
        // Скачиваем как "frames.zip"
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.style.display = "none";
        a.href = url;
        a.download = "frames.zip";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        setIsRecording(false);
        console.log("Готово! frames.zip скачан.");
      });
    };
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

      {/* Кнопка записи PNG */}
      <div style={{ marginTop: "20px" }}>
        <button onClick={handleRecordClick} disabled={isRecording}>
          {isRecording ? "Идёт запись..." : "Записать PNG-секвенцию (8 секунд)"}
        </button>
      </div>
    </div>
  );
}
