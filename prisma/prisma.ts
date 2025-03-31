import { PrismaClient } from "@prisma/client/edge";

export const prisma = new PrismaClient({
  log: ["query", "info", "warn", "error"],
});
