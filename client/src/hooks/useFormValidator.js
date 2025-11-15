export function useAutoValidator() {
  const getNestedValue = (path, obj) => {
    return path.split(".").reduce((acc, key) => {
      return acc && acc[key] !== undefined ? acc[key] : "";
    }, obj);
  };

  const autoValidate = (formData, fields, confirmFields, showFlash) => {
    for (let name in fields) {
      const meta = fields[name];
      const value = getNestedValue(name, formData);

      if (meta.required && !String(value).trim()) {
        showFlash(`${meta.label} is required`, "error");
        return false;
      }

      if (meta.min && String(value).length < meta.min) {
        showFlash(
          `${meta.label} must be at least ${meta.min} characters`,
          "error"
        );
        return false;
      }

      if (meta.max && String(value).length > meta.max) {
        showFlash(
          `${meta.label} must be less than ${meta.max} characters`,
          "error"
        );
        return false;
      }

      if (meta.pattern && !meta.pattern.test(String(value))) {
        showFlash(meta.patternMessage || `Invalid ${meta.label}`, "error");
        return false;
      }

      if (meta.type === "email") {
        const emailRegex = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
        if (!emailRegex.test(String(value))) {
          showFlash("Enter a valid email", "error");
          return false;
        }
      }

      if (meta.type === "number") {
        const num = parseFloat(value);

        if (meta.minValue !== null && num < meta.minValue) {
          showFlash(
            `${meta.label} must be greater than ${meta.minValue}`,
            "error"
          );
          return false;
        }

        if (meta.maxValue !== null && num > meta.maxValue) {
          showFlash(
            `${meta.label} must be less than ${meta.maxValue}`,
            "error"
          );
          return false;
        }
      }
    }

    for (let field of confirmFields) {
      const meta = fields[field];
      const target = meta.confirmFor;

      const valueA = getNestedValue(field, formData);
      const valueB = getNestedValue(target, formData);

      if (valueA !== valueB) {
        showFlash(`${meta.label} does not match`, "error");
        return false;
      }
    }

    return true;
  };

  return { autoValidate };
}
