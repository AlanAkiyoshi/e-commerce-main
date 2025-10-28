import "./buttonbuy.css";

const ButtonBuy = ({ ...props }) => {
  return (
    <button className="button-buy" {...props}>
      Comprar!!
    </button>
  );
};

export default ButtonBuy;
