import React, { useState, useEffect } from "react";
import { useRive, Layout, Fit, Alignment } from "@rive-app/react-canvas";
import { useRiveRecorder } from "./hooks/useRiveRecorder";
import { addLog, updateLastLog } from "./logger";
import { handleInputChange as handleInputChangeUtil } from "./utils/handleInputChange";
import {
  saveTextValuesToCookies,
  loadTextValuesFromCookies,
  saveCheckboxesToCookies,
  loadCheckboxesFromCookies,
} from "./utils/cookies";
import initialValues from "./initialValues";
import MainLayout from "./components/MainLayout";
import useViewModelSync from "./hooks/useViewModelSync";
import "./styles.css";

export default function App() {
  const stateMachineName = "State Machine 1";
  const viewModelName = "View Model 1";

  const [logs, setLogs] = useState([]);
  const handleAddLog = (message) => addLog(setLogs, message);
  const handleUpdateLastLog = (newMessage) =>
    updateLastLog(setLogs, newMessage);

  // Existing state variables
  const [includeCoffee, setIncludeCoffee] = useState(true);
  const [isCoffeeOn, setCoffeeOn] = useState(true);
  const [isArrowLeft, setIsArrowLeft] = useState(false);
  const [isGasOn, setIsGasOn] = useState(true);

  // New View Model boolean inputs
  const [arrowsLeft, setArrowsLeft] = useState(false);
  const [coffeePriceShow, setCoffeePriceShow] = useState(false);
  const [gasPriceShow, setGasPriceShow] = useState(false);

  const riveSrc = `animation_universal.riv`;

  const { rive, RiveComponent } = useRive({
    src: riveSrc,
    stateMachines: stateMachineName,
    viewModels: viewModelName,
    autoplay: true,
    layout: new Layout({ fit: Fit.Cover, alignment: Alignment.Center }),
  });

  const [textValues, setTextValues] = useState(null);

  useEffect(() => {
    const loadedText = loadTextValuesFromCookies() || initialValues;
    setTextValues(loadedText);

    const { 
      includeCoffee, 
      isCoffeeOn, 
      isArrowLeft, 
      isGasOn,
      arrows_left,
      coffee_price_show,
      gas_price_show
    } = loadCheckboxesFromCookies();
    
    setIncludeCoffee(includeCoffee);
    setCoffeeOn(isCoffeeOn);
    setIsArrowLeft(isArrowLeft);
    setIsGasOn(isGasOn);
    setArrowsLeft(arrows_left);
    setCoffeePriceShow(coffee_price_show);
    setGasPriceShow(gas_price_show);
  }, []);

  useViewModelSync(rive, textValues, {
    arrows_left: arrowsLeft,
    coffee_price_show: coffeePriceShow,
    gas_price_show: gasPriceShow
  });

  // Sync View Model inputs with checkbox states
  useEffect(() => {
    console.log('1. Checkbox states changed:', {
      isArrowLeft,
      isCoffeeOn,
      isGasOn
    });
    
    console.log('2. Setting View Model state variables...');
    setArrowsLeft(isArrowLeft);
    setCoffeePriceShow(isCoffeeOn);
    setGasPriceShow(isGasOn);

    console.log('3. Current View Model states after setting:', {
      arrowsLeft,
      coffeePriceShow,
      gasPriceShow
    });
  }, [isArrowLeft, isCoffeeOn, isGasOn]);

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
      saveCheckboxesToCookies({
        includeCoffee,
        isCoffeeOn,
        isArrowLeft,
        isGasOn,
        arrows_left: arrowsLeft,
        coffee_price_show: coffeePriceShow,
        gas_price_show: gasPriceShow
      });
      recordAndDownload({ rive, stateMachineName, includeCoffee, isCoffeeOn });
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
      isCoffeeOn={isCoffeeOn}
      setCoffeeOn={setCoffeeOn}
    />
  );
}
