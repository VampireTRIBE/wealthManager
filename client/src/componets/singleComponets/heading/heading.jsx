
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

function H4({ text, children, ...props }) {
  return (
    <h4 {...props}>
      {text}
      {children}
    </h4>
  );
}

export { H1, H3, H4 };
