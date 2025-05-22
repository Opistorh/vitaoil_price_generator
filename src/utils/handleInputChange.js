// src/utils/handleChange.js

import { coffeeField } from "../fieldConfig";

export function handleInputChange({ event, variableName, setTextValues, rive }) {
  if (!event?.target) {
    console.error('Invalid event object:', { event, variableName });
    return;
  }
  if (!variableName) {
    console.error('Missing variableName:', { event, variableName });
    return;
  }
  const { value } = event.target;
  const fieldId = variableName.id || variableName;
  let pattern;

  if (fieldId === "COFFEE") {
    pattern = /^\d{0,4}$/;
    if (value === "" || pattern.test(value)) {
      setTextValues((prev) => ({ ...prev, [fieldId]: value }));
      rive?.setTextRunValue(fieldId, value);
    }
  } else if (["GAS SALE", "CASH SALE"].includes(fieldId)) {
    if (
      value === "" ||
      (value.length <= 3 &&
        /^[0-9.-]+$/.test(value) &&
        value.split(".").length <= 2)
    ) {
      setTextValues((prev) => ({ ...prev, [fieldId]: value }));
      rive?.setTextRunValue(fieldId, value);
    }
  } else {
    pattern = /^\d{0,3}(\.\d{0,2})?$/;
    if (value === "" || pattern.test(value)) {
      setTextValues((prev) => ({ ...prev, [fieldId]: value }));
      rive?.setTextRunValue(fieldId, value);
    }
  }
}
