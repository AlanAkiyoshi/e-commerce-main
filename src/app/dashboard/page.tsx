import CardRelatorio from "@/components/cardrelatorio/cardrelatorio";
import prisma from "@/lib/prisma";

const Page = async () => {
  const res = await prisma.orderItem.findMany({
    include: {
      product: true,
    },
  });

  const totalArrecadado = res.reduce((total, orderItem) => {
    // Adiciona o preço do produto ao total
    return total + orderItem.product.price;
  }, 0); // O 0 inicializa o total como 0

  return (
    <main>
      <CardRelatorio
        titulo="Relatório de Vendas"
        qtdVendas={res.length}
        qtdArrecadado={totalArrecadado}
      />
    </main>
  );
};

export default Page;
