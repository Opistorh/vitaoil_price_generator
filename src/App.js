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

  // После инициализации rive, считываем текущие значения текстовых переменных
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
    </div>
  );
}
