import React, { useState, useEffect } from "react";
import { useRive, Layout, Fit, Alignment } from "@rive-app/react-canvas";
import { useRiveRecorder } from "./hooks/useRiveRecorder";
import { addLog, updateLastLog } from "./logger";
import { handleInputChange as handleInputChangeUtil } from "./utils/handleInputChange";
import { saveTextValuesToCookies, loadTextValuesFromCookies } from "./utils/cookies";
import initialValues from "./initialValues";
import MainLayout from "./components/MainLayout";
import "./styles.css";

export default function App() {
  const stateMachineName = "State Machine 1";

  const [logs, setLogs] = useState([]);

  const handleAddLog = (message) => addLog(setLogs, message);
  const handleUpdateLastLog = (newMessage) => updateLastLog(setLogs, newMessage);

  const handleDownload = () => {
    saveTextValuesToCookies(textValues);
    recordAndDownload({ rive, stateMachineName });
  };
  
  const [isArrowLeft, setIsArrowLeft] = useState(false);
  const [isGasOn, setIsGasOn] = useState(true);
  const riveSrc = `arr_${isArrowLeft ? "left" : "right"}_gas_${isGasOn ? "on" : "off"}.riv`;

  const { rive, RiveComponent } = useRive({
    src: riveSrc,
    stateMachines: stateMachineName,
    autoplay: true,
    layout: new Layout({ fit: Fit.Cover, alignment: Alignment.Center })
  });

  const savedValues = loadTextValuesFromCookies();
  const [textValues, setTextValues] = useState(savedValues || initialValues);

  const handleInputChange = (e, variableName) =>
    handleInputChangeUtil({ e, variableName, setTextValues, rive });

  // Подключение хука useRiveRecorder
  const { isReady: isFFmpegReady, isProcessing, recordAndDownload } = useRiveRecorder({
    addLog: handleAddLog,
    updateLastLog: handleUpdateLastLog
  });

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
    />
  );
}
