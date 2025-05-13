// src/hooks/useViewModelSync.js

import { useEffect } from "react";

export default function useViewModelSync(rive, textValues) {
  useEffect(() => {
    if (!rive || !textValues || !rive.viewModel) return;

    Object.entries(textValues).forEach(([key, value]) => {
      const input = rive.viewModel.inputs?.[key];
      if (input) {
        input.value = value;
      }
    });
  }, [rive, textValues]);
}
