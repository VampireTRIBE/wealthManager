import Button from "../../../singleComponets/button/button";

function NavButtons({ btns }) {
  return (
    <>
      {btns.map((btn, index) => (
        <Button key={index} {...btn}>
          {btn.children}
        </Button>
      ))}
    </>
  );
}

export default NavButtons;
