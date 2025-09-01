// server/api/orders/create.post.ts

import { prisma } from "../../prismaClient";
import { readBody } from "h3";

interface OrderRequestBody {
  name: string;
  email: string;
  phone: string;
  address: string;
  ref: string;
  items: any[];
  total: number;
}

export default defineEventHandler(async (event) => {
  const body = (await readBody(event)) as Partial<OrderRequestBody>;

  // Validate required fields
  const requiredFields = [
    "name",
    "email",
    "phone",
    "address",
    "ref",
    "items",
    "total",
  ];
  for (const field of requiredFields) {
    if (
      body[field as keyof OrderRequestBody] === undefined ||
      body[field as keyof OrderRequestBody] === null
    ) {
      return { success: false, message: `Missing required field: ${field}` };
    }
  }
  try {
    // Création ou récupération de l'utilisateur

    let user = await prisma.user.findUnique({ where: { email: body.email! } });
    if (!user) {
      try {
        user = await prisma.user.create({
          data: {
            name: body.name!,
            email: body.email!,
            phone: body.phone!,
            address: body.address!,
          },
        });
      } catch (userError) {
        if (userError instanceof Error) {
          return { success: false, message: userError.message };
        } else {
          return { success: false, message: "Failed to create user" };
        }
      }
    }
    if (!user) {
      return { success: false, message: "User creation failed" };
    }

    // Création de la commande

    const order = await prisma.order.create({
      data: {
        ref: body.ref!,
        userId: user.id,
        items: JSON.stringify(body.items),
        total: body.total!,
        status: "pending",
      },
    });

    // Création du paiement (statut en attente)

    await prisma.payment.create({
      data: {
        orderId: order.id,
        provider: "paytech",
        status: "pending",
        amount: body.total!,
      },
    });

    return { success: true, orderId: order.id };
  } catch (error) {
    if (error instanceof Error) {
      return { success: false, message: error.message };
    } else {
      return { success: false, message: "Unknown error occurred" };
    }
  }
});
