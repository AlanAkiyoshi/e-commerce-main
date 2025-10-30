"use client";

import { useEffect, useState } from "react";
import "./manage.css";

interface Size {
  id?: string;
  size: string;
  stock: number;
}

interface Image {
  id?: string;
  url: string;
}

export default function ManageProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [form, setForm] = useState({
    id: "",
    name: "",
    description: "",
    price: "",
    categoryId: "",
  });
  const [sizes, setSizes] = useState<Size[]>([]);
  const [images, setImages] = useState<Image[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchProducts = async () => {
    try {
      const res = await fetch("/api/products");
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      console.error("Erro ao buscar produtos:", err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const resetForm = () => {
    setForm({ id: "", name: "", description: "", price: "", categoryId: "" });
    setSizes([]);
    setImages([]);
  };

  const addSize = () => setSizes([...sizes, { size: "", stock: 0 }]);
  const removeSize = (i: number) => setSizes(sizes.filter((_, idx) => idx !== i));

  const addImage = () => setImages([...images, { url: "" }]);
  const removeImage = (i: number) => setImages(images.filter((_, idx) => idx !== i));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.price) {
      alert("Preencha nome e preço!");
      return;
    }

    setLoading(true);
    try {
      const method = form.id ? "PUT" : "POST";
      const url = form.id ? `/api/products/${form.id}` : "/api/products";

      const payload = {
        ...form,
        price: parseFloat(form.price),
        sizes: sizes.map((s) => ({ size: s.size, stock: s.stock })),
        images: images.map((img) => img.url),
      };

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Erro ao salvar produto");

      alert(form.id ? "Produto atualizado!" : "Produto criado!");
      resetForm();
      fetchProducts();
    } catch (err) {
      console.error(err);
      alert("Erro ao salvar produto.");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (p: any) => {
    setForm({
      id: p.id,
      name: p.name,
      description: p.description || "",
      price: String(p.price),
      categoryId: p.categoryId || "",
    });
    setSizes(p.sizes || []);
    setImages(p.images?.map((img: any) => ({ url: img.url })) || []);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir este produto?")) return;

    try {
      const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Erro ao excluir produto");

      alert("Produto excluído!");
      fetchProducts();
      if (form.id === id) resetForm();
    } catch (err) {
      console.error(err);
      alert("Erro ao excluir produto.");
    }
  };

  const handleReportDownload = async () => {
    try {
      const res = await fetch("/api/sales/report");
      if (!res.ok) throw new Error("Erro ao gerar relatório");
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "relatorio_vendas.xlsx";
      link.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      alert("Erro ao baixar relatório.");
    }
  };

  return (
    <main className="manage-container">
      <div className="top-actions">
        <h1 className="title">Gerenciamento de Produtos</h1>
        <button onClick={handleReportDownload} className="report-button">
          📊 Baixar Relatório de Vendas
        </button>
      </div>

      <form className="form" onSubmit={handleSubmit}>
        <h2>{form.id ? "Editar Produto" : "Criar Novo Produto"}</h2>

        <input
          placeholder="Nome do produto"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <textarea
          placeholder="Descrição"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />
        <input
          type="number"
          placeholder="Preço"
          value={form.price}
          onChange={(e) => setForm({ ...form, price: e.target.value })}
        />
        <input
          placeholder="ID da Categoria (opcional)"
          value={form.categoryId}
          onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
        />

        <div className="section">
          <h3>Tamanhos e Estoque</h3>
          {sizes.map((s, i) => (
            <div key={i} className="row">
              <input
                placeholder="Tamanho (ex: P, M, G)"
                value={s.size}
                onChange={(e) => {
                  const updated = [...sizes];
                  updated[i].size = e.target.value;
                  setSizes(updated);
                }}
              />
              <input
                type="number"
                placeholder="Qtd"
                value={s.stock}
                onChange={(e) => {
                  const updated = [...sizes];
                  updated[i].stock = parseInt(e.target.value) || 0;
                  setSizes(updated);
                }}
                style={{ width: "80px" }}
              />
              <button type="button" onClick={() => removeSize(i)}>
                ❌
              </button>
            </div>
          ))}
          <button type="button" className="btn-add" onClick={addSize}>
            ➕ Adicionar tamanho
          </button>
        </div>

        <div className="section">
          <h3>Imagens</h3>
          {images.map((img, i) => (
            <div key={i} className="row">
              <input
                placeholder="URL da imagem"
                value={img.url}
                onChange={(e) => {
                  const updated = [...images];
                  updated[i].url = e.target.value;
                  setImages(updated);
                }}
              />
              <button type="button" onClick={() => removeImage(i)}>
                ❌
              </button>
            </div>
          ))}
          <button type="button" className="btn-add" onClick={addImage}>
            ➕ Adicionar imagem
          </button>
        </div>

        <button type="submit" disabled={loading} className="btn-submit">
          {loading
            ? "Salvando..."
            : form.id
            ? "Salvar Alterações"
            : "Criar Produto"}
        </button>

        {form.id && (
          <button type="button" onClick={resetForm} className="btn-reset">
            ➕ Criar novo produto
          </button>
        )}
      </form>

      <h2 className="subtitle">Lista de Produtos</h2>
      <ul className="product-list">
        {products.map((p) => (
          <li key={p.id} className="product-item">
            <strong>{p.name}</strong> — R${p.price.toFixed(2)} <br />
            {p.sizes?.length ? (
              <small>
                Tamanhos:{" "}
                {p.sizes.map((s: any) => `${s.size}(${s.stock})`).join(", ")}
              </small>
            ) : (
              <small>Sem tamanhos cadastrados</small>
            )}
            <br />
            <div className="actions">
              <button className="edit-button" onClick={() => handleEdit(p)}>
                Editar
              </button>
              <button className="delete-button" onClick={() => handleDelete(p.id)}>
                Excluir
              </button>
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
}
