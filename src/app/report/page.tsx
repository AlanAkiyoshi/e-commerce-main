"use client";
import { useState } from "react";

export default function ReportPage() {
  const [link, setLink] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const gerarRelatorio = async () => {
    setLoading(true);
    const res = await fetch("/api/report");
    const data = await res.json();
    setLoading(false);
    if (data.success) setLink(data.url);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Gerar Relatório de Compras</h1>
      <button
        onClick={gerarRelatorio}
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        disabled={loading}
      >
        {loading ? "Gerando..." : "Gerar Relatório"}
      </button>

      {link && (
        <p className="mt-3">
          ✅ Relatório pronto:{" "}
          <a href={link} download className="text-blue-600 underline">
            baixar
          </a>
        </p>
      )}
    </div>
  );
}
