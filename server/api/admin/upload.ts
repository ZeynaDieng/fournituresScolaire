// server/api/admin/upload.ts
import formidable from "formidable";
import { promises as fs } from "fs";
import path from "path";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default defineEventHandler(async (event) => {
  const form = formidable({
    multiples: false,
    uploadDir: path.join(process.cwd(), "public/images/uploads"),
    keepExtensions: true,
    maxFileSize: 5 * 1024 * 1024, // 5MB
  });

  return new Promise((resolve, reject) => {
    form.parse(event.node.req, async (err, fields, files) => {
      if (err) return reject({ success: false, message: "Erreur upload" });
      let file = files.file as formidable.File | formidable.File[] | undefined;
      if (Array.isArray(file)) file = file[0];
      if (!file) return reject({ success: false, message: "Aucun fichier" });
      const fileName = path.basename(file.filepath);
      resolve({ success: true, url: `/images/uploads/${fileName}` });
    });
  });
});
