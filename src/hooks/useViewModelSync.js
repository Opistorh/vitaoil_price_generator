// src/hooks/useViewModelSync.js

import { useEffect } from "react";

export default function useViewModelSync(rive, textValues, booleanInputs) {
  // Sync text values
  useEffect(() => {
    if (!rive || !textValues || !rive.viewModel) return;

    Object.entries(textValues).forEach(([key, value]) => {
      const input = rive.viewModel.inputs?.[key];
      if (input) {
        input.value = value;
      }
    });
  }, [rive, textValues]);

  // Sync boolean inputs
  useEffect(() => {
    if (!rive || !booleanInputs || !rive.viewModel) return;

    const { arrows_left, coffee_price_show, gas_price_show } = booleanInputs;
    
    console.log('Updating Rive View Model inputs:', {
      arrows_left,
      coffee_price_show,
      gas_price_show
    });
    
    const inputs = rive.viewModel.inputs;
    if (inputs) {
      if (inputs.arrows_left) inputs.arrows_left.value = arrows_left;
      if (inputs.coffee_price_show) inputs.coffee_price_show.value = coffee_price_show;
      if (inputs.gas_price_show) inputs.gas_price_show.value = gas_price_show;
    }
  }, [rive, booleanInputs]);
}
