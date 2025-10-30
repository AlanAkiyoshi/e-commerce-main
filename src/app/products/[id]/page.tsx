"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import "./product.css"; // CSS que você já está usando

async function getProduct(id: string) {
  const res = await fetch(`/api/products/${id}`, { cache: "no-store" });
  if (!res.ok) throw new Error("Produto não encontrado");
  return res.json();
}

export default function ProductPage({ params }: { params: { id: string } }) {
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [mainImage, setMainImage] = useState("");
  const [stockMessage, setStockMessage] = useState("");

  useEffect(() => {
    getProduct(params.id)
      .then((data) => {
        setProduct(data);
        setMainImage(data.images?.[0]?.url || "/placeholder.png");
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [params.id]);

  // 🔹 Calcula o estoque do tamanho selecionado
  const selectedStock =
    product?.sizes?.find((s: any) => s.size === selectedSize)?.stock ?? 0;

  const handleQuantity = (type: "increment" | "decrement") => {
    if (!selectedSize || !product) return;
    if (type === "increment") {
      if (quantity < selectedStock) {
        setQuantity((q) => q + 1);
        setStockMessage("");
      } else {
        setStockMessage("Quantidade máxima disponível no estoque!");
      }
    } else {
      setQuantity((q) => (q > 1 ? q - 1 : 1));
      setStockMessage("");
    }
  };

  const buyNow = async () => {
    if (!selectedSize || !product) {
      alert("Selecione um tamanho antes de comprar.");
      return;
    }

    try {
      const res = await fetch("/api/sales", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: product.id,
          size: selectedSize,
          quantity,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Erro ao realizar a compra.");
        return;
      }

      alert(`Compra concluída com sucesso! 🛒\nEstoque restante: ${data.remainingStock}`);

      const updatedSizes = product.sizes.map((s: any) =>
        s.size === selectedSize ? { ...s, stock: data.remainingStock } : s
      );
      setProduct({ ...product, sizes: updatedSizes });
      setQuantity(1);
    } catch (err) {
      console.error(err);
      alert("Erro ao realizar a compra.");
    }
  };

  if (loading) return <div className="loading">Carregando produto...</div>;
  if (!product) return <div className="not-found">Produto não encontrado 😢</div>;

  return (
    <div className="product-page">
      {/* GALERIA DE IMAGENS */}
      <div className="product-gallery">
        <div className="main-image-container">
          <Image
            src={mainImage}
            alt={product.name}
            width={500}
            height={500}
            className="main-image"
            priority
          />
        </div>

        <div className="thumbnail-container">
          {product.images?.map((img: any, idx: number) => (
            <Image
              key={idx}
              src={img.url || "/placeholder.png"}
              alt={`Imagem ${idx}`}
              width={90}
              height={90}
              className={`thumbnail ${mainImage === img.url ? "active" : ""}`}
              onClick={() => setMainImage(img.url || "/placeholder.png")}
            />
          ))}
        </div>
      </div>

      {/* INFORMAÇÕES DO PRODUTO */}
      <div className="product-info">
        <h1 className="product-title">{product.name}</h1>
        <p className="product-price">R$ {product.price.toFixed(2)}</p>
        <p className="product-description">{product.description}</p>

        {/* TAMANHOS */}
        <div className="product-size">
          <label>Tamanhos disponíveis:</label>
          <div className="size-buttons">
            {product.sizes?.map((s: any) => (
              <button
                key={s.id}
                className={`size-btn ${selectedSize === s.size ? "active" : ""}`}
                onClick={() => {
                  setSelectedSize(s.size);
                  setQuantity(1);
                  setStockMessage("");
                }}
                disabled={s.stock === 0}
              >
                {s.size}
              </button>
            ))}
          </div>

          {/* ESTOQUE ABAIXO */}
          {selectedSize && (
            <div className="stock-below">
              🧦 Estoque disponível: {selectedStock} unidades
            </div>
          )}
        </div>

        {/* QUANTIDADE */}
        <div className="product-quantity">
          <label>Quantidade:</label>
          <div className="quantity-control">
            <button onClick={() => handleQuantity("decrement")}>−</button>
            <span>{quantity}</span>
            <button onClick={() => handleQuantity("increment")}>+</button>
          </div>
          {stockMessage && <p className="stock-message">{stockMessage}</p>}
        </div>

        {/* BOTÃO DE COMPRA */}
        <div className="buy-section">
          <button className="buy-button" onClick={buyNow}>
            Comprar agora
          </button>
        </div>
      </div>
    </div>
  );
}
