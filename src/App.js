// src\App.js

import React, { useState, useEffect } from "react";
import { useRive, Layout, Fit, Alignment } from "@rive-app/react-canvas";
import { useRiveRecorder } from "./hooks/useRiveRecorder";
import { addLog, updateLastLog } from "./logger";
import { handleInputChange as handleInputChangeUtil } from "./utils/handleInputChange";
import {
  saveTextValuesToCookies,
  loadTextValuesFromCookies,
} from "./utils/cookies";
import initialValues from "./initialValues";
import MainLayout from "./components/MainLayout";
import "./styles.css";

export default function App() {
  const stateMachineName = "State Machine 1";

  const [logs, setLogs] = useState([]);
  const handleAddLog = (message) => addLog(setLogs, message);
  const handleUpdateLastLog = (newMessage) =>
    updateLastLog(setLogs, newMessage);

  const [includeCoffee, setIncludeCoffee] = useState(true);

  const [isArrowLeft, setIsArrowLeft] = useState(false);
  const [isGasOn, setIsGasOn] = useState(true);
  const riveSrc = `arr_${isArrowLeft ? "left" : "right"}_gas_${
    isGasOn ? "on" : "off"
  }.riv`;

  const { rive, RiveComponent } = useRive({
    src: riveSrc,
    stateMachines: stateMachineName,
    autoplay: true,
    layout: new Layout({ fit: Fit.Cover, alignment: Alignment.Center }),
  });

  const [textValues, setTextValues] = useState(null);

  // Загружаем из cookies или initialValues при старте
  useEffect(() => {
    const loaded = loadTextValuesFromCookies() || initialValues;
    setTextValues(loaded);
  }, []);

  // Когда Rive и значения загружены, проставляем их в Rive
  useEffect(() => {
    if (rive && textValues) {
      Object.entries(textValues).forEach(([key, value]) => {
        rive.setTextRunValue?.(key, value);
      });
    }
  }, [rive, textValues]);

  const handleInputChange = (e, variableName) =>
    handleInputChangeUtil({ e, variableName, setTextValues, rive });

  const {
    isReady: isFFmpegReady,
    isProcessing,
    recordAndDownload,
  } = useRiveRecorder({
    addLog: handleAddLog,
    updateLastLog: handleUpdateLastLog,
  });

  const handleDownload = () => {
    if (textValues) {
      saveTextValuesToCookies(textValues);
      recordAndDownload({ rive, stateMachineName, includeCoffee });
    }
  };

  return (
    <MainLayout
      rive={rive}
      RiveComponent={RiveComponent}
      riveSrc={riveSrc}
      stateMachineName={stateMachineName}
      textValues={textValues}
      handleInputChange={handleInputChange}
      isArrowLeft={isArrowLeft}
      setIsArrowLeft={setIsArrowLeft}
      isGasOn={isGasOn}
      setIsGasOn={setIsGasOn}
      isProcessing={isProcessing}
      isFFmpegReady={isFFmpegReady}
      recordAndDownload={handleDownload}
      logs={logs}
      includeCoffee={includeCoffee}
      setIncludeCoffee={setIncludeCoffee}
    />
  );
}
