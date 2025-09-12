import { defineNuxtRouteMiddleware, navigateTo, useRequestHeaders } from "#app";

export default defineNuxtRouteMiddleware((to, from) => {
  if (to.path.startsWith("/admin") && to.path !== "/admin/login") {
    let token: string | null = null;
    if (process.client) {
      token = localStorage.getItem("admin_token");
    } else if (process.server) {
      // Lecture du cookie côté serveur
      const cookie = useRequestHeaders()["cookie"] || "";
      const match = cookie.match(/admin_token=([^;]+)/);
      token = match ? match[1] : null;
    }
    if (!token) {
      return navigateTo("/admin/login");
    }
  }
});
