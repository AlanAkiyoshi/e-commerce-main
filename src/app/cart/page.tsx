"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import axios from "axios";
import "./cart.css";  // <--- aqui você importa o CSS


interface CartItem {
  id: string;
  productId: string;
  size: string;
  quantity: number;
  maxQuantity: number; // estoque máximo
  product: {
    name: string;
    price: number;
    images: { url: string }[];
  };
}

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const res = await axios.get("/api/cart");
      setCartItems(res.data.items || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const removeItem = async (id: string) => {
    try {
      await axios.delete(`/api/cart/${id}`);
      setCartItems(cartItems.filter((item) => item.id !== id));
    } catch (err) {
      console.error(err);
      setMessage("Não foi possível remover o item.");
    }
  };

  const updateQuantity = async (id: string, quantity: number) => {
    if (quantity < 1) return;

    const item = cartItems.find((i) => i.id === id);
    if (!item) return;

    if (quantity > item.maxQuantity) {
      setMessage("Não há mais estoque disponível para este produto!");
      return;
    }

    try {
      await axios.patch(`/api/cart/${id}`, { quantity });
      setCartItems(
        cartItems.map((i) => (i.id === id ? { ...i, quantity } : i))
      );
      setMessage("");
    } catch (err) {
      console.error(err);
      setMessage("Erro ao atualizar quantidade.");
    }
  };

  const handleCheckout = async () => {
    try {
      const total = cartItems.reduce(
        (acc, item) => acc + item.product.price * item.quantity,
        0
      );
      await axios.post("/api/orders", { items: cartItems, total });
      alert("Pedido realizado com sucesso!");
      setCartItems([]);
    } catch (err) {
      console.error(err);
      alert("Erro ao finalizar o pedido.");
    }
  };

  if (loading) return <div className="loading">Carregando carrinho...</div>;
  if (!cartItems.length)
    return <div className="empty-cart">Seu carrinho está vazio 😢</div>;

  return (
    <div className="cart-page">
      <h1>Meu Carrinho</h1>

      {message && <p className="cart-message">{message}</p>}

      <div className="cart-items">
        {cartItems.map((item) => (
          <div className="cart-item" key={item.id}>
            <div className="image-box">
              <Image
                src={item.product.images[0]?.url || ""}
                alt={item.product.name}
                width={120}
                height={120}
                className="product-image"
              />
            </div>

            <div className="info-box">
              <h2>{item.product.name}</h2>
              <p>Tamanho: {item.size}</p>
              <p>Preço: R$ {item.product.price.toFixed(2)}</p>

              <div className="quantity-box">
                <button
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  className="qty-btn"
                  disabled={item.quantity <= 1}
                >
                  -
                </button>
                <span>{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  className="qty-btn"
                  disabled={item.quantity >= item.maxQuantity}
                >
                  +
                </button>
              </div>

              <button
                className="remove-btn"
                onClick={() => removeItem(item.id)}
              >
                Remover
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="checkout-box">
        <p className="cart-total">
          Total: R${" "}
          {cartItems
            .reduce(
              (acc, item) => acc + item.product.price * item.quantity,
              0
            )
            .toFixed(2)}
        </p>
        <button className="checkout-btn" onClick={handleCheckout}>
          Finalizar Pedido
        </button>
      </div>
    </div>
  );
}
