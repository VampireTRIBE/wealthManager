import Button from "../../../singleComponets/button/button";
import btnStyle from "../../../singleComponets/button/button.module.css";
import { H1, H3, H4 } from "../../../singleComponets/heading/heading";
import productSectionStyle from "./productSection.module.css";

function ProductSection({ holdings = [] }) {
  return (
    <div className={productSectionStyle.main}>
      <div className={productSectionStyle.head}>
        <H1>Holdings</H1>
        <Button className={btnStyle.snbtns}>New</Button>
      </div>

      {holdings.map((holding, index) => (
        <div key={index} className={productSectionStyle.content}>
          <div className={`${productSectionStyle.title}`}>
            <H3>{holding.name}</H3>
            <div className={productSectionStyle.infobtn}>
              <Button className={btnStyle.buy}>Buy</Button>
              <Button className={btnStyle.sell}>Sell</Button>
            </div>
          </div>

          {Object.entries(holding.data || {}).map(([label, value]) => (
            <div key={label} className={productSectionStyle.info}>
              <H3>{label}</H3>
              <H4>{value}</H4>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

export default ProductSection;
