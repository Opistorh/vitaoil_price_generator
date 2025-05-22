// src/components/MainLayout.js

import React from "react";
import { leftFields, rightFields, coffeeField } from "../fieldConfig";
import { parseLog } from "../logger";
import { Button } from "./ui/button";
import { ToggleGroup, ToggleGroupItem } from "./ui/toggle-group";
import { Switch } from "./ui/switch";
import { cn } from "../utils/cn";

export default function MainLayout({
  canvasRef,
  textValues = {}, // Добавляем значение по умолчанию
  handleInputChange,
  isArrowLeft,
  setIsArrowLeft,
  isGasOn,
  setIsGasOn,
  isProcessing,
  isFFmpegReady,
  recordAndDownload,
  logs,
  includeCoffee,
  setIncludeCoffee,
  isCoffeeOn,
  setCoffeeOn,
}) {
  // Функция для безопасного получения значения поля
  const getFieldValue = (fieldId) => {
    return textValues?.[fieldId] || "";
  };  // Обработчик изменения значения поля
  const onInputChange = (e, fieldId) => {
    handleInputChange({
      event: e,
      variableName: fieldId,
    });
  };

  // Функция для создания элемента Switch с меткой
  const SwitchWithLabel = ({ checked, onCheckedChange, label, className }) => (
    <div className={cn("flex items-center gap-2", className)}>
      <Switch checked={checked} onCheckedChange={onCheckedChange} />
      <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
        {label}
      </label>
    </div>
  );

  return (
    <div className="min-h-screen bg-background p-4" translate="no">
      <div className="mx-auto w-full max-w-[360px] space-y-6">        {/* Canvas */}
        <div className="relative w-full max-w-[320px] mx-auto">
          <div className="aspect-[640/748] w-full">
            <canvas
              ref={canvasRef}
              width={640}
              height={748}
              className="absolute inset-0 w-full h-full rounded-lg border bg-white shadow-sm"
            />
          </div>
        </div>

        {!isProcessing && (
          <div className="space-y-6">            {/* Input Fields */}
            <div className="grid grid-cols-2 gap-4">
              {/* Left Fields - Original Prices */}
              <div className="space-y-2">
                {leftFields.map((field) => (
                  <div key={field.id} className="flex flex-col space-y-1">
                    <label 
                      htmlFor={field.id} 
                      className={cn("text-sm font-medium", {
                        "opacity-50": field.id.toUpperCase().includes('GAS') && !isGasOn
                      })}
                    >
                      {field.label}
                    </label>
                    <input
                      type="text"
                      id={field.id}
                      value={getFieldValue(field.id)}
                      onChange={(e) => onInputChange(e, field.id)}
                      disabled={field.id.toUpperCase().includes('GAS') && !isGasOn}
                      className={cn(
                        "rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring",
                        {
                          "opacity-50 cursor-not-allowed": field.id.toUpperCase().includes('GAS') && !isGasOn
                        }
                      )}
                    />
                  </div>
                ))}
              </div>

              {/* Right Fields - Discount Prices */}
              <div className="space-y-2">
                {rightFields.map((field) => (
                  <div key={field.id} className="flex flex-col space-y-1">
                    <label 
                      htmlFor={field.id} 
                      className={cn("text-sm font-medium", {
                        "opacity-50": field.id.toUpperCase().includes('GAS') && !isGasOn
                      })}
                    >
                      {field.label}
                    </label>
                    <input
                      type="text"
                      id={field.id}
                      value={getFieldValue(field.id)}
                      onChange={(e) => onInputChange(e, field.id)}
                      disabled={field.id.toUpperCase().includes('GAS') && !isGasOn}
                      className={cn(
                        "rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring",
                        {
                          "opacity-50 cursor-not-allowed": field.id.toUpperCase().includes('GAS') && !isGasOn
                        }
                      )}
                    />
                  </div>
                ))}              </div>
            </div>

            {/* Coffee Input */}
            <div className="space-y-2">
              <div className="flex flex-col space-y-1">
                <label 
                  htmlFor={coffeeField.id} 
                  className={cn("text-sm font-medium", {
                    "opacity-50": !isCoffeeOn
                  })}
                >
                  {coffeeField.label}
                </label>
                <input
                  type="text"
                  id={coffeeField.id}
                  value={getFieldValue(coffeeField.id)}
                  onChange={(e) => onInputChange(e, coffeeField.id)}
                  disabled={!isCoffeeOn}
                  className={cn(
                    "rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring",
                    {
                      "opacity-50 cursor-not-allowed": !isCoffeeOn
                    }
                  )}
                />
              </div>
            </div>

            {/* Download Button */}
            {isFFmpegReady && (
              <Button
                onClick={recordAndDownload}
                disabled={isProcessing}
                className="w-full"
                variant={isProcessing ? "secondary" : "default"}
              >
                {isProcessing ? "Обработка..." : "Записать и скачать"}
              </Button>
            )}

            {/* Arrow Direction Toggle */}
            <div className="flex items-center justify-center">
              <ToggleGroup
                type="single"
                value={isArrowLeft ? "left" : "right"}
                onValueChange={(value) => {
                  if (value) setIsArrowLeft(value === "left");
                }}
                className="w-full"
              >
                <ToggleGroupItem value="left" className="flex-1">
                  ← Стрелки влево
                </ToggleGroupItem>
                <ToggleGroupItem value="right" className="flex-1">
                  Стрелки вправо →
                </ToggleGroupItem>
              </ToggleGroup>
            </div>

            {/* Switches */}
            <div className="flex flex-col gap-4">
              <SwitchWithLabel
                checked={isGasOn}
                onCheckedChange={setIsGasOn}
                label="Показать цену на газ"
              />
            
              <SwitchWithLabel
                checked={isCoffeeOn}
                onCheckedChange={setCoffeeOn}
                label="Показать цену на кофе"
              />

              <SwitchWithLabel
                checked={includeCoffee}
                onCheckedChange={setIncludeCoffee}
                label="Добавить видео про кофе"
              />
            </div>
          </div>
        )}

        {/* Logs Section */}
        {logs.length > 0 && (
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Журнал операций:</h3>
            <div className="max-h-40 overflow-y-auto rounded-md border bg-muted p-4">
              <pre className="text-sm">
                {logs.map((log, index) => (
                  <div
                    key={index}
                    className={cn("py-1", {
                      "text-red-500": log.includes("error"),
                      "text-green-500": log.includes("success"),
                    })}
                  >
                    {parseLog(log)}
                  </div>
                ))}
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
