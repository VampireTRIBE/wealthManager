import "../../assets/styles/headings.css"
export default function H1({text, ...atr}) {
   return <h1 {...atr}>{text}</h1>   
}