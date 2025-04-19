// src/utils/handleInputChange.js

import { coffeeField } from "../fieldConfig";

export function handleInputChange({ e, variableName, setTextValues, rive }) {
  const { value } = e.target;
  let pattern;

  if (variableName === coffeeField) {
    pattern = /^\d{0,4}$/;
    if (value === "" || pattern.test(value)) {
      setTextValues((prev) => ({ ...prev, [variableName]: value }));
      rive?.setTextRunValue(variableName, value);
    }
  } else if (["GAS_SALE", "CASH_SALE"].includes(variableName)) {
    if (
      value === "" ||
      (value.length <= 3 &&
        /^[0-9.-]+$/.test(value) &&
        value.split(".").length <= 2)
    ) {
      setTextValues((prev) => ({ ...prev, [variableName]: value }));
      rive?.setTextRunValue(variableName, value);
    }
  } else {
    pattern = /^\d{0,3}(\.\d{0,2})?$/;
    if (value === "" || pattern.test(value)) {
      setTextValues((prev) => ({ ...prev, [variableName]: value }));
      rive?.setTextRunValue(variableName, value);
    }
  }
}
