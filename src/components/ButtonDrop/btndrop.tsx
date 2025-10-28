import "./btndrop.css";

const ButtonDrop = ({ ...props }) => {
  return (
    <button className="button" {...props}>
      <p>Ver Produtos</p>
    </button>
  );
};

export default ButtonDrop;
