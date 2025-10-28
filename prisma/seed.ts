// prisma/seed.ts
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Iniciando seed do banco de dados...");

  // ================= CATEGORIAS =================
  const categories = ["Acessórios", "Roupas", "Calçados"];
  for (const name of categories) {
    await prisma.category.upsert({
      where: { name },
      update: {},
      create: { name },
    });
  }
  console.log("✅ Categorias criadas!");

  // ================= USUÁRIO ADMIN =================
  const adminPassword = await bcrypt.hash("admin123", 10);
  const admin = await prisma.user.upsert({
    where: { email: "admin@admin.com" },
    update: {},
    create: {
      name: "Admin",
      email: "admin@admin.com",
      password: adminPassword,
      role: "ADMIN",
    },
  });
  console.log(`👑 Usuário admin criado: ${admin.email}`);

  // =========================
  // PRODUTOS
  // =========================
  const products = [
    {
      name: "NOCTA x Nike Boné Black",
      price: 449.99,
      categoryName: "Acessórios",
      images: [
        "https://droper-media.us-southeast-1.linodeobjects.com/212202420457292.webp",
        "https://droper-media.us-southeast-1.linodeobjects.com/2122024204511742.webp",
        "https://droper-media.us-southeast-1.linodeobjects.com/2122024204519285.webp",
      ],
      sizes: ["U"],
    },
    {
      name: "Camiseta Nike Brasil Ronaldinho 2004 Total 90",
      price: 499.99,
      categoryName: "Roupas",
      images: [
        "https://droper-lapse.us-southeast-1.linodeobjects.com/20250722211133448-210.webp",
        "https://droper-lapse.us-southeast-1.linodeobjects.com/20250722211133893-706.webp",
        "https://droper-lapse.us-southeast-1.linodeobjects.com/20250722211142650-964.webp",
      ],
      sizes: ["P", "M", "G", "GG"],
    },
    {
      name: "New Balance 9060 Mineral Grey Matter",
      price: 1299.99,
      categoryName: "Calçados",
      images: [
        "https://droper-lapse.us-southeast-1.linodeobjects.com/20250528183255720-473.webp",
        "https://droper-lapse.us-southeast-1.linodeobjects.com/20250528183303395-823.webp",
        "https://droper-lapse.us-southeast-1.linodeobjects.com/20250528183300781-749.webp",
      ],
      sizes: ["38", "39", "40", "41", "42", "43"],
    },
    {
      name: "Camiseta Stussy Cali Grown Tee Pigment Dyed Natural",
      price: 549.99,
      categoryName: "Roupas",
      images: [
        "https://droper-lapse.us-southeast-1.linodeobjects.com/20251006182223240-141.webp",
        "https://droper-lapse.us-southeast-1.linodeobjects.com/20251006182223419-981.webp",
      ],
      sizes: ["P", "M", "G", "GG"],
    },
    {
      name: "Vans Knu Skool Black",
      price: 699.99,
      categoryName: "Calçados",
      images: [
        "https://droper-lapse.us-southeast-1.linodeobjects.com/20250417193349821-703.webp",
        "https://droper-lapse.us-southeast-1.linodeobjects.com/20250417193349689-851.webp",
        "https://droper-lapse.us-southeast-1.linodeobjects.com/20250417193349866-820.webp",
      ],
      sizes: ["37", "38", "39", "40", "41", "42", "43"],
    },
    {
      name: "Piet x Oakley Camiseta Skull Black",
      price: 599.99,
      categoryName: "Roupas",
      images: [
        "https://droper-lapse.us-southeast-1.linodeobjects.com/20250408215938126-274.webp",
        "https://droper-lapse.us-southeast-1.linodeobjects.com/20250408215931658-249.webp",
        "https://droper-lapse.us-southeast-1.linodeobjects.com/20250408215938302-790.webp",
      ],
      sizes: ["P", "M", "G", "GG"],
    },
    {
      name: "Oakley x Piet Touca Static Black",
      price: 349.99,
      categoryName: "Acessórios",
      images: [
        "https://droper-media.us-southeast-1.linodeobjects.com/1112202317911294.webp",
        "https://droper-media.us-southeast-1.linodeobjects.com/1112202317916394.webp",
        "https://droper-media.us-southeast-1.linodeobjects.com/1112202317926401.webp",
      ],
      sizes: ["U"],
    },
    {
      name: "Off-White x Nike Top Short-Sleeve Black",
      price: 799.99,
      categoryName: "Roupas",
      images: [
        "https://droper-media.us-southeast-1.linodeobjects.com/21122023194315436.webp",
        "https://droper-media.us-southeast-1.linodeobjects.com/21122023194353391.webp",
        "https://droper-media.us-southeast-1.linodeobjects.com/21122023194322301.webp",
      ],
      sizes: ["P", "M", "G", "GG"],
    },
    {
      name: "Calça Supreme Baggy Jeans Realtree AP Camo FW25",
      price: 1099.99,
      categoryName: "Roupas",
      images: [
        "https://droper-lapse.us-southeast-1.linodeobjects.com/20250827182929140-109.webp",
      ],
      sizes: ["38", "39", "40", "41", "42", "43"],
    },
    {
      name: "Calça Denim Tears Cotton Wreath Baggy Black",
      price: 1199.99,
      categoryName: "Roupas",
      images: [
        "https://droper-lapse.us-southeast-1.linodeobjects.com/20250317174441507-637.webp",
        "https://droper-lapse.us-southeast-1.linodeobjects.com/20250317174441496-190.webp",
      ],
      sizes: ["38", "39", "40", "41", "42", "43"],
    },
    {
      name: "Moletom Supreme Small Box Crewneck Navy FW25",
      price: 799.99,
      categoryName: "Roupas",
      images: [
        "https://droper-lapse.us-southeast-1.linodeobjects.com/20251003175235936-133.webp",
      ],
      sizes: ["P", "M", "G", "GG"],
    },
    {
      name: "Moletom Off-White Paint Script Skate Crewneck Barolo White",
      price: 1099.99,
      categoryName: "Roupas",
      images: [
        "https://droper-lapse.us-southeast-1.linodeobjects.com/20241227132023502-628.webp",
        "https://droper-lapse.us-southeast-1.linodeobjects.com/20241227132022662-767.webp",
        "https://droper-lapse.us-southeast-1.linodeobjects.com/20241227132024336-115.webp",
      ],
      sizes: ["P", "M", "G", "GG"],
    },
    {
      name: "Moletom Fear of God Essentials Classic Fleece Zip-Up Timber",
      price: 1299.99,
      categoryName: "Roupas",
      images: [
        "https://droper-lapse.us-southeast-1.linodeobjects.com/20251006151119285-282.webp",
        "https://droper-lapse.us-southeast-1.linodeobjects.com/20251006151118982-752.webp",
      ],
      sizes: ["P", "M", "G", "GG"],
    },
    {
      name: "Moletom Stussy Stock New York Navy",
      price: 699.99,
      categoryName: "Roupas",
      images: [
        "https://droper-lapse.us-southeast-1.linodeobjects.com/20250924154829820-367.webp",
        "https://droper-lapse.us-southeast-1.linodeobjects.com/20250924154829827-791.webp",
      ],
      sizes: ["P", "M", "G", "GG"],
    },
    {
      name: "Boné Palace Denim P 6-Panel Black",
      price: 399.99,
      categoryName: "Acessórios",
      images: [
        "https://droper-lapse.us-southeast-1.linodeobjects.com/2025090316502777-705.webp",
        "https://droper-lapse.us-southeast-1.linodeobjects.com/20250903165027304-957.webp",
      ],
      sizes: ["U"],
    },
    {
      name: "Calça Coroa Jeans Baggy Sand",
      price: 1099.99,
      categoryName: "Roupas",
      images: [
        "https://droper-lapse.us-southeast-1.linodeobjects.com/20250701133812954-677.webp",
        "https://droper-lapse.us-southeast-1.linodeobjects.com/20250701133812135-842.webp",
      ],
      sizes: ["38", "39", "40", "41", "42", "43"],
    },
    {
      name: "Boné DP Studio Ravers Inc",
      price: 449.99,
      categoryName: "Acessórios",
      images: [
        "https://droper-lapse.us-southeast-1.linodeobjects.com/20250722184809624-660.webp",
        "https://droper-lapse.us-southeast-1.linodeobjects.com/2025072218481025-342.webp",
      ],
      sizes: ["U"],
    },
    {
      name: "Ambush x Nike Air Force 1 Low Phantom",
      price: 1499.99,
      categoryName: "Calçados",
      images: [
        "https://droper-media.us-southeast-1.linodeobjects.com/2842023185438993.webp",
        "https://droper-media.us-southeast-1.linodeobjects.com/2842023185442780.webp",
        "https://droper-media.us-southeast-1.linodeobjects.com/2842023185447388.webp",
      ],
      sizes: ["37", "38", "39", "40", "41", "42", "43"],
    },
    {
      name: "Nike Dunk Low Midnight Navy White",
      price: 999.99,
      categoryName: "Calçados",
      images: [
        "https://droper-lapse.us-southeast-1.linodeobjects.com/20250117200444443-604.webp",
      ],
      sizes: ["37", "38", "39", "40", "41", "42", "43"],
    },
    {
      name: "Bad Bunny x adidas Campus Light Cloud White",
      price: 1299.99,
      categoryName: "Calçados",
      images: [
        "https://droper-media.us-southeast-1.linodeobjects.com/832023182921545.webp",
        "https://droper-media.us-southeast-1.linodeobjects.com/832023182926193.webp",
        "https://droper-media.us-southeast-1.linodeobjects.com/832023182931326.webp",
      ],
      sizes: ["37", "38", "39", "40", "41", "42", "43"],
    },
  ];

 for (const product of products) {
    const category = await prisma.category.findUnique({
      where: { name: product.categoryName },
    });
    if (!category) {
      console.warn(`⚠️ Categoria não encontrada: ${product.categoryName}`);
      continue;
    }

    const createdProduct = await prisma.product.create({
      data: {
        name: product.name,
        price: product.price,
        categoryId: category.id,
        images: {
          create: product.images.map((url) => ({ url })),
        },
        sizes: {
          create: product.sizes.map((size) => ({
            size,
            stock: Math.floor(Math.random() * 10) + 1,
          })),
        },
      },
    });
    console.log(`✅ Produto criado: ${createdProduct.name}`);
  }

  console.log("🌿 Seed finalizado com sucesso!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });