
function H1({ text, children, ...props }) {
  return (
    <h1 {...props}>
      {text}
      {children}
    </h1>
  );
}

function H3({ text, children, ...props }) {
  return (
    <h3 {...props}>
      {text}
      {children}
    </h3>
  );
}

export { H1, H3 };
