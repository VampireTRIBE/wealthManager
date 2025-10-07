import "../../assets/styles/images.css"

export default function Image(attr) {
   console.log(attr);
  return <img {...attr}></img>;
}
