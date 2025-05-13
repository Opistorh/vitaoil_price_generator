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
    console.log('4. useViewModelSync effect triggered with:', { rive, booleanInputs });
    
    if (!rive || !booleanInputs || !rive.viewModel) {
      console.log('5. Early return due to:', { 
        hasRive: !!rive, 
        hasBooleanInputs: !!booleanInputs, 
        hasViewModel: !!(rive && rive.viewModel)
      });
      return;
    }

    const { arrows_left, coffee_price_show, gas_price_show } = booleanInputs;
    
    console.log('6. Extracted boolean inputs:', {
      arrows_left,
      coffee_price_show,
      gas_price_show
    });
    
    const inputs = rive.viewModel.inputs;
    console.log('7. Available Rive inputs:', inputs);

    if (inputs) {
      console.log('8. Setting Rive input values...');
      if (inputs.arrows_left) {
        inputs.arrows_left.value = arrows_left;
        console.log('- Set arrows_left to:', arrows_left);
      }
      if (inputs.coffee_price_show) {
        inputs.coffee_price_show.value = coffee_price_show;
        console.log('- Set coffee_price_show to:', coffee_price_show);
      }
      if (inputs.gas_price_show) {
        inputs.gas_price_show.value = gas_price_show;
        console.log('- Set gas_price_show to:', gas_price_show);
      }
    }
  }, [rive, booleanInputs]);
}
