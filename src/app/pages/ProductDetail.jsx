import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import "./product_detail.css";

export default function ProductDetail({ products }) {
  const { id } = useParams();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    const found = products.find((p) => p.id.toString() === id);
    setProduct(found);
  }, [id, products]);

  if (!product) return <h2>Produto não encontrado 😔</h2>;

  return (
    <div className="product-detail-container">
      <div className="product-image">
        <img src={product.image} alt={product.name} />
      </div>
      <div className="product-info">
        <h1>{product.name}</h1>
        <p className="product-price">R$ {product.price.toFixed(2)}</p>
        <p className="product-description">{product.description}</p>
        <button className="buy-button">Adicionar ao carrinho 🛒</button>
      </div>
    </div>
  );
}
