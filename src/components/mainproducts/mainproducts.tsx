"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/navigation";

interface Image {
  id: string;
  productId: string;
  url: string;
  createdAt: Date;
  updatedAt: Date;
}

interface Produto {
  id: string;
  categoryId: string;
  name: string;
  price: number;
  isFeatured: boolean;
  isArchived: boolean;
  size: string;
  dropId: string | null;
  createdAt: Date;
  updatedAt: Date;
  images: Image[];
}

const MainProducts = () => {
  const [products, setProducts] = useState<Produto[]>([]);
  const router = useRouter();

  useEffect(() => {
    async function getProducts() {
      try {
        const resProducts = await axios.get("/api/products", {
          validateStatus: () => true,
        });
        setProducts(Array.isArray(resProducts.data) ? resProducts.data : []);
      } catch (error) {
        console.error("Erro ao obter produtos:", error);
        setProducts([]);
        toast.error("Erro ao carregar produtos 😳");
      }
    }

    getProducts();
  }, []);

  return (
    <div style={{ margin: "1rem" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-start",
          flexWrap: "wrap",
          gap: "2rem",
        }}
      >
        {products.length > 0 ? (
          products.map((product) => (
            <div
              key={product.id}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                margin: "1rem",
                width: "250px",
                borderRadius: "10px",
                boxShadow: "0px 0px 10px 0px rgba(0,0,0,0.10)",
                background: "#fff",
                padding: "1rem",
                cursor: "pointer",
              }}
              onClick={() => router.push(`/products/${product.id}`)}
            >
              {product.images && product.images.length > 0 ? (
                <img
                  src={product.images[0]?.url || "/placeholder.png"}
                  alt={product.name}
                  style={{
                    width: "100%",
                    height: "250px",
                    objectFit: "cover",
                    borderRadius: "8px",
                    marginBottom: "1rem",
                  }}
                />
              ) : (
                <img
                  src="/placeholder.png"
                  alt={product.name}
                  style={{
                    width: "100%",
                    height: "250px",
                    objectFit: "cover",
                    borderRadius: "8px",
                    marginBottom: "1rem",
                  }}
                />
              )}

              <div style={{ width: "100%", textAlign: "left" }}>
                <h2 style={{ fontSize: "1.1rem", margin: "0 0 0.5rem 0" }}>
                  {product.name}
                </h2>
                <h3 style={{ color: "#222", fontWeight: 600, margin: 0 }}>
                  R$ {product.price.toFixed(2)}
                </h3>
              </div>
            </div>
          ))
        ) : (
          <div/>
        )}
      </div>
      <ToastContainer />
    </div>
  );
};

export default MainProducts;
