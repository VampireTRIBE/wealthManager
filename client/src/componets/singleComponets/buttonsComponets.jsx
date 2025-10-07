import "../../assets/styles/buttons.css";

export default function Button({ text, ...atr }) {
  console.log(atr);
  return <button {...atr}>{text}</button>;
}

