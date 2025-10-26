import { useState } from "react";
import { useParams } from "react-router-dom";
import Button from "../../../singleComponets/button/button";
import btnStyle from "../../../singleComponets/button/button.module.css";
import { H1, H3, H4 } from "../../../singleComponets/heading/heading";
import productSectionStyle from "./productSection.module.css";
import { useUser } from "../../../../hooks/userContext";
import Input from "../../../singleComponets/input/input";
import inpStyle from "../../../singleComponets/input/input.module.css";
import api from "../../../../servises/apis/apis";

function ProductSection({ holdings = [], u_id, c_id }) {
  const { userData, setUserData } = useUser();
  const [activeForm, setActiveForm] = useState(null);
  const [newBuyFormData, setNewBuyFormData] = useState({});
  const [buyFormDataMap, setBuyFormDataMap] = useState({});
  const [sellFormDataMap, setSellFormDataMap] = useState({});

  const toggleNewHandler = () => {
    setActiveForm((prev) => (prev === "newBuy" ? null : "newBuy"));
  };
  const toggleBuyHandler = (id) => {
    setActiveForm((prev) =>
      prev?.type === "buy" && prev.id === id ? null : { type: "buy", id }
    );
  };
  const toggleSellHandler = (id) => {
    setActiveForm((prev) =>
      prev?.type === "sell" && prev.id === id ? null : { type: "sell", id }
    );
  };

  const handleNewBuyInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "tags") {
      setNewBuyFormData((prev) => ({ ...prev, [name]: value }));
    } else {
      setNewBuyFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleBuyInputChange = (id, e) => {
    const { name, value } = e.target;
    setBuyFormDataMap((prev) => ({
      ...prev,
      [id]: { ...prev[id], [name]: value },
    }));
  };
  const handleSellInputChange = (id, e) => {
    const { name, value } = e.target;
    setSellFormDataMap((prev) => ({
      ...prev,
      [id]: { ...prev[id], [name]: value },
    }));
  };

  const submitBuySell = async (e, type, id = null) => {
    e.preventDefault();
    try {
      let formData;
      let url;
      if (type === "newBuy") {
        const { name, description, industry, tags, quantity, Price, Date } =
          newBuyFormData;
        formData = {
          newProduct: {
            name,
            description,
            industry,
            tags: tags
              ? tags
                  .split(",")
                  .map((tag) => tag.trim())
                  .filter(Boolean)
              : [],
          },
          transaction: {
            quantity: Number(quantity),
            Price: Number(Price),
            Date: Date || new Date(),
          },
        };
        url = `/assets/product/${u_id}/${c_id}`;
      } else if (type === "buy") {
        const { quantity, Price, Date } = buyFormDataMap[id] || {};
        formData = {
          transaction: {
            quantity: Number(quantity),
            Price: Number(Price),
            Date: Date || new Date(),
          },
        };
        url = `/assets/transaction/${u_id}/${id}`;
      } else if (type === "sell") {
        const { quantity, Price, Date } = sellFormDataMap[id] || {};
        formData = {
          transaction: {
            quantity: Number(quantity),
            Price: Number(Price),
            Date: Date || new Date(),
          },
        };
        url = `/assets/transaction/${u_id}/${id}/sell`;
      }
      const res = await api.post(url, formData);
      if (type === "newBuy") setNewBuyFormData({});
      else if (type === "buy")
        setBuyFormDataMap((prev) => ({
          ...prev,
          [id]: {},
        }));
      else
        setSellFormDataMap((prev) => ({
          ...prev,
          [id]: {},
        }));
      setActiveForm(null);
      setUserData(res.data.Data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className={productSectionStyle.main}>
      <div className={productSectionStyle.head}>
        <H1>Holdings</H1>
        <Button
          className={btnStyle.snbtns}
          style={{ backgroundColor: "#10b981" }}
          onClick={toggleNewHandler}>
          New
        </Button>
      </div>

      <form
        className={`${productSectionStyle.Toggle} ${
          activeForm === "newBuy" ? productSectionStyle.Toggleopen : ""
        }`}
        onSubmit={(e) => submitBuySell(e, "newBuy")}>
        <div className={productSectionStyle.toggleDiv}>
          <div className={productSectionStyle.toggleDivSub}>
            <div className={productSectionStyle.toggleDivSub2}>
              <Input
                type="text"
                placeholder="Symbol"
                name="name"
                value={newBuyFormData?.name || ""}
                onChange={handleNewBuyInputChange}
                className={inpStyle.primery}
              />
              <Input
                type="Number"
                placeholder="Quantity"
                name="quantity"
                value={newBuyFormData?.quantity || ""}
                onChange={handleNewBuyInputChange}
                className={inpStyle.primery}
              />
            </div>
            <div className={productSectionStyle.toggleDivSub2}>
              <Input
                type="Number"
                placeholder="Price"
                name="Price"
                value={newBuyFormData?.Price || ""}
                onChange={handleNewBuyInputChange}
                className={inpStyle.primery}
              />
              <Input
                type="Date"
                name="Date"
                placeholder="Date"
                value={newBuyFormData?.Date || ""}
                onChange={handleNewBuyInputChange}
                className={inpStyle.primery}
              />
            </div>
          </div>
          <div className={productSectionStyle.toggleDivSub}>
            <div className={productSectionStyle.toggleDivSub2}>
              <Input
                type="text"
                placeholder="Description"
                name="description"
                value={newBuyFormData?.description || ""}
                onChange={handleNewBuyInputChange}
                className={inpStyle.primery}
              />
            </div>
            <div className={productSectionStyle.toggleDivSub2}>
              <Input
                type="text"
                placeholder="Sector"
                name="industry"
                value={newBuyFormData?.industry || ""}
                onChange={handleNewBuyInputChange}
                className={inpStyle.primery}
              />
              <Input
                type="text"
                placeholder="Tags (comma separated)"
                name="tags"
                value={newBuyFormData?.tags || ""}
                onChange={handleNewBuyInputChange}
                className={inpStyle.primery}
              />
            </div>
          </div>
        </div>
        <div className={productSectionStyle.btnDiv}>
          <div
            className={`${btnStyle.snbtns}`}
            onClick={() => setActiveForm(null)}>
            Cancel
          </div>
          <Button
            className={`${btnStyle.snbtns}`}
            style={{ backgroundColor: "#10b981" }}
            type="submit"
            text="Buy"
          />
        </div>
      </form>

      {holdings.map((holding) => (
        <div key={holding._id} className={productSectionStyle.content}>
          <div className={productSectionStyle.title}>
            <H3>{holding.name}</H3>
            <div className={productSectionStyle.infobtn}>
              <Button
                className={btnStyle.buy}
                onClick={() => toggleBuyHandler(holding._id)}>
                Buy
              </Button>
              <Button
                className={btnStyle.sell}
                onClick={() => toggleSellHandler(holding._id)}>
                Sell
              </Button>
            </div>
          </div>

          <form
            className={`${productSectionStyle.editcatToggle} ${
              activeForm?.type === "buy" && activeForm.id === holding._id
                ? productSectionStyle.editcatTogleopen
                : ""
            }`}
            onSubmit={(e) => submitBuySell(e, "buy", holding._id)}>
            <div className={productSectionStyle.inputDiv}>
              <Input
                type="Number"
                placeholder="Quantity"
                name="quantity"
                value={buyFormDataMap[holding._id]?.quantity || ""}
                onChange={(e) => handleBuyInputChange(holding._id, e)}
                className={inpStyle.primery}
              />
              <Input
                type="Number"
                placeholder="Price"
                name="Price"
                value={buyFormDataMap[holding._id]?.Price || ""}
                onChange={(e) => handleBuyInputChange(holding._id, e)}
                className={inpStyle.primery}
              />
            </div>
            <Input
              type="Date"
              name="Date"
              placeholder="Date"
              value={buyFormDataMap[holding._id]?.Date || ""}
              onChange={(e) => handleBuyInputChange(holding._id, e)}
              className={inpStyle.primery}
            />
            <div className={productSectionStyle.frombtndiv}>
              <div
                className={`${btnStyle.snbtns} ${productSectionStyle.fromdatabtn}`}
                onClick={() => setActiveForm(null)}>
                Cancel
              </div>
              <Button
                className={`${btnStyle.snbtns} ${productSectionStyle.fromdatabtn}`}
                type="submit"
                style={{ backgroundColor: "#10b981" }}
                text="Buy"
              />
            </div>
          </form>

          <form
            className={`${productSectionStyle.editcatToggle} ${
              activeForm?.type === "sell" && activeForm.id === holding._id
                ? productSectionStyle.editcatTogleopen
                : ""
            }`}
            onSubmit={(e) => submitBuySell(e, "sell", holding._id)}>
            <div className={productSectionStyle.inputDiv}>
              <Input
                type="Number"
                placeholder="Quantity"
                name="quantity"
                value={sellFormDataMap[holding._id]?.quantity || ""}
                onChange={(e) => handleSellInputChange(holding._id, e)}
                className={inpStyle.primery}
              />
              <Input
                type="Number"
                placeholder="Price"
                name="Price"
                value={sellFormDataMap[holding._id]?.Price || ""}
                onChange={(e) => handleSellInputChange(holding._id, e)}
                className={inpStyle.primery}
              />
            </div>
            <Input
              type="Date"
              placeholder="Date"
              name="Date"
              value={sellFormDataMap[holding._id]?.Date || ""}
              onChange={(e) => handleSellInputChange(holding._id, e)}
              className={inpStyle.primery}
            />
            <div className={productSectionStyle.frombtndiv}>
              <div
                className={`${btnStyle.snbtns} ${productSectionStyle.fromdatabtn}`}
                onClick={() => setActiveForm(null)}>
                Cancel
              </div>
              <Button
                className={`${btnStyle.snbtns} ${productSectionStyle.fromdatabtn}`}
                type="submit"
                style={{ backgroundColor: "orange" }}
                text="Sell"
              />
            </div>
          </form>

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
