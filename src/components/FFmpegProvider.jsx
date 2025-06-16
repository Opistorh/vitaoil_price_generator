import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { initFFmpeg, handleFFmpegLogs } from '../hooks/useRiveRecorder/ffmpegController';

const FFmpegContext = createContext();

export const useFFmpeg = () => useContext(FFmpegContext);

export const FFmpegProvider = ({ children, addLog }) => {
  const ffmpegRef = useRef(null);
  const [isReady, setIsReady] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const outputResolutionRef = useRef(null);

  useEffect(() => {
    const loadFFmpeg = async () => {
      if (ffmpegRef.current || isLoading || isReady) return;

      setIsLoading(true);
      try {
        const ffmpeg = await initFFmpeg(addLog);
        handleFFmpegLogs(ffmpeg, addLog, outputResolutionRef);
        ffmpegRef.current = ffmpeg;
        setIsReady(true);
        addLog('FFmpeg готов к работе.');
      } catch (error) {
        addLog(`Критическая ошибка загрузки FFmpeg: ${error.message}`);
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    loadFFmpeg();
  }, [addLog, isReady, isLoading]);

  const value = {
    ffmpeg: ffmpegRef.current,
    isReady,
    isLoading,
    outputResolutionRef,
  };

  return <FFmpegContext.Provider value={value}>{children}</FFmpegContext.Provider>;
}; 