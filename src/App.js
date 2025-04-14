import React, { useState, useEffect } from "react";
import "./styles.css";
import { useRive, Layout, Fit, Alignment } from "@rive-app/react-canvas";
import { useRiveRecorder } from "./hooks/useRiveRecorder";
import { parseLog, addLog, updateLastLog } from "./logger";


export default function App() {
  const stateMachineName = "State Machine 1";

  const [logs, setLogs] = useState([]);

  const handleAddLog = (message) => addLog(setLogs, message);
  const handleUpdateLastLog = (newMessage) => updateLastLog(setLogs, newMessage);
  
  const [isArrowLeft, setIsArrowLeft] = useState(false);
  const [isGasOn, setIsGasOn] = useState(true);
  const riveSrc = `arr_${isArrowLeft ? "left" : "right"}_gas_${isGasOn ? "on" : "off"}.riv`;

  const { rive, RiveComponent } = useRive({
    src: riveSrc,
    stateMachines: stateMachineName,
    autoplay: true,
    layout: new Layout({ fit: Fit.Cover, alignment: Alignment.Center })
  });

  const [textValues, setTextValues] = useState({
    "95 PREM": "", "92 ECO": "", "92 EURO": "", "DIESEL": "", "GAS": "", "COFFEE": "",
    "95 PREM DISCOUNT": "", "92 ECO DISCOUNT": "", "92 EURO DISCOUNT": "", "DIESEL DISCOUNT": "", "GAS DISCOUNT": "",
    "GAS_SALE": "", "CASH_SALE": ""
  });

  const leftFields = ["95 PREM", "92 ECO", "92 EURO", "DIESEL", "GAS"];
  const rightFields = ["95 PREM DISCOUNT", "92 ECO DISCOUNT", "92 EURO DISCOUNT", "DIESEL DISCOUNT", "GAS DISCOUNT"];
  const coffeeField = "COFFEE";

  useEffect(() => {
    
    if (rive) {
      setTextValues((prev) => ({
        ...prev,
        "95 PREM": rive.getTextRunValue("95 PREM") || "",
        "92 ECO": rive.getTextRunValue("92 ECO") || "",
        "92 EURO": rive.getTextRunValue("92 EURO") || "",
        "DIESEL": rive.getTextRunValue("DIESEL") || "",
        "GAS": rive.getTextRunValue("GAS") || "",
        "COFFEE": rive.getTextRunValue("COFFEE") || "",
        "95 PREM DISCOUNT": rive.getTextRunValue("95 PREM DISCOUNT") || "",
        "92 ECO DISCOUNT": rive.getTextRunValue("92 ECO DISCOUNT") || "",
        "92 EURO DISCOUNT": rive.getTextRunValue("92 EURO DISCOUNT") || "",
        "DIESEL DISCOUNT": rive.getTextRunValue("DIESEL DISCOUNT") || "",
        "GAS DISCOUNT": rive.getTextRunValue("GAS DISCOUNT") || "",
        "GAS_SALE": rive.getTextRunValue("GAS_SALE") || "",
        "CASH_SALE": rive.getTextRunValue("CASH_SALE") || ""
      }));
      handleAddLog("Чтение начальных значений текстовых полей завершено.");
    }
  }, [rive]);

  const handleInputChange = (e, variableName) => {
    const { value } = e.target;
    let pattern;
    if (variableName === coffeeField) {
      pattern = /^\d{0,4}$/;
      if (value === "" || pattern.test(value)) {
        setTextValues((prev) => ({ ...prev, [variableName]: value }));
        rive?.setTextRunValue(variableName, value);
      }
    } else if (["GAS_SALE", "CASH_SALE"].includes(variableName)) {
      if (
        value === "" ||
        (value.length <= 3 && /^[0-9.-]+$/.test(value) && value.split(".").length <= 2)
      ) {
        setTextValues((prev) => ({ ...prev, [variableName]: value }));
        rive?.setTextRunValue(variableName, value);
      }
    } else {
      pattern = /^\d{0,3}(\.\d{0,2})?$/;
      if (value === "" || pattern.test(value)) {
        setTextValues((prev) => ({ ...prev, [variableName]: value }));
        rive?.setTextRunValue(variableName, value);
      }
    }
  };


  const { isReady: isFFmpegReady, isProcessing, recordAndDownload } = useRiveRecorder({
    addLog: handleAddLog,
    updateLastLog: handleUpdateLastLog
  });


  return (
    <div className="App" translate="no">
      <div className="container">
        {!isProcessing && (
          <div>
            <div className="toggle">
              <input
                type="checkbox"
                id="arrowToggle"
                checked={isArrowLeft}
                onChange={(e) => setIsArrowLeft(e.target.checked)}
              />
              <label htmlFor="arrowToggle">Стрелки влево (без галочки – вправо)</label>
            </div>
            <div className="toggle">
              <input
                type="checkbox"
                id="gasToggle"
                checked={isGasOn}
                onChange={(e) => setIsGasOn(e.target.checked)}
              />
              <label htmlFor="gasToggle">GAS включён (без галочки – выключен)</label>
            </div>
          </div>
        )}

        <div className="rive-canvas">
          <RiveComponent key={riveSrc} />
        </div>

        {!isProcessing && (
          <>
            <div className="columns">
              <div className="column">
                {leftFields.map((field) => (
                  <div key={field} className="field">
                    <div className="label">{field}</div>
                    <input
                      type="text"
                      className="input"
                      value={textValues[field]}
                      onChange={(e) => handleInputChange(e, field)}
                    />
                  </div>
                ))}
              </div>
              <div className="column">
                {rightFields.map((field) => (
                  <div key={field} className="field">
                    <div className="label">Со скидкой</div>
                    <input
                      type="text"
                      className="input"
                      value={textValues[field]}
                      onChange={(e) => handleInputChange(e, field)}
                    />
                  </div>
                ))}
              </div>
            </div>

            <div style={{ marginTop: "1rem" }}>
              <div className="field">
                <div className="label">{coffeeField}:</div>
                <input
                  type="text"
                  className="input"
                  value={textValues[coffeeField]}
                  onChange={(e) => handleInputChange(e, coffeeField)}
                />
              </div>
              <div className="field">
                <div className="label">Скидка на ГАЗ от 10л:</div>
                <input
                  type="text"
                  className="input"
                  value={textValues["GAS_SALE"]}
                  onChange={(e) => handleInputChange(e, "GAS_SALE")}
                />
              </div>
              <div className="field">
                <div className="label">Скидка за наличные:</div>
                <input
                  type="text"
                  className="input"
                  value={textValues["CASH_SALE"]}
                  onChange={(e) => handleInputChange(e, "CASH_SALE")}
                />
              </div>
            </div>

            <div className="log-container">
              <button
                className="download-button"
                onClick={() => recordAndDownload({ rive, stateMachineName })}
                disabled={!isFFmpegReady}
              >
                Скачать видео
              </button>
            </div>
          </>
        )}

        <div className="log-container">
          <div className="log-box">
            {logs.map((log, i) => (
              <div key={i} className="log-entry">
                {parseLog(log)}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
