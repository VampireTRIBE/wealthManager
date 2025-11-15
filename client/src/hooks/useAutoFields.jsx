import { createContext, useContext, useRef } from "react";

const AutoFieldsContext = createContext(null);

export function AutoFieldsProvider({ children }) {
  const fieldsRef = useRef({});
  const confirmRef = useRef([]);

  const registerField = (name, props) => {
    const meta = {
      label: props.label || name.split(".").pop(),
      required: !!props.required,
      type: props.type || "text",
      min: props.minLength || null,
      max: props.maxLength || null,
      minValue: props.min || null,
      maxValue: props.max || null,
      pattern: props.pattern || null,
      patternMessage: props.patternMessage || null,
      confirmFor: props.confirmFor || null,
    };

    fieldsRef.current[name] = meta;

    if (meta.confirmFor) confirmRef.current.push(name);
  };

  return (
    <AutoFieldsContext.Provider
      value={{
        registerField,
        getFields: () => fieldsRef.current,
        getConfirmFields: () => confirmRef.current,
      }}
    >
      {children}
    </AutoFieldsContext.Provider>
  );
}

export function useAutoFields() {
  return useContext(AutoFieldsContext);
}
