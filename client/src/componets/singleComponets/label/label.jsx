function Label({ text, children, ...props }) {
  return (
    <label {...props}>
      {text}
      {children}
    </label>
  );
}

export default Label;