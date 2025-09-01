import { PrismaClient } from "@prisma/client";
import { readBody } from "h3";

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  if (event.method === "GET") {
    const users = await prisma.user.findMany();
    return users;
  }

  if (event.method === "POST") {
    const body = await readBody(event);
    const user = await prisma.user.create({ data: body });
    return user;
  }

  if (event.method === "PUT") {
    const id = Number(event.context?.params?.id);
    const body = await readBody(event);
    return await prisma.user.update({ where: { id }, data: body });
  }
  if (event.method === "DELETE") {
    const id = Number(event.context?.params?.id);
    await prisma.user.delete({ where: { id } });
    return { success: true };
  }

  return null;
});
