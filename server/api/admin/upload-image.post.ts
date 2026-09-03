// server/api/admin/upload-image.post.ts
import FormData from "form-data";
import fetch from "node-fetch";

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    if (!body || !body.base64) {
      return { success: false, message: "Aucune image envoyée." };
    }

    const base64Data = body.base64.replace(/^data:image\/\w+;base64,/, "");
    const buffer = Buffer.from(base64Data, "base64");

    const form = new FormData();
    form.append("file", buffer, {
      filename: `product-${Date.now()}.jpg`,
      contentType: "image/jpeg",
    });

    const res = await fetch("https://tmpfiles.org/api/v1/upload", {
      method: "POST",
      body: form as any,
    });

    const data: any = await res.json();
    if (data && data.data && data.data.url) {
      // Transformer tmpfiles.org/XXXX/file.jpg en tmpfiles.org/dl/XXXX/file.jpg pour affichage direct
      const directUrl = data.data.url.replace("tmpfiles.org/", "tmpfiles.org/dl/");
      return { success: true, url: directUrl };
    }

    return { success: false, message: "Erreur lors de l'hébergement cloud." };
  } catch (err: any) {
    console.error("Erreur upload-image API:", err);
    return { success: false, message: err?.message || "Erreur serveur upload" };
  }
});
