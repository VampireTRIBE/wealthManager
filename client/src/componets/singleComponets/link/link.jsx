
const Link = ({ text, children, ...props }) => {
  return (
    <a {...props}>
      {text}
      {children}
    </a>
  );
};

export default Link;
