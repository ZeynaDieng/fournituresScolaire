// Script d'import des produits de démo dans Airtable
// Place ce fichier dans /scripts/importProductsToAirtable.js
// Lance-le avec: node scripts/importProductsToAirtable.js
require("dotenv").config();
const axios = require("axios");
const fs = require("fs");
const path = require("path");

// === CONFIGURATION ===
const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY; // <-- À remplacer
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID; // <-- À remplacer
const AIRTABLE_TABLE_NAME = process.env.AIRTABLE_PRODUCTS_TABLE; // <-- À adapter si besoin

// Les lignes ci-dessous sont à supprimer :
// AIRTABLE_API_KEY = ...
// AIRTABLE_BASE_ID = ...
// AIRTABLE_PRODUCTS_TABLE = ...
// ...etc...
// Les valeurs doivent être dans le fichier .env uniquement !

// === CHARGEMENT DES PRODUITS ===
// On charge le tableau de produits depuis le store (copie statique, à mettre à jour si besoin)
const products = [
  // Cahiers
  {
    id: "cahier-32p",
    name: "Cahier 32 pages",
    price: 300,
    image:
      "https://i.pinimg.com/1200x/a9/ee/92/a9ee9212b025b90fd7d2a14529c7c6c5.jpg",
    originalPrice: 400,
    isPromotion: false,
    inStock: true,
    category: "Cahiers",
    description: "Petit cahier de 32 pages",
    images: [
      "https://i.pinimg.com/736x/13/0a/97/130a97c6155ea06d2080a9fd0f75e9d6.jpg",
      "https://i.pinimg.com/736x/c5/fd/a0/c5fda0023a4a3e7fa7c68c5c27c00182.jpg",
    ],
    features: [
      { label: "Pages", value: "32 pages" },
      { label: "Format", value: "A5" },
      { label: "Reliure", value: "Agrafée" },
      { label: "Couleur", value: "Blanc" },
    ],
    specs: [
      { label: "Poids", value: "100g" },
      { label: "Dimensions", value: "14.8 x 21 cm" },
      { label: "Matériau", value: "Papier standard" },
      { label: "Couverture", value: "Souple" },
    ],
    reviews: [
      {
        id: 1,
        user: "Alice",
        rating: 4,
        comment: "Bonne qualité.",
        date: "1 août 2025",
      },
    ],
    bulkOptions: [
      { quantity: 5, unitPrice: 280, discount: 5 },
      { quantity: 10, unitPrice: 270, discount: 10 },
    ],
  },
  {
    id: "cahier-48p",
    name: "Cahier 48 pages",
    price: 350,
    image:
      "https://i.pinimg.com/1200x/e1/8e/e6/e18ee65268ca73af5a35f4f2ade2c27d.jpg",
    originalPrice: null,
    isPromotion: false,
    inStock: true,
    category: "Cahiers",
    description: "Cahier de 48 pages, format standard",
    images: [
      "https://i.pinimg.com/1200x/e1/8e/e6/e18ee65268ca73af5a35f4f2ade2c27d.jpg",
      "https://i.pinimg.com/736x/6a/50/2d/6a502d7a2f0932ce229a52941eba7050.jpg",
    ],
    features: [
      { label: "Pages", value: "48 pages" },
      { label: "Format", value: "A5" },
      { label: "Reliure", value: "Agrafée" },
      { label: "Couleur", value: "Blanc" },
    ],
    specs: [
      { label: "Poids", value: "150g" },
      { label: "Dimensions", value: "14.8 x 21 cm" },
      { label: "Matériau", value: "Papier standard" },
      { label: "Couverture", value: "Souple" },
    ],
    reviews: [
      {
        id: 1,
        user: "Bob",
        rating: 5,
        comment: "Très pratique pour les cours.",
        date: "3 août 2025",
      },
    ],
    bulkOptions: [
      { quantity: 5, unitPrice: 330, discount: 5 },
      { quantity: 10, unitPrice: 320, discount: 10 },
    ],
  },
  {
    id: "cahier-64p",
    name: "Cahier 64 pages",
    price: 400,
    image:
      "https://i.pinimg.com/1200x/e1/8e/e6/e18ee65268ca73af5a35f4f2ade2c27d.jpg",
    originalPrice: null,
    isPromotion: false,
    inStock: true,
    category: "Cahiers",
    description: "Cahier de 64 pages",
    images: [
      "https://i.pinimg.com/1200x/e1/8e/e6/e18ee65268ca73af5a35f4f2ade2c27d.jpg",
      "https://i.pinimg.com/1200x/4e/99/18/4e991885818a6f5d75c158915c667798.jpg",
    ],
    features: [
      { label: "Pages", value: "64 pages" },
      { label: "Format", value: "A5" },
      { label: "Reliure", value: "Agrafée" },
      { label: "Couleur", value: "Blanc" },
    ],
    specs: [
      { label: "Poids", value: "200g" },
      { label: "Dimensions", value: "14.8 x 21 cm" },
      { label: "Matériau", value: "Papier standard" },
      { label: "Couverture", value: "Souple" },
    ],
    reviews: [
      {
        id: 1,
        user: "Charlie",
        rating: 4,
        comment: "Pratique et solide.",
        date: "4 août 2025",
      },
    ],
    bulkOptions: [
      { quantity: 5, unitPrice: 380, discount: 5 },
      { quantity: 10, unitPrice: 370, discount: 10 },
    ],
  },
  {
    id: "cahier-96p",
    name: "Cahier 96 pages",
    price: 500,
    image:
      "https://i.pinimg.com/1200x/4e/99/18/4e991885818a6f5d75c158915c667798.jpg",
    originalPrice: 600,
    isPromotion: true,
    promotionEndDate: new Date("2024-11-30"),
    inStock: true,
    category: "Cahiers",
    description: "Cahier grand format 96 pages, seyes",
    images: [
      "https://i.pinimg.com/1200x/4e/99/18/4e991885818a6f5d75c158915c667798.jpg",
      "https://i.pinimg.com/1200x/e1/8e/e6/e18ee65268ca73af5a35f4f2ade2c27d.jpg",
    ],
    features: [
      { label: "Pages", value: "96 pages" },
      { label: "Format", value: "A4" },
      { label: "Reliure", value: "Spirale" },
      { label: "Couleur", value: "Blanc" },
    ],
    specs: [
      { label: "Poids", value: "400g" },
      { label: "Dimensions", value: "21 x 29.7 cm" },
      { label: "Matériau", value: "Papier standard" },
      { label: "Couverture", value: "Cartonnée" },
    ],
    reviews: [
      {
        id: 1,
        user: "David",
        rating: 5,
        comment: "Parfait pour la rentrée.",
        date: "5 août 2025",
      },
    ],
    bulkOptions: [
      { quantity: 5, unitPrice: 480, discount: 5 },
      { quantity: 10, unitPrice: 460, discount: 10 },
    ],
  },
  {
    id: "cahier-120p",
    name: "Cahier 200 pages",
    price: 600,
    image:
      "https://i.pinimg.com/736x/fd/f9/0b/fdf90bf685ccedf53d0297c5133f3678.jpg",
    originalPrice: null,
    isPromotion: false,
    inStock: true,
    category: "Cahiers",
    description: "Cahier grand format 200 pages",
    images: [
      "https://i.pinimg.com/736x/e5/44/ce/e544ce7cb84568b5b424144f80353325.jpg",
      "https://i.pinimg.com/736x/fd/f9/0b/fdf90bf685ccedf53d0297c5133f3678.jpg",
    ],
    features: [
      { label: "Pages", value: "200 pages" },
      { label: "Format", value: "A4" },
      { label: "Reliure", value: "Spirale" },
      { label: "Couleur", value: "Blanc" },
    ],
    specs: [
      { label: "Poids", value: "500g" },
      { label: "Dimensions", value: "21 x 29.7 cm" },
      { label: "Matériau", value: "Papier standard" },
      { label: "Couverture", value: "Cartonnée" },
    ],
    reviews: [
      {
        id: 1,
        user: "Emma",
        rating: 5,
        comment: "Très bon cahier.",
        date: "6 août 2025",
      },
    ],
    bulkOptions: [
      { quantity: 5, unitPrice: 580, discount: 5 },
      { quantity: 10, unitPrice: 560, discount: 10 },
    ],
  },

  // Stylos
  {
    id: "stylo-bille-bleu",
    name: "Stylo Bille Bleu",
    price: 100,
    image:
      "https://i.pinimg.com/736x/f3/c3/96/f3c396b6166cb46d61cafa6656cce35c.jpg",
    inStock: true,
    originalPrice: null,
    isPromotion: false,
    category: "Stylos",
    description: "Stylo bille encre bleue, pointe fine",
    images: [
      "https://i.pinimg.com/1200x/4c/7a/91/4c7a917a5e91cb46adf213cf3de30734.jpg",
      "https://i.pinimg.com/736x/bb/d8/a2/bbd8a25b8d8337928749a63520a30e7c.jpg",
    ],
    features: [
      { label: "Type", value: "Bille" },
      { label: "Couleur encre", value: "Bleu" },
      { label: "Pointe", value: "Fine" },
    ],
    specs: [
      { label: "Poids", value: "20g" },
      { label: "Dimensions", value: "14 cm" },
      { label: "Matériau", value: "Plastique" },
    ],
    reviews: [
      {
        id: 1,
        user: "Eve",
        rating: 4,
        comment: "Bonne écriture.",
        date: "2 août 2025",
      },
    ],
    bulkOptions: [
      { quantity: 5, unitPrice: 190, discount: 5 },
      { quantity: 10, unitPrice: 180, discount: 10 },
    ],
  },
  // Stylos (suite)
  {
    id: "stylo-bille-noir",
    name: "Stylo Bille Noir",
    price: 100,
    image:
      "https://i.pinimg.com/1200x/4c/7a/91/4c7a917a5e91cb46adf213cf3de30734.jpg",
    originalPrice: null,
    isPromotion: false,
    inStock: true,
    category: "Stylos",
    description: "Stylo bille encre noire, pointe fine",
    images: [
      "https://i.pinimg.com/736x/bb/d8/a2/bbd8a25b8d8337928749a63520a30e7c.jpg",
      "https://i.pinimg.com/1200x/4c/7a/91/4c7a917a5e91cb46adf213cf3de30734.jpg",
    ],
    features: [
      { label: "Type", value: "Bille" },
      { label: "Couleur encre", value: "Noir" },
      { label: "Pointe", value: "Fine" },
    ],
    specs: [
      { label: "Poids", value: "20g" },
      { label: "Dimensions", value: "14 cm" },
      { label: "Matériau", value: "Plastique" },
    ],
    reviews: [
      {
        id: 1,
        user: "Franck",
        rating: 5,
        comment: "Excellent stylo.",
        date: "5 août 2025",
      },
    ],
    bulkOptions: [
      { quantity: 5, unitPrice: 190, discount: 5 },
      { quantity: 10, unitPrice: 180, discount: 10 },
    ],
  },
  {
    id: "stylo-bille-rouge",
    name: "Stylo Bille Rouge",
    price: 100,
    image:
      "https://i.pinimg.com/736x/6d/6c/05/6d6c0582d435971d58a47859c3a96f69.jpg",
    originalPrice: null,
    isPromotion: false,
    inStock: true,
    category: "Stylos",
    description: "Stylo bille encre rouge, pointe fine",
    images: [
      "https://i.pinimg.com/736x/6d/6c/05/6d6c0582d435971d58a47859c3a96f69.jpg",
      "https://i.pinimg.com/1200x/38/4d/b4/384db45c3749c146649aa3c0cf257625.jpg",
    ],
    features: [
      { label: "Type", value: "Bille" },
      { label: "Couleur encre", value: "Rouge" },
      { label: "Pointe", value: "Fine" },
    ],
    specs: [
      { label: "Poids", value: "20g" },
      { label: "Dimensions", value: "14 cm" },
      { label: "Matériau", value: "Plastique" },
    ],
    reviews: [
      {
        id: 1,
        user: "Gisèle",
        rating: 4,
        comment: "Bonne qualité.",
        date: "6 août 2025",
      },
    ],
    bulkOptions: [
      { quantity: 5, unitPrice: 190, discount: 5 },
      { quantity: 10, unitPrice: 180, discount: 10 },
    ],
  },
  {
    id: "stylo-plume",
    name: "Stylo Plume",
    price: 1200,
    image:
      "https://i.pinimg.com/1200x/c8/09/0d/c8090d67a9b7cea8c1e1157f2ef4f40c.jpg",
    originalPrice: null,
    isPromotion: false,
    inStock: true,
    category: "Stylos",
    description: "Stylo plume avec recharge d'encre",
    images: [
      "https://i.pinimg.com/1200x/c8/09/0d/c8090d67a9b7cea8c1e1157f2ef4f40c.jpg",
      "https://i.pinimg.com/1200x/63/ab/a6/63aba6b4baae61d3f6af75fc5c86e54b.jpg",
    ],
    features: [
      { label: "Type", value: "Plume" },
      { label: "Couleur encre", value: "Noir" },
      { label: "Recharge", value: "Oui" },
    ],
    specs: [
      { label: "Poids", value: "30g" },
      { label: "Dimensions", value: "15 cm" },
      { label: "Matériau", value: "Métal et plastique" },
    ],
    reviews: [
      {
        id: 1,
        user: "Hugo",
        rating: 5,
        comment: "Écriture fluide et agréable.",
        date: "7 août 2025",
      },
    ],
    bulkOptions: [
      { quantity: 5, unitPrice: 1150, discount: 5 },
      { quantity: 10, unitPrice: 1100, discount: 10 },
    ],
  },

  // Crayons
  {
    id: "crayon-hb",
    name: "Crayon HB",
    price: 100,
    image:
      "https://i.pinimg.com/1200x/33/7e/3b/337e3b1b9a8b9e5b4a9e1a0b8c5a2a1d.jpg",
    originalPrice: null,
    isPromotion: false,
    inStock: true,
    category: "Crayons",
    description: "Crayon à papier HB",
    images: [
      "https://placehold.co/600x400/FCF3CF/17202A?text=Crayon+HB",
      "https://placehold.co/600x400/FCF3CF/17202A?text=Crayon+HB-1",
    ],
    features: [
      { label: "Type", value: "HB" },
      { label: "Pour", value: "Écriture" },
    ],
    specs: [
      { label: "Poids", value: "10g" },
      { label: "Dimensions", value: "17 cm" },
      { label: "Matériau", value: "Bois" },
    ],
    reviews: [
      {
        id: 1,
        user: "Isabelle",
        rating: 5,
        comment: "Très bon crayon.",
        date: "8 août 2025",
      },
    ],
    bulkOptions: [
      { quantity: 10, unitPrice: 90, discount: 10 },
      { quantity: 20, unitPrice: 80, discount: 20 },
    ],
  },
  {
    id: "crayon-2b",
    name: "Crayon 2B",
    price: 120,
    image:
      "https://i.pinimg.com/1200x/22/9d/4d/229d4d4b8e8e5b5a5e5b5a5e5b5a5e5b.jpg",
    originalPrice: null,
    isPromotion: false,
    inStock: true,
    category: "Crayons",
    description: "Crayon à papier 2B pour dessin",
    images: [
      "https://placehold.co/600x400/FCF3CF/17202A?text=Crayon+2B",
      "https://placehold.co/600x400/FCF3CF/17202A?text=Crayon+2B-1",
    ],
    features: [
      { label: "Type", value: "2B" },
      { label: "Pour", value: "Dessin" },
    ],
    specs: [
      { label: "Poids", value: "12g" },
      { label: "Dimensions", value: "17 cm" },
      { label: "Matériau", value: "Bois" },
    ],
    reviews: [
      {
        id: 1,
        user: "Julien",
        rating: 4,
        comment: "Idéal pour croquis.",
        date: "9 août 2025",
      },
    ],
    bulkOptions: [
      { quantity: 10, unitPrice: 110, discount: 8 },
      { quantity: 20, unitPrice: 100, discount: 15 },
    ],
  },

  // Crayons de couleur
  {
    id: "crayon-de-couleur-12",
    name: "Crayons de couleur 12",
    price: 600,
    image:
      "https://i.pinimg.com/1200x/11/7e/3b/117e3b1b9a8b9e5b4a9e1a0b8c5a2a1d.jpg",
    originalPrice: null,
    isPromotion: false,
    inStock: true,
    category: "Crayons",
    description: "Boîte de 12 crayons de couleur",
    images: [
      "https://placehold.co/600x400/FCF3CF/17202A?text=Crayon+12",
      "https://placehold.co/600x400/FCF3CF/17202A?text=Crayon+12-1",
    ],
    features: [
      { label: "Nombre", value: "12" },
      { label: "Couleurs", value: "Assorties" },
    ],
    specs: [
      { label: "Poids", value: "200g" },
      { label: "Dimensions", value: "Boîte 20x10x2 cm" },
      { label: "Matériau", value: "Bois et pigments" },
    ],
    reviews: [
      {
        id: 1,
        user: "Karim",
        rating: 5,
        comment: "Couleurs vives et durables.",
        date: "10 août 2025",
      },
    ],
    bulkOptions: [
      { quantity: 5, unitPrice: 580, discount: 3 },
      { quantity: 10, unitPrice: 550, discount: 8 },
    ],
  },
  {
    id: "crayon-de-couleur-24",
    name: "Crayons de couleur 24",
    price: 1200,
    image:
      "https://i.pinimg.com/1200x/00/9d/4d/009d4d4b8e8e5b5a5e5b5a5e5b5a5e5b.jpg",
    originalPrice: null,
    isPromotion: false,
    inStock: true,
    category: "Crayons",
    description: "Boîte de 24 crayons de couleur",
    images: [
      "https://placehold.co/600x400/FCF3CF/17202A?text=Crayon+24",
      "https://placehold.co/600x400/FCF3CF/17202A?text=Crayon+24-1",
    ],
    features: [
      { label: "Nombre", value: "24" },
      { label: "Couleurs", value: "Assorties" },
    ],
    specs: [
      { label: "Poids", value: "400g" },
      { label: "Dimensions", value: "Boîte 30x15x2 cm" },
      { label: "Matériau", value: "Bois et pigments" },
    ],
    reviews: [
      {
        id: 1,
        user: "Laura",
        rating: 5,
        comment: "Top pour les dessins.",
        date: "11 août 2025",
      },
    ],
    bulkOptions: [
      { quantity: 5, unitPrice: 1150, discount: 4 },
      { quantity: 10, unitPrice: 1100, discount: 8 },
    ],
  },

  // Feutres et Surligneurs
  {
    id: "feutres-fins-12",
    name: "Feutres fins 12",
    price: 800,
    image:
      "https://i.pinimg.com/1200x/99/7e/3b/997e3b1b9a8b9e5b4a9e1a0b8c5a2a1d.jpg",
    originalPrice: null,
    isPromotion: false,
    inStock: true,
    category: "Feutres et Surligneurs",
    description: "Boîte de 12 feutres fins",
    images: [
      "https://placehold.co/600x400/D6EAF8/17202A?text=Feutres+12",
      "https://placehold.co/600x400/D6EAF8/17202A?text=Feutres+12-1",
    ],
    features: [
      { label: "Nombre", value: "12" },
      { label: "Type", value: "Feutre fin" },
    ],
    specs: [
      { label: "Poids", value: "250g" },
      { label: "Dimensions", value: "Boîte 20x10x3 cm" },
      { label: "Matériau", value: "Plastique" },
    ],
    reviews: [
      {
        id: 1,
        user: "Sophie",
        rating: 5,
        comment: "Très précis et durable.",
        date: "12 août 2025",
      },
    ],
    bulkOptions: [
      { quantity: 5, unitPrice: 780, discount: 2 },
      { quantity: 10, unitPrice: 750, discount: 6 },
    ],
  },
  {
    id: "surligneur-jaune",
    name: "Surligneur Jaune",
    price: 150,
    image:
      "https://i.pinimg.com/1200x/88/9d/4d/889d4d4b8e8e5b5a5e5b5a5e5b5a5e5b.jpg",
    originalPrice: null,
    isPromotion: false,
    inStock: true,
    category: "Feutres et Surligneurs",
    description: "Surligneur jaune fluo",
    images: [
      "https://placehold.co/600x400/D6EAF8/17202A?text=Surligneur+Jaune",
      "https://placehold.co/600x400/D6EAF8/17202A?text=Surligneur+Jaune-1",
    ],
    features: [
      { label: "Couleur", value: "Jaune" },
      { label: "Type", value: "Fluo" },
    ],
    specs: [
      { label: "Poids", value: "15g" },
      { label: "Dimensions", value: "14 cm" },
      { label: "Matériau", value: "Plastique" },
    ],
    reviews: [
      {
        id: 1,
        user: "Nadia",
        rating: 4,
        comment: "Bien visible.",
        date: "13 août 2025",
      },
    ],
    bulkOptions: [
      { quantity: 5, unitPrice: 140, discount: 5 },
      { quantity: 10, unitPrice: 130, discount: 10 },
    ],
  },
  {
    id: "surligneur-rose",
    name: "Surligneur Rose",
    price: 150,
    image:
      "https://i.pinimg.com/1200x/77/7e/3b/777e3b1b9a8b9e5b4a9e1a0b8c5a2a1d.jpg",
    originalPrice: null,
    isPromotion: false,
    inStock: true,
    category: "Feutres et Surligneurs",
    description: "Surligneur rose fluo",
    images: [
      "https://placehold.co/600x400/D6EAF8/17202A?text=Surligneur+Rose",
      "https://placehold.co/600x400/D6EAF8/17202A?text=Surligneur+Rose-1",
    ],
    features: [
      { label: "Couleur", value: "Rose" },
      { label: "Type", value: "Fluo" },
    ],
    specs: [
      { label: "Poids", value: "15g" },
      { label: "Dimensions", value: "14 cm" },
      { label: "Matériau", value: "Plastique" },
    ],
    reviews: [
      {
        id: 1,
        user: "Lina",
        rating: 4,
        comment: "Très pratique.",
        date: "14 août 2025",
      },
    ],
    bulkOptions: [
      { quantity: 5, unitPrice: 140, discount: 5 },
      { quantity: 10, unitPrice: 130, discount: 10 },
    ],
  },

  // Sacs
  {
    id: "sac-a-dos-enfant",
    name: "Sac à dos enfant",
    price: 8000,
    image:
      "https://i.pinimg.com/1200x/66/9d/4d/669d4d4b8e8e5b5a5e5b5a5e5b5a5e5b.jpg",
    originalPrice: 10000,
    isPromotion: true,
    inStock: true,
    promotionEndDate: new Date("2024-12-20"),
    category: "Sacs",
    description: "Sac à dos coloré et résistant pour enfants",
    images: [
      "https://placehold.co/600x400/EBF5FB/17202A?text=Sac+a+dos",
      "https://placehold.co/600x400/EBF5FB/17202A?text=Sac+a+dos-1",
    ],
    features: [
      { label: "Capacité", value: "15L" },
      { label: "Couleur", value: "Multicolore" },
    ],
    specs: [
      { label: "Poids", value: "500g" },
      { label: "Dimensions", value: "30x20x10 cm" },
      { label: "Matériau", value: "Polyester" },
    ],
    reviews: [
      {
        id: 1,
        user: "Paul",
        rating: 5,
        comment: "Sac solide et pratique.",
        date: "15 août 2025",
      },
    ],
    bulkOptions: [
      { quantity: 2, unitPrice: 7500, discount: 6 },
      { quantity: 5, unitPrice: 7000, discount: 12 },
    ],
  },
  {
    id: "trousse-simple",
    name: "Trousse simple",
    price: 500,
    image:
      "https://i.pinimg.com/1200x/55/7e/3b/557e3b1b9a8b9e5b4a9e1a0b8c5a2a1d.jpg",
    originalPrice: null,
    isPromotion: false,
    inStock: true,
    category: "Sacs",
    description: "Trousse simple pour stylos et crayons",
    images: [
      "https://placehold.co/600x400/EBF5FB/17202A?text=Trousse",
      "https://placehold.co/600x400/EBF5FB/17202A?text=Trousse-1",
    ],
    features: [
      { label: "Type", value: "Trousse" },
      { label: "Couleur", value: "Bleu" },
    ],
    specs: [
      { label: "Poids", value: "100g" },
      { label: "Dimensions", value: "20x7x5 cm" },
      { label: "Matériau", value: "Polyester" },
    ],
    reviews: [
      {
        id: 1,
        user: "Emma",
        rating: 4,
        comment: "Simple et pratique.",
        date: "16 août 2025",
      },
    ],
    bulkOptions: [
      { quantity: 5, unitPrice: 480, discount: 4 },
      { quantity: 10, unitPrice: 450, discount: 10 },
    ],
  },

  // Calculatrices
  {
    id: "calculatrice-basique",
    name: "Calculatrice basique",
    price: 1500,
    image:
      "https://i.pinimg.com/1200x/44/9d/4d/449d4d4b8e8e5b5a5e5b5a5e5b5a5e5b.jpg",
    originalPrice: null,
    isPromotion: false,
    inStock: true,
    category: "Calculatrices",
    description: "Calculatrice simple pour opérations basiques",
    images: [
      "https://placehold.co/600x400/EAECEE/17202A?text=Calculatrice+Basique",
      "https://placehold.co/600x400/EAECEE/17202A?text=Calculatrice+Basique-1",
    ],
    features: [
      { label: "Type", value: "Basique" },
      { label: "Alimentation", value: "Piles" },
    ],
    specs: [
      { label: "Poids", value: "150g" },
      { label: "Dimensions", value: "12x8x2 cm" },
      { label: "Matériau", value: "Plastique" },
    ],
    reviews: [
      {
        id: 1,
        user: "Marc",
        rating: 5,
        comment: "Fait le job.",
        date: "17 août 2025",
      },
    ],
    bulkOptions: [
      { quantity: 5, unitPrice: 1400, discount: 6 },
      { quantity: 10, unitPrice: 1300, discount: 13 },
    ],
  },
  {
    id: "calculatrice-scientifique",
    name: "Calculatrice Scientifique",
    price: 12000,
    image:
      "https://i.pinimg.com/1200x/33/7e/3b/337e3b1b9a8b9e5b4a9e1a0b8c5a2a1d.jpg",
    originalPrice: null,
    isPromotion: false,
    inStock: true,
    category: "Calculatrices",
    description: "Calculatrice scientifique programmable",
    images: [
      "https://placehold.co/600x400/EAECEE/17202A?text=Calculatrice",
      "https://placehold.co/600x400/EAECEE/17202A?text=Calculatrice-1",
    ],
    features: [
      { label: "Type", value: "Scientifique" },
      { label: "Fonctions", value: "Programmable" },
    ],
    specs: [
      { label: "Poids", value: "250g" },
      { label: "Dimensions", value: "15x10x2.5 cm" },
      { label: "Matériau", value: "Plastique et métal" },
    ],
    reviews: [
      {
        id: 1,
        user: "Claire",
        rating: 5,
        comment: "Très complète.",
        date: "18 août 2025",
      },
    ],
    bulkOptions: [
      { quantity: 5, unitPrice: 11500, discount: 4 },
      { quantity: 10, unitPrice: 11000, discount: 8 },
    ],
  },

  // Ardoises
  {
    id: "ardoise-moderne",
    name: "Ardoise moderne",
    price: 1500,
    image:
      "https://i.pinimg.com/1200x/22/9d/4d/229d4d4b8e8e5b5a5e5b5a5e5b5a5e5b.jpg",
    originalPrice: null,
    isPromotion: false,
    inStock: true,
    category: "Ardoises",
    description: "Ardoise double face avec feutre inclus",
    images: [
      "https://placehold.co/600x400/E8F8F5/17202A?text=Ardoise",
      "https://placehold.co/600x400/E8F8F5/17202A?text=Ardoise-1",
    ],
    features: [
      { label: "Type", value: "Double face" },
      { label: "Accessoires", value: "Feutre inclus" },
    ],
    specs: [
      { label: "Poids", value: "400g" },
      { label: "Dimensions", value: "25x20 cm" },
      { label: "Matériau", value: "Plastique et ardoise" },
    ],
    reviews: [
      {
        id: 1,
        user: "Kevin",
        rating: 5,
        comment: "Très pratique pour l’école.",
        date: "19 août 2025",
      },
    ],
    bulkOptions: [
      { quantity: 5, unitPrice: 1450, discount: 3 },
      { quantity: 10, unitPrice: 1400, discount: 7 },
    ],
  },

  // … et ainsi de suite pour tous les autres stylos, crayons, feutres, sacs, calculatrices, ardoises
];

