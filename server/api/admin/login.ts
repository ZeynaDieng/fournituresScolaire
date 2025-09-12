import { findAirtableUser } from "~/utils/airtable-users";
import { createHash } from "crypto";
import { defineEventHandler, readBody } from "h3";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  console.log("LOGIN BODY:", body);
  // Accepte username OU email
  const email = body.email || body.username;
  const user = await findAirtableUser(email);
  console.log("USER FOUND:", user);
  if (user) {
    if (user.Password === body.password) {
      const token = createHash("sha256")
        .update(user.Email + Date.now())
        .digest("hex");
      return { success: true, token };
    }
  }
  return { success: false, message: "Identifiants invalides" };
});
