//src\App.js

import React, { useState, useEffect, useRef } from "react";
import { Rive, Layout, Fit, Alignment } from "@rive-app/canvas";
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
import { ThemeProvider } from "./components/ThemeProvider";
import "./index.css";

export default function App() {
  const canvasRef = useRef(null);
  const riveRef = useRef(null);
  const stateMachineName = "State Machine 1";
  const viewModelName = "View Model 1";

  const [logs, setLogs] = useState([]);
  const handleAddLog = (message) => addLog(setLogs, message);
  const handleUpdateLastLog = (newMessage) =>
    updateLastLog(setLogs, newMessage);

  // State variables
  const [includeCoffee, setIncludeCoffee] = useState(true);
  const [isCoffeeOn, setCoffeeOn] = useState(true);
  const [isArrowLeft, setIsArrowLeft] = useState(false);
  const [isGasOn, setIsGasOn] = useState(true);  const [textValues, setTextValues] = useState(initialValues);
  
  // Initialize Rive
  useEffect(() => {
    riveRef.current = new Rive({
      src: "/animation_universal.riv",
      canvas: canvasRef.current,
      stateMachines: stateMachineName,
      autoplay: true,
      layout: new Layout({
        fit: Fit.Fill,
        alignment: Alignment.Center,
      }),
      useOffscreenRenderer: true,
      renderBufferSize: { width: 320, height: 374 },
      autoBind: false,
      onLoad: () => {
        //console.log('Rive loaded, initializing View Model...');
        initializeViewModel();
      },
    });

    return () => {
      //console.log('Cleaning up Rive...');
      riveRef.current?.cleanup();
    };
  }, []);

  // Initialize View Model
  const initializeViewModel = () => {
    const rive = riveRef.current;
    if (!rive) {
      console.error('Rive instance not available');
      return;
    }

    try {
      //console.log('Getting View Model...');
      const vm = rive.viewModelByName(viewModelName);
      if (!vm) {
        console.error(`View Model "${viewModelName}" not found`);
        return;
      }

      //console.log('Creating View Model instance...');
      const vmi = vm.defaultInstance();
      if (!vmi) {
        console.error("Failed to create View Model instance");
        return;
      }

      //console.log('Binding View Model instance...');
      rive.bindViewModelInstance(vmi);
      riveRef.current.vmi = vmi;
      //console.log('View Model successfully initialized and bound');
    } catch (error) {
      console.error('Error in View Model initialization:', error);
    }
  };
  // Initial synchronization with Rive
  useEffect(() => {
    const vmi = riveRef.current?.vmi;
    if (!vmi) return;

    try {
      // Load and sync text values
      const loadedText = loadTextValuesFromCookies() || initialValues;
      setTextValues(loadedText);      
      
      // Отфильтруем поля, которые точно есть в Rive
      const riveFields = ["95 PREM", "92 ECO", "92 EURO", "DIESEL", "GAS",
                         "95 PREM DISCOUNT", "92 ECO DISCOUNT", "92 EURO DISCOUNT",
                         "DIESEL DISCOUNT", "GAS DISCOUNT", "COFFEE"];

      Object.entries(loadedText)
        .filter(([key]) => riveFields.includes(key))
        .forEach(([key, value]) => {
          // console.log(`Initial sync: Setting text ${key} to:`, value);
          riveRef.current?.setTextRunValue(key, value);
      });

      // Load and sync checkbox values
      const { includeCoffee, isCoffeeOn, isArrowLeft, isGasOn } = loadCheckboxesFromCookies();
      setIncludeCoffee(includeCoffee);
      setCoffeeOn(isCoffeeOn);
      setIsArrowLeft(isArrowLeft);
      setIsGasOn(isGasOn);

      // Sync boolean properties
      const arrowsProp = vmi.boolean("arrows_left");
      if (arrowsProp) {
        arrowsProp.value = isArrowLeft;
      }

      const coffeeProp = vmi.boolean("coffee_price_show");
      if (coffeeProp) {
        coffeeProp.value = isCoffeeOn;
      }

      const gasProp = vmi.boolean("gas_price_show");
      if (gasProp) {
        gasProp.value = isGasOn;
      }

      // console.log('Initial sync complete:', { loadedText, includeCoffee, isCoffeeOn, isArrowLeft, isGasOn });
    } catch (error) {
      console.error('Error during initial sync:', error);
    }
  }, [riveRef.current?.vmi]); // Run when View Model Instance becomes available

  // Load initial values
  useEffect(() => {
    const loadedText = loadTextValuesFromCookies() || initialValues;
    setTextValues(loadedText);

    const { includeCoffee, isCoffeeOn, isArrowLeft, isGasOn } = loadCheckboxesFromCookies();
    setIncludeCoffee(includeCoffee);
    setCoffeeOn(isCoffeeOn);
    setIsArrowLeft(isArrowLeft);
    setIsGasOn(isGasOn);
  }, []);

  // Sync boolean properties with View Model
  useEffect(() => {
    const vmi = riveRef.current?.vmi;
    if (!vmi) return;

    //console.log('Syncing boolean properties:', { isArrowLeft, isCoffeeOn, isGasOn });

    try {
      // Arrows
      const arrowsProp = vmi.boolean("arrows_left");
      if (arrowsProp) {
        //console.log('Setting arrows_left to:', isArrowLeft);
        arrowsProp.value = isArrowLeft;
      }

      // Coffee
      const coffeeProp = vmi.boolean("coffee_price_show");
      if (coffeeProp) {
        //console.log('Setting coffee_price_show to:', isCoffeeOn);
        coffeeProp.value = isCoffeeOn;
      }

      // Gas
      const gasProp = vmi.boolean("gas_price_show");
      if (gasProp) {
        //console.log('Setting gas_price_show to:', isGasOn);
        gasProp.value = isGasOn;
      }
    } catch (error) {
      console.error('Error syncing boolean properties:', error);
    }
  }, [isArrowLeft, isCoffeeOn, isGasOn]);

  // Sync text values with View Model
  useEffect(() => {
    const vmi = riveRef.current?.vmi;
    if (!vmi || !textValues) return;

    try {
      Object.entries(textValues).forEach(([key, value]) => {
        const txtProp = vmi.text(key);
        if (txtProp) {
          // console.log(`Setting text ${key} to:`, value);
          txtProp.value = value;
        }
      });
    } catch (error) {
      //console.error('Error syncing text values:', error);
    }
  }, [textValues]);

  // Set up observers (optional)
  useEffect(() => {
    const vmi = riveRef.current?.vmi;
    if (!vmi) return;

    const observers = [
      { name: "arrows_left", handler: (e) => console.log("arrows_left changed →", e.data) },
      { name: "coffee_price_show", handler: (e) => console.log("coffee_price_show changed →", e.data) },
      { name: "gas_price_show", handler: (e) => console.log("gas_price_show changed →", e.data) }
    ];

    // Set up observers
    observers.forEach(({ name, handler }) => {
      const prop = vmi.boolean(name);
      prop?.on(handler);
    });

    // Cleanup observers
    return () => {
      observers.forEach(({ name, handler }) => {
        const prop = vmi.boolean(name);
        prop?.off(handler);
      });
    };
  }, []);  // Обработчик изменения значений полей
  const handleInputChangePage = ({ event, variableName }) => {
    handleInputChangeUtil({
      event,
      variableName,
      setTextValues,
      rive: riveRef.current
    });
  };

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
        isGasOn
      });      recordAndDownload({ 
        rive: riveRef.current, 
        stateMachineName, 
        includeCoffee,
        isCoffeeOn,
        isGasOn,
        isArrowLeft,
      });
    }
  };

  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      <MainLayout
        canvasRef={canvasRef}
        textValues={textValues}
        handleInputChange={handleInputChangePage}
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
    </ThemeProvider>
  );
}
