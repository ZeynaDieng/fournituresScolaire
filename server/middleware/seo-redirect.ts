import { defineEventHandler, getRequestHeader, sendRedirect } from "h3";

export default defineEventHandler((event) => {
  const host = getRequestHeader(event, "host") || "";
  const path = event.node.req.url || "/";

  // Redirection 301 (Permanente) de e-du.shop et www.e-du.shop vers edushop.sn
  if (
    host.includes("e-du.shop") ||
    host.startsWith("www.edushop.sn")
  ) {
    const targetUrl = `https://edushop.sn${path}`;
    console.log(`🔀 Redirection SEO 301: ${host}${path} -> ${targetUrl}`);
    return sendRedirect(event, targetUrl, 301);
  }
});