// === IMPORT DANS AIRTABLE ===
async function importProducts() {
  if (!AIRTABLE_API_KEY || !AIRTABLE_BASE_ID || !AIRTABLE_TABLE_NAME) {
    console.error(
      "Veuillez définir les variables d'environnement AIRTABLE_API_KEY, AIRTABLE_BASE_ID et AIRTABLE_PRODUCTS_TABLE."
    );
    process.exit(1);
  }

  const url = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${encodeURIComponent(
    AIRTABLE_TABLE_NAME
  )}`;
  const headers = {
    Authorization: `Bearer ${AIRTABLE_API_KEY}`,
    "Content-Type": "application/json",
  };

  for (const product of products) {
    // Adapter ici le mapping selon la structure de ta table Airtable
    const fields = {
      // id: product.id, // <-- Ne pas envoyer le champ id !
      name: product.name,
      price: product.price,
      image: product.image,
      originalPrice: product.originalPrice,
      isPromotion: product.isPromotion,
      inStock: product.inStock,
      category: product.category,
      description: product.description,
      images: product.images ? product.images.join(", ") : undefined,
      features: product.features ? JSON.stringify(product.features) : undefined,
      specs: product.specs ? JSON.stringify(product.specs) : undefined,
      reviews: product.reviews ? JSON.stringify(product.reviews) : undefined,
      bulkOptions: product.bulkOptions
        ? JSON.stringify(product.bulkOptions)
        : undefined,
      promotionEndDate: product.promotionEndDate
        ? product.promotionEndDate instanceof Date
          ? product.promotionEndDate.toISOString()
          : product.promotionEndDate
        : undefined,
    };
    // Supprimer les champs undefined
    Object.keys(fields).forEach(
      (key) => fields[key] === undefined && delete fields[key]
    );

    try {
      const res = await axios.post(url, { fields }, { headers });
      console.log(`✅ Produit importé: ${product.name}`);
    } catch (err) {
      console.error(`❌ Erreur import produit: ${product.name}`);
      if (err.response) {
        console.error(err.response.data);
      } else {
        console.error(err.message);
      }
    }
  }
}

importProducts();
