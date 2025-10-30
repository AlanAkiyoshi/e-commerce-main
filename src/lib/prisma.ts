import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import { neonConfig } from "@neondatabase/serverless";



const connectionString = `${process.env.DATABASE_URL}`;
const adapter = new PrismaNeon({ connectionString });

declare global {
  var prisma: PrismaClient | undefined;
}

const prisma =
  globalThis.prisma ||
  new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") {
  globalThis.prisma = prisma;
}

export default prisma;
