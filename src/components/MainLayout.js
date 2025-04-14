// src/components/MainLayout.js

import React from "react";
import { leftFields, rightFields, coffeeField } from "../fieldConfig";
import { parseLog } from "../logger";

export default function MainLayout({
  rive,
  RiveComponent,
  riveSrc,
  stateMachineName,
  textValues,
  handleInputChange,
  isArrowLeft,
  setIsArrowLeft,
  isGasOn,
  setIsGasOn,
  isProcessing,
  isFFmpegReady,
  recordAndDownload,
  logs
}) {
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
