import { useEffect } from "react";
import { useAutoFields } from "../../../hooks/useAutoFields";

function Input({ name, ...props }) {
  const { registerField } = useAutoFields();

  useEffect(() => {
    if (name) {
      registerField(name, { name, ...props });
    }
  }, [name]);

  return <input name={name} {...props} />;
}

export default Input;
