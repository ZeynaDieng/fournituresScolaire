// tests/admin.spec.ts
import { test, expect } from "@playwright/test";

// Variables d'identifiants admin (à adapter selon votre config)
const BASE_URL = process.env.PLAYWRIGHT_BASE_URL || "http://localhost:3000";
const ADMIN_URL = `${BASE_URL}/admin/login`;
const ADMIN_DASHBOARD = `${BASE_URL}/admin/stats-simple`;
const ADMIN_EMAIL = process.env.PLAYWRIGHT_ADMIN_EMAIL || "admin";
const ADMIN_PASSWORD = process.env.PLAYWRIGHT_ADMIN_PASSWORD || "admin123";

// Utilitaires pour générer des données aléatoires
function randomString(length = 8) {
  return Math.random()
    .toString(36)
    .substring(2, 2 + length);
}

// Utilitaire pour remplir le formulaire de connexion admin
async function fillAdminLogin(page, email, password) {
  if ((await page.locator("input#username").count()) > 0) {
    await page.fill("input#username", email);
  } else if ((await page.locator('input[type="email"]').count()) > 0) {
    await page.fill('input[type="email"]', email);
  } else if ((await page.locator('input[type="text"]').count()) > 0) {
    await page.fill('input[type="text"]', email);
  } else {
    throw new Error("Champ identifiant non trouvé");
  }
  await page.fill('input[type="password"]', password);
}

test.describe("Admin Panel E2E", () => {
  test("Connexion admin", async ({ page }) => {
    await page.goto(ADMIN_URL);
    await fillAdminLogin(page, ADMIN_EMAIL, ADMIN_PASSWORD);
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(ADMIN_DASHBOARD);
    await expect(page.locator("text=Statistiques Simplifiées")).toBeVisible();
  });

  test("Navigation sidebar", async ({ page }) => {
    await page.goto(ADMIN_URL);
    await fillAdminLogin(page, ADMIN_EMAIL, ADMIN_PASSWORD);
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(ADMIN_DASHBOARD);
    // Navigation produits
    await page.click("nav >> text=Produits");
    await expect(
      page.locator("h1, h2, h3", { hasText: "Produits" })
    ).toBeVisible();
    // Navigation packs
    await page.click("nav >> text=Packs");
    await expect(
      page.locator("h1, h2, h3", { hasText: "Packs" })
    ).toBeVisible();
    // Navigation promotions
    await page.click("nav >> text=Promotions");
    await expect(
      page.locator("h1, h2, h3", { hasText: "Promotions" })
    ).toBeVisible();
    // Navigation commandes
    await page.click("nav >> text=Commandes");
    await expect(
      page.locator("h1, h2, h3", { hasText: "Commandes" })
    ).toBeVisible();
  });

  test("CRUD produit", async ({ page }) => {
    await page.goto(ADMIN_URL);
    await fillAdminLogin(page, ADMIN_EMAIL, ADMIN_PASSWORD);
    await page.click('button[type="submit"]');
    await page.click("nav >> text=Produits");
    // Ajout produit
    await page.click('button:has-text("Ajouter")');
    const name = "TestProduit-" + randomString();
    await page.fill('input[name="name"]', name);
    await page.fill('input[name="price"]', "999");
    await page.fill('input[name="category"]', "Cahiers");
    await page.fill('textarea[name="description"]', "Produit Playwright");
    await page.click('button:has-text("Enregistrer")');
    await expect(page.locator("td", { hasText: name })).toBeVisible();
    // Edition produit
    await page.click(`tr:has-text("${name}") button:has-text("Éditer")`);
    await page.fill('input[name="price"]', "888");
    await page.click('button:has-text("Enregistrer")');
    await expect(page.locator("td", { hasText: "888" })).toBeVisible();
    // Suppression produit
    await page.click(`tr:has-text("${name}") button:has-text("Supprimer")`);
    await page.click('button:has-text("Confirmer")');
    await expect(page.locator("td", { hasText: name })).not.toBeVisible();
  });

  test("CRUD pack", async ({ page }) => {
    await page.goto(ADMIN_URL);
    await fillAdminLogin(page, ADMIN_EMAIL, ADMIN_PASSWORD);
    await page.click('button[type="submit"]');
    await page.click("nav >> text=Packs");
    // Ajout pack
    await page.click('button:has-text("Ajouter")');
    const name = "TestPack-" + randomString();
    await page.fill('input[name="name"]', name);
    await page.fill('input[name="price"]', "1999");
    await page.fill('input[name="level"]', "CP");
    await page.fill('textarea[name="description"]', "Pack Playwright");
    await page.click('button:has-text("Enregistrer")');
    await expect(page.locator("td", { hasText: name })).toBeVisible();
    // Edition pack
    await page.click(`tr:has-text("${name}") button:has-text("Éditer")`);
    await page.fill('input[name="price"]', "1888");
    await page.click('button:has-text("Enregistrer")');
    await expect(page.locator("td", { hasText: "1888" })).toBeVisible();
    // Suppression pack
    await page.click(`tr:has-text("${name}") button:has-text("Supprimer")`);
    await page.click('button:has-text("Confirmer")');
    await expect(page.locator("td", { hasText: name })).not.toBeVisible();
  });

  test("CRUD promotion", async ({ page }) => {
    await page.goto(ADMIN_URL);
    await fillAdminLogin(page, ADMIN_EMAIL, ADMIN_PASSWORD);
    await page.click('button[type="submit"]');
    await page.click("nav >> text=Promotions");
    // Ajout promotion
    await page.click('button:has-text("Ajouter")');
    const title = "Promo-" + randomString();
    await page.fill('input[name="title"]', title);
    await page.fill('input[name="discount"]', "15");
    await page.fill('textarea[name="description"]', "Promo Playwright");
    await page.click('button:has-text("Enregistrer")');
    await expect(page.locator("td", { hasText: title })).toBeVisible();
    // Edition promotion
    await page.click(`tr:has-text("${title}") button:has-text("Éditer")`);
    await page.fill('input[name="discount"]', "20");
    await page.click('button:has-text("Enregistrer")');
    await expect(page.locator("td", { hasText: "20" })).toBeVisible();
    // Suppression promotion
    await page.click(`tr:has-text("${title}") button:has-text("Supprimer")`);
    await page.click('button:has-text("Confirmer")');
    await expect(page.locator("td", { hasText: title })).not.toBeVisible();
  });

  test("Notifications commandes et contact", async ({ page }) => {
    await page.goto(ADMIN_URL);
    await fillAdminLogin(page, ADMIN_EMAIL, ADMIN_PASSWORD);
    await page.click('button[type="submit"]');
    await page.click("nav >> text=Commandes");
    // Vérifie qu'une notification est visible pour une commande récente
    await expect(
      page.locator(".notification, .toast, .alert", { hasText: "commande" })
    ).toBeVisible({ timeout: 10000 });
    // Navigation contact/messages
    await page.click("nav >> text=Contact");
    await expect(
      page.locator(".notification, .toast, .alert", { hasText: "contact" })
    ).toBeVisible({ timeout: 10000 });
  });

  test("Accès protégé", async ({ page }) => {
    await page.goto(`${BASE_URL}/admin/orders-airtable`);
    // Doit rediriger vers login si non connecté
    await expect(page).toHaveURL(ADMIN_URL);
    await expect(page.locator('input[type="email"]')).toBeVisible();
  });
});
