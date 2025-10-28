// src/app/products/[id]/page.tsx
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import "./product.css"; // corrigido: antes estava './products.css'

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

  const handleQuantity = (type: "increment" | "decrement") => {
    if (!selectedSize || !product) return;

    const selectedProductSize = product.sizes.find((s: any) => s.size === selectedSize);
    const maxStock = selectedProductSize?.stock || 1;

    if (type === "increment") {
      if (quantity < maxStock) {
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

  const addToCart = async () => {
    if (!selectedSize || !product) {
      alert("Selecione um tamanho antes de adicionar ao carrinho.");
      return;
    }

    try {
      const res = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: product.id,
          size: selectedSize,
          quantity,
        }),
      });
      if (!res.ok) throw new Error("Erro ao adicionar ao carrinho");
      alert("Produto adicionado ao carrinho!");
    } catch (error) {
      console.error(error);
      alert("Não foi possível adicionar ao carrinho.");
    }
  };

  if (loading) return <div className="loading">Carregando produto...</div>;
  if (!product) return <div className="not-found">Produto não encontrado 😢</div>;

  return (
    <div className="product-page">
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

      <div className="product-info">
        <h1 className="product-title">{product.name}</h1>
        <p className="product-price">R$ {product.price.toFixed(2)}</p>
        <p className="product-description">{product.description}</p>

        <div className="product-size">
          <label>Tamanho:</label>
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
              >
                {s.size} ({s.stock} disponíveis)
              </button>
            ))}
          </div>
        </div>

        <div className="product-quantity">
          <label>Quantidade:</label>
          <div className="quantity-control">
            <button onClick={() => handleQuantity("decrement")}>−</button>
            <span>{quantity}</span>
            <button onClick={() => handleQuantity("increment")}>+</button>
          </div>
          {stockMessage && <p className="stock-message">{stockMessage}</p>}
        </div>

        <button className="buy-button" onClick={addToCart}>
          Adicionar ao carrinho 🛒
        </button>
      </div>
    </div>
  );
}
