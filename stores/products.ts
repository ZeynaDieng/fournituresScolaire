// stores/products.ts
import { defineStore } from 'pinia'
interface Feature {
  label: string;
  value: string;
}

interface Review {
  id: number;
  user: string;
  rating: number;
  comment: string;
  date: string;
}

export interface Product {
  id: string
  name: string
  price: number
  specs?: { label: string; value: string }[]; 
  originalPrice?: number | null
  features?: Feature[]
  images: string | string[]; // <- accepte une image ou plusieurs
  category: string
  image: string
  description: string
  inStock: boolean
  isPromotion?: boolean
  promotionEndDate?: Date
  reviews?: Review[]
  bulkOptions?: Array<{
    quantity: number;
    unitPrice: number;
    discount: number;
  }>
}

export interface Pack {
  id: string
  name: string
  level: string // CP, CE1-CE2, Collège, Lycée
  price: number
  originalPrice?: number
  image: string
  description: string
  contents: string[]
  isPopular?: boolean
  inStock: boolean
  isPromotion?: boolean
  promotionEndDate?: Date
}

export interface Promotion {
  id: string
  title: string
  description: string
  discount: number
  endDate: Date
  products: string[]
  type: 'percentage' | 'fixed' | 'bogo' // buy one get one
}

export const useProductsStore = defineStore('products', {
  state: () => ({
    products: [] as Product[],
    packs: [] as Pack[],
    promotions: [] as Promotion[],
    loading: false,
    categories: [
      'Cahiers',
      'Stylos',
      'Sacs',
      'Ardoises',
      'Calculatrices',
      'Règles',
      'Crayons',
      'Gommes',
      'Classeurs'
    ]
  }),

  getters: {
    // Produits par catégorie
    getProductsByCategory(state) {
      return (category: string): Product[] =>
        state.products.filter((product: Product) => product.category === category)
    },

    // Packs par niveau
    getPacksByLevel(state) {
      return (level: string): Pack[] =>
        state.packs.filter((pack: Pack) => pack.level === level)
    },

    // Packs populaires
    popularPacks(state): Pack[] {
      return state.packs.filter((pack: Pack) => pack.isPopular).slice(0, 4)
    },

    // Produits en promotion
    promotionalProducts(state): Product[] {
      const now = new Date();
      return state.products.filter(p => p.isPromotion && (!p.promotionEndDate || new Date(p.promotionEndDate) > now));
    },
    
    // Packs en promotion
    promotionalPacks(state): Pack[] {
      return state.packs.filter((pack: Pack) => pack.isPromotion)
    },

    // Promotions actives
    activePromotions(state): Promotion[] {
      const now = new Date()
      return state.promotions.filter((promo: Promotion) => new Date(promo.endDate) > now)
    },

    // Recherche de produits
    searchProducts(state) {
      return (query: string): (Product | Pack)[] => {
        const searchTerm = query.toLowerCase()
        const matchingProducts = state.products.filter((product: Product) =>
          product.name.toLowerCase().includes(searchTerm) ||
          product.category.toLowerCase().includes(searchTerm)
        )
        const matchingPacks = state.packs.filter((pack: Pack) =>
          pack.name.toLowerCase().includes(searchTerm) ||
          pack.level.toLowerCase().includes(searchTerm)
        )
        return [...matchingProducts, ...matchingPacks]
      }
    },

    // Obtenir un produit par ID
    getProductById(state) {
      return (id: string): Product | undefined => {
        return state.products.find((product: Product) => product.id === id)
      }
    },

    // Obtenir un pack par ID
    getPackById(state) {
      return (id: string): Pack | undefined => {
        return state.packs.find((pack: Pack) => pack.id === id)
      }
    },
  },

  actions: {
    // Initialiser les données de démo
    initializeDemoData() {
      this.packs = [
        {
          id: 'pack-cp',
          name: 'Pack Essentiel CP',
          level: 'CP',
          price: 16500,
          originalPrice: 19000,
          image: 'https://i.pinimg.com/736x/06/af/19/06af192e5165b1694ed1d901ccbe991e.jpg',
          description: 'Le nécessaire pour bien démarrer le Cours Préparatoire (CI/CP).',
          contents: [
            '5 Cahiers 96 pages (17x22cm)',
            '2 Cahiers de dessin 48 pages',
            '1 Ardoise Velleda + 2 feutres + 1 chiffon',
            '1 Trousse garnie (2 stylos bleus, 1 stylo vert, 1 crayon noir, 1 gomme, 1 taille-crayon)',
            '1 Boîte de 12 crayons de couleur',
            '1 Règle plate 20cm',
            '5 Protège-cahiers (couleurs assorties)',
            '1 Paquet de 100 étiquettes'
          ],
          isPopular: true,
          inStock: true,
          isPromotion: true,
          promotionEndDate: new Date('2024-12-31')
        },
        {
          id: 'pack-ce',
          name: 'Pack Avancé CE1-CE2',
          level: 'CE1-CE2',
          price: 21000,
          originalPrice: 25000,
          image: 'https://i.pinimg.com/736x/4c/27/58/4c275881308b4ae3956c80856018a375.jpg',
          description: 'Un pack complet pour les élèves du Cours Élémentaire.',
          contents: [
            '8 Cahiers 96 pages (17x22cm)',
            '4 Cahiers 192 pages (21x29.7cm)',
            '1 Cahier de poésie/chant',
            '1 Trousse (2 stylos bleus, 1 vert, 1 rouge, 1 noir, 1 crayon, 1 gomme, 1 taille-crayon)',
            '1 Boîte de 12 feutres de couleur',
            '1 Kit de traçage (règle 30cm, équerre, rapporteur)',
            '1 Compas',
            '1 Agenda scolaire ou cahier de texte',
            '8 Protège-cahiers (formats assortis)'
          ],
          isPopular: true,
          inStock: true
        },
        {
          id: 'pack-college',
          name: 'Pack Collège 6ème-3ème',
          level: 'Collège',
          price: 28000,
          originalPrice: 33000,
          image: 'https://i.pinimg.com/736x/10/54/a3/1054a36c0ce9460b0a1e2aafa65c9a20.jpg',
          description: 'L\'équipement idéal pour réussir ses années de collège.',
          contents: [
            '5 Cahiers 200 pages grand format (24x32cm)',
            '3 Classeurs A4 souples',
            '1 Paquet de 200 copies doubles A4',
            '1 Paquet de 100 copies simples A4',
            '1 Trousse complète (stylos, surligneurs, correcteur)',
            '1 Calculatrice scientifique type collège',
            '1 Kit de géométrie complet et résistant',
            '1 Agenda scolaire',
            '1 Trieur 8 compartiments'
          ],
          isPopular: true,
          inStock: true,
          isPromotion: true,
          promotionEndDate: new Date('2024-12-15')
        },
        {
          id: 'pack-lycee',
          name: 'Pack Lycée Seconde-Terminale',
          level: 'Lycée',
          price: 38500,
          originalPrice: 45000,
          image: 'https://placehold.co/600x400/F4ECF7/17202A?text=Pack+Lycee',
          description: 'Un pack robuste et complet pour affronter les défis du lycée.',
          contents: [
            '4 Classeurs A4 rigides grand format',
            '1 Paquet de 400 copies doubles A4 perforées',
            '1 Paquet de 200 copies simples A4 perforées',
            '1 Trieur 12 compartiments',
            '1 Lot de 4 surligneurs de couleurs différentes',
            '1 Calculatrice scientifique graphique (avec mode examen)',
            '1 Agenda grand format',
            '1 Ramette de papier 500 feuilles',
            'Stylos et porte-mine de qualité supérieure'
          ],
          isPopular: false,
          inStock: true
        }
      ]

      this.products = [
        // Cahiers
        {
          id: 'cahier-32p',
          name: 'Cahier 32 pages',
          price: 300,
          image: 'https://i.pinimg.com/1200x/a9/ee/92/a9ee9212b025b90fd7d2a14529c7c6c5.jpg',
          originalPrice: 400,
          isPromotion: false,
          inStock: true,
          category: 'Cahiers',
          description: 'Petit cahier de 32 pages',
          images: [
            'https://i.pinimg.com/736x/13/0a/97/130a97c6155ea06d2080a9fd0f75e9d6.jpg',
            'https://i.pinimg.com/736x/c5/fd/a0/c5fda0023a4a3e7fa7c68c5c27c00182.jpg'
          ],
          features: [
            { label: 'Pages', value: '32 pages' },
            { label: 'Format', value: 'A5' },
            { label: 'Reliure', value: 'Agrafée' },
            { label: 'Couleur', value: 'Blanc' }
          ],
          specs: [
            { label: 'Poids', value: '100g' },
            { label: 'Dimensions', value: '14.8 x 21 cm' },
            { label: 'Matériau', value: 'Papier standard' },
            { label: 'Couverture', value: 'Souple' }
          ],
          reviews: [
            { id: 1, user: 'Alice', rating: 4, comment: 'Bonne qualité.', date: '1 août 2025' }
          ],
          bulkOptions: [
            { quantity: 5, unitPrice: 280, discount: 5 },
            { quantity: 10, unitPrice: 270, discount: 10 }
          ]
        },
        {
          id: 'cahier-48p',
          name: 'Cahier 48 pages',
          price: 350,
          image: 'https://i.pinimg.com/1200x/e1/8e/e6/e18ee65268ca73af5a35f4f2ade2c27d.jpg',
          originalPrice: null,
          isPromotion: false,
          inStock: true,
          category: 'Cahiers',
          description: 'Cahier de 48 pages, format standard',
          images: [
            'https://i.pinimg.com/1200x/e1/8e/e6/e18ee65268ca73af5a35f4f2ade2c27d.jpg',
            'https://i.pinimg.com/736x/6a/50/2d/6a502d7a2f0932ce229a52941eba7050.jpg'
          ],
          features: [
            { label: 'Pages', value: '48 pages' },
            { label: 'Format', value: 'A5' },
            { label: 'Reliure', value: 'Agrafée' },
            { label: 'Couleur', value: 'Blanc' }
          ],
          specs: [
            { label: 'Poids', value: '150g' },
            { label: 'Dimensions', value: '14.8 x 21 cm' },
            { label: 'Matériau', value: 'Papier standard' },
            { label: 'Couverture', value: 'Souple' }
          ],
          reviews: [
            { id: 1, user: 'Bob', rating: 5, comment: 'Très pratique pour les cours.', date: '3 août 2025' }
          ],
          bulkOptions: [
            { quantity: 5, unitPrice: 330, discount: 5 },
            { quantity: 10, unitPrice: 320, discount: 10 }
          ]
        },
        {
          id: 'cahier-64p',
          name: 'Cahier 64 pages',
          price: 400,
          image: 'https://i.pinimg.com/1200x/e1/8e/e6/e18ee65268ca73af5a35f4f2ade2c27d.jpg',
          originalPrice: null,
          isPromotion: false,
          inStock: true,
          category: 'Cahiers',
          description: 'Cahier de 64 pages',
          images: [
            'https://i.pinimg.com/1200x/e1/8e/e6/e18ee65268ca73af5a35f4f2ade2c27d.jpg',
            'https://i.pinimg.com/1200x/4e/99/18/4e991885818a6f5d75c158915c667798.jpg'
          ],
          features: [
            { label: 'Pages', value: '64 pages' },
            { label: 'Format', value: 'A5' },
            { label: 'Reliure', value: 'Agrafée' },
            { label: 'Couleur', value: 'Blanc' }
          ],
          specs: [
            { label: 'Poids', value: '200g' },
            { label: 'Dimensions', value: '14.8 x 21 cm' },
            { label: 'Matériau', value: 'Papier standard' },
            { label: 'Couverture', value: 'Souple' }
          ],
          reviews: [
            { id: 1, user: 'Charlie', rating: 4, comment: 'Pratique et solide.', date: '4 août 2025' }
          ],
          bulkOptions: [
            { quantity: 5, unitPrice: 380, discount: 5 },
            { quantity: 10, unitPrice: 370, discount: 10 }
          ]
        },
        {
          id: 'cahier-96p',
          name: 'Cahier 96 pages',
          price: 500,
          image: 'https://i.pinimg.com/1200x/4e/99/18/4e991885818a6f5d75c158915c667798.jpg',
          originalPrice: 600,
          isPromotion: true,
          promotionEndDate: new Date('2024-11-30'),
          inStock: true,
          category: 'Cahiers',
          description: 'Cahier grand format 96 pages, seyes',
          images: [
            'https://i.pinimg.com/1200x/4e/99/18/4e991885818a6f5d75c158915c667798.jpg',
            'https://i.pinimg.com/1200x/e1/8e/e6/e18ee65268ca73af5a35f4f2ade2c27d.jpg'
          ],
          features: [
            { label: 'Pages', value: '96 pages' },
            { label: 'Format', value: 'A4' },
            { label: 'Reliure', value: 'Spirale' },
            { label: 'Couleur', value: 'Blanc' }
          ],
          specs: [
            { label: 'Poids', value: '400g' },
            { label: 'Dimensions', value: '21 x 29.7 cm' },
            { label: 'Matériau', value: 'Papier standard' },
            { label: 'Couverture', value: 'Cartonnée' }
          ],
          reviews: [
            { id: 1, user: 'David', rating: 5, comment: 'Parfait pour la rentrée.', date: '5 août 2025' }
          ],
          bulkOptions: [
            { quantity: 5, unitPrice: 480, discount: 5 },
            { quantity: 10, unitPrice: 460, discount: 10 }
          ]
        },
        {
          id: 'cahier-120p',
          name: 'Cahier 200 pages',
          price: 600,
          image: 'https://i.pinimg.com/736x/fd/f9/0b/fdf90bf685ccedf53d0297c5133f3678.jpg',
          originalPrice: null,
          isPromotion: false,
          inStock: true,
          category: 'Cahiers',
          description: 'Cahier grand format 200 pages',
          images: [
            'https://i.pinimg.com/736x/e5/44/ce/e544ce7cb84568b5b424144f80353325.jpg',
            'https://i.pinimg.com/736x/fd/f9/0b/fdf90bf685ccedf53d0297c5133f3678.jpg'
          ],
          features: [
            { label: 'Pages', value: '200 pages' },
            { label: 'Format', value: 'A4' },
            { label: 'Reliure', value: 'Spirale' },
            { label: 'Couleur', value: 'Blanc' }
          ],
          specs: [
            { label: 'Poids', value: '500g' },
            { label: 'Dimensions', value: '21 x 29.7 cm' },
            { label: 'Matériau', value: 'Papier standard' },
            { label: 'Couverture', value: 'Cartonnée' }
          ],
          reviews: [
            { id: 1, user: 'Emma', rating: 5, comment: 'Très bon cahier.', date: '6 août 2025' }
          ],
          bulkOptions: [
            { quantity: 5, unitPrice: 580, discount: 5 },
            { quantity: 10, unitPrice: 560, discount: 10 }
          ]
        },

        // Stylos
        {
          id: 'stylo-bille-bleu',
          name: 'Stylo Bille Bleu',
          price: 100,
          image: 'https://i.pinimg.com/736x/f3/c3/96/f3c396b6166cb46d61cafa6656cce35c.jpg',
          inStock: true,
          originalPrice: null,
          isPromotion: false,
          category: 'Stylos',
          description: 'Stylo bille encre bleue, pointe fine',
          images: [
            'https://i.pinimg.com/1200x/4c/7a/91/4c7a917a5e91cb46adf213cf3de30734.jpg',
            'https://i.pinimg.com/736x/bb/d8/a2/bbd8a25b8d8337928749a63520a30e7c.jpg'
          ],
          features: [
            { label: 'Type', value: 'Bille' },
            { label: 'Couleur encre', value: 'Bleu' },
            { label: 'Pointe', value: 'Fine' }
          ],
          specs: [
            { label: 'Poids', value: '20g' },
            { label: 'Dimensions', value: '14 cm' },
            { label: 'Matériau', value: 'Plastique' }
          ],
          reviews: [
            { id: 1, user: 'Eve', rating: 4, comment: 'Bonne écriture.', date: '2 août 2025' }
          ],
          bulkOptions: [
            { quantity: 5, unitPrice: 190, discount: 5 },
            { quantity: 10, unitPrice: 180, discount: 10 }
          ]
        },
        // Stylos (suite)
        {
          id: 'stylo-bille-noir',
          name: 'Stylo Bille Noir',
          price: 100,
          image: 'https://i.pinimg.com/1200x/4c/7a/91/4c7a917a5e91cb46adf213cf3de30734.jpg',
          originalPrice: null,
          isPromotion: false,
          inStock: true,
          category: 'Stylos',
          description: 'Stylo bille encre noire, pointe fine',
          images: [
            'https://i.pinimg.com/736x/bb/d8/a2/bbd8a25b8d8337928749a63520a30e7c.jpg',
            'https://i.pinimg.com/1200x/4c/7a/91/4c7a917a5e91cb46adf213cf3de30734.jpg'
          ],
          features: [
            { label: 'Type', value: 'Bille' },
            { label: 'Couleur encre', value: 'Noir' },
            { label: 'Pointe', value: 'Fine' }
          ],
          specs: [
            { label: 'Poids', value: '20g' },
            { label: 'Dimensions', value: '14 cm' },
            { label: 'Matériau', value: 'Plastique' }
          ],
          reviews: [
            { id: 1, user: 'Franck', rating: 5, comment: 'Excellent stylo.', date: '5 août 2025' }
          ],
          bulkOptions: [
            { quantity: 5, unitPrice: 190, discount: 5 },
            { quantity: 10, unitPrice: 180, discount: 10 }
          ]
        },
        {
          id: 'stylo-bille-rouge',
          name: 'Stylo Bille Rouge',
          price: 100,
          image: 'https://i.pinimg.com/736x/6d/6c/05/6d6c0582d435971d58a47859c3a96f69.jpg',
          originalPrice: null,
          isPromotion: false,
          inStock: true,
          category: 'Stylos',
          description: 'Stylo bille encre rouge, pointe fine',
          images: [
            'https://i.pinimg.com/736x/6d/6c/05/6d6c0582d435971d58a47859c3a96f69.jpg',
            'https://i.pinimg.com/1200x/38/4d/b4/384db45c3749c146649aa3c0cf257625.jpg'
          ],
          features: [
            { label: 'Type', value: 'Bille' },
            { label: 'Couleur encre', value: 'Rouge' },
            { label: 'Pointe', value: 'Fine' }
          ],
          specs: [
            { label: 'Poids', value: '20g' },
            { label: 'Dimensions', value: '14 cm' },
            { label: 'Matériau', value: 'Plastique' }
          ],
          reviews: [
            { id: 1, user: 'Gisèle', rating: 4, comment: 'Bonne qualité.', date: '6 août 2025' }
          ],
          bulkOptions: [
            { quantity: 5, unitPrice: 190, discount: 5 },
            { quantity: 10, unitPrice: 180, discount: 10 }
          ]
        },
        {
          id: 'stylo-plume',
          name: 'Stylo Plume',
          price: 1200,
          image: 'https://i.pinimg.com/1200x/c8/09/0d/c8090d67a9b7cea8c1e1157f2ef4f40c.jpg',
          originalPrice: null,
          isPromotion: false,
          inStock: true,
          category: 'Stylos',
          description: 'Stylo plume avec recharge d\'encre',
          images: [
            'https://i.pinimg.com/1200x/c8/09/0d/c8090d67a9b7cea8c1e1157f2ef4f40c.jpg',
            'https://i.pinimg.com/1200x/63/ab/a6/63aba6b4baae61d3f6af75fc5c86e54b.jpg'
          ],
          features: [
            { label: 'Type', value: 'Plume' },
            { label: 'Couleur encre', value: 'Noir' },
            { label: 'Recharge', value: 'Oui' }
          ],
          specs: [
            { label: 'Poids', value: '30g' },
            { label: 'Dimensions', value: '15 cm' },
            { label: 'Matériau', value: 'Métal et plastique' }
          ],
          reviews: [
            { id: 1, user: 'Hugo', rating: 5, comment: 'Écriture fluide et agréable.', date: '7 août 2025' }
          ],
          bulkOptions: [
            { quantity: 5, unitPrice: 1150, discount: 5 },
            { quantity: 10, unitPrice: 1100, discount: 10 }
          ]
        },

        // Crayons
        {
          id: 'crayon-hb',
          name: 'Crayon HB',
          price: 100,
          image: 'https://i.pinimg.com/1200x/33/7e/3b/337e3b1b9a8b9e5b4a9e1a0b8c5a2a1d.jpg',
          originalPrice: null,
          isPromotion: false,
          inStock: true,
          category: 'Crayons',
          description: 'Crayon à papier HB',
          images: [
            'https://placehold.co/600x400/FCF3CF/17202A?text=Crayon+HB',
            'https://placehold.co/600x400/FCF3CF/17202A?text=Crayon+HB-1'
          ],
          features: [
            { label: 'Type', value: 'HB' },
            { label: 'Pour', value: 'Écriture' }
          ],
          specs: [
            { label: 'Poids', value: '10g' },
            { label: 'Dimensions', value: '17 cm' },
            { label: 'Matériau', value: 'Bois' }
          ],
          reviews: [
            { id: 1, user: 'Isabelle', rating: 5, comment: 'Très bon crayon.', date: '8 août 2025' }
          ],
          bulkOptions: [
            { quantity: 10, unitPrice: 90, discount: 10 },
            { quantity: 20, unitPrice: 80, discount: 20 }
          ]
        },
        {
          id: 'crayon-2b',
          name: 'Crayon 2B',
          price: 120,
          image: 'https://i.pinimg.com/1200x/22/9d/4d/229d4d4b8e8e5b5a5e5b5a5e5b5a5e5b.jpg',
          originalPrice: null,
          isPromotion: false,
          inStock: true,
          category: 'Crayons',
          description: 'Crayon à papier 2B pour dessin',
          images: [
            'https://placehold.co/600x400/FCF3CF/17202A?text=Crayon+2B',
            'https://placehold.co/600x400/FCF3CF/17202A?text=Crayon+2B-1'
          ],
          features: [
            { label: 'Type', value: '2B' },
            { label: 'Pour', value: 'Dessin' }
          ],
          specs: [
            { label: 'Poids', value: '12g' },
            { label: 'Dimensions', value: '17 cm' },
            { label: 'Matériau', value: 'Bois' }
          ],
          reviews: [
            { id: 1, user: 'Julien', rating: 4, comment: 'Idéal pour croquis.', date: '9 août 2025' }
          ],
          bulkOptions: [
            { quantity: 10, unitPrice: 110, discount: 8 },
            { quantity: 20, unitPrice: 100, discount: 15 }
          ]
        },

        // Crayons de couleur
        {
          id: 'crayon-de-couleur-12',
          name: 'Crayons de couleur 12',
          price: 600,
          image: 'https://i.pinimg.com/1200x/11/7e/3b/117e3b1b9a8b9e5b4a9e1a0b8c5a2a1d.jpg',
          originalPrice: null,
          isPromotion: false,
          inStock: true,
          category: 'Crayons',
          description: 'Boîte de 12 crayons de couleur',
          images: [
            'https://placehold.co/600x400/FCF3CF/17202A?text=Crayon+12',
            'https://placehold.co/600x400/FCF3CF/17202A?text=Crayon+12-1'
          ],
          features: [
            { label: 'Nombre', value: '12' },
            { label: 'Couleurs', value: 'Assorties' }
          ],
          specs: [
            { label: 'Poids', value: '200g' },
            { label: 'Dimensions', value: 'Boîte 20x10x2 cm' },
            { label: 'Matériau', value: 'Bois et pigments' }
          ],
          reviews: [
            { id: 1, user: 'Karim', rating: 5, comment: 'Couleurs vives et durables.', date: '10 août 2025' }
          ],
          bulkOptions: [
            { quantity: 5, unitPrice: 580, discount: 3 },
            { quantity: 10, unitPrice: 550, discount: 8 }
          ]
        },
        {
          id: 'crayon-de-couleur-24',
          name: 'Crayons de couleur 24',
          price: 1200,
          image: 'https://i.pinimg.com/1200x/00/9d/4d/009d4d4b8e8e5b5a5e5b5a5e5b5a5e5b.jpg',
          originalPrice: null,
          isPromotion: false,
          inStock: true,
          category: 'Crayons',
          description: 'Boîte de 24 crayons de couleur',
          images: [
            'https://placehold.co/600x400/FCF3CF/17202A?text=Crayon+24',
            'https://placehold.co/600x400/FCF3CF/17202A?text=Crayon+24-1'
          ],
          features: [
            { label: 'Nombre', value: '24' },
            { label: 'Couleurs', value: 'Assorties' }
          ],
          specs: [
            { label: 'Poids', value: '400g' },
            { label: 'Dimensions', value: 'Boîte 30x15x2 cm' },
            { label: 'Matériau', value: 'Bois et pigments' }
          ],
          reviews: [
            { id: 1, user: 'Laura', rating: 5, comment: 'Top pour les dessins.', date: '11 août 2025' }
          ],
          bulkOptions: [
            { quantity: 5, unitPrice: 1150, discount: 4 },
            { quantity: 10, unitPrice: 1100, discount: 8 }
          ]
        },

        // Feutres et Surligneurs
        {
          id: 'feutres-fins-12',
          name: 'Feutres fins 12',
          price: 800,
          image: 'https://i.pinimg.com/1200x/99/7e/3b/997e3b1b9a8b9e5b4a9e1a0b8c5a2a1d.jpg',
          originalPrice: null,
          isPromotion: false,
          inStock: true,
          category: 'Feutres et Surligneurs',
          description: 'Boîte de 12 feutres fins',
          images: [
            'https://placehold.co/600x400/D6EAF8/17202A?text=Feutres+12',
            'https://placehold.co/600x400/D6EAF8/17202A?text=Feutres+12-1'
          ],
          features: [
            { label: 'Nombre', value: '12' },
            { label: 'Type', value: 'Feutre fin' }
          ],
          specs: [
            { label: 'Poids', value: '250g' },
            { label: 'Dimensions', value: 'Boîte 20x10x3 cm' },
            { label: 'Matériau', value: 'Plastique' }
          ],
          reviews: [
            { id: 1, user: 'Sophie', rating: 5, comment: 'Très précis et durable.', date: '12 août 2025' }
          ],
          bulkOptions: [
            { quantity: 5, unitPrice: 780, discount: 2 },
            { quantity: 10, unitPrice: 750, discount: 6 }
          ]
        },
        {
          id: 'surligneur-jaune',
          name: 'Surligneur Jaune',
          price: 150,
          image: 'https://i.pinimg.com/1200x/88/9d/4d/889d4d4b8e8e5b5a5e5b5a5e5b5a5e5b.jpg',
          originalPrice: null,
          isPromotion: false,
          inStock: true,
          category: 'Feutres et Surligneurs',
          description: 'Surligneur jaune fluo',
          images: [
            'https://placehold.co/600x400/D6EAF8/17202A?text=Surligneur+Jaune',
            'https://placehold.co/600x400/D6EAF8/17202A?text=Surligneur+Jaune-1'
          ],
          features: [
            { label: 'Couleur', value: 'Jaune' },
            { label: 'Type', value: 'Fluo' }
          ],
          specs: [
            { label: 'Poids', value: '15g' },
            { label: 'Dimensions', value: '14 cm' },
            { label: 'Matériau', value: 'Plastique' }
          ],
          reviews: [
            { id: 1, user: 'Nadia', rating: 4, comment: 'Bien visible.', date: '13 août 2025' }
          ],
          bulkOptions: [
            { quantity: 5, unitPrice: 140, discount: 5 },
            { quantity: 10, unitPrice: 130, discount: 10 }
          ]
        },
        {
          id: 'surligneur-rose',
          name: 'Surligneur Rose',
          price: 150,
          image: 'https://i.pinimg.com/1200x/77/7e/3b/777e3b1b9a8b9e5b4a9e1a0b8c5a2a1d.jpg',
          originalPrice: null,
          isPromotion: false,
          inStock: true,
          category: 'Feutres et Surligneurs',
          description: 'Surligneur rose fluo',
          images: [
            'https://placehold.co/600x400/D6EAF8/17202A?text=Surligneur+Rose',
            'https://placehold.co/600x400/D6EAF8/17202A?text=Surligneur+Rose-1'
          ],
          features: [
            { label: 'Couleur', value: 'Rose' },
            { label: 'Type', value: 'Fluo' }
          ],
          specs: [
            { label: 'Poids', value: '15g' },
            { label: 'Dimensions', value: '14 cm' },
            { label: 'Matériau', value: 'Plastique' }
          ],
          reviews: [
            { id: 1, user: 'Lina', rating: 4, comment: 'Très pratique.', date: '14 août 2025' }
          ],
          bulkOptions: [
            { quantity: 5, unitPrice: 140, discount: 5 },
            { quantity: 10, unitPrice: 130, discount: 10 }
          ]
        },

        // Sacs
        {
          id: 'sac-a-dos-enfant',
          name: 'Sac à dos enfant',
          price: 8000,
          image: 'https://i.pinimg.com/1200x/66/9d/4d/669d4d4b8e8e5b5a5e5b5a5e5b5a5e5b.jpg',
          originalPrice: 10000,
          isPromotion: true,
          inStock: true,
          promotionEndDate: new Date('2024-12-20'),
          category: 'Sacs',
          description: 'Sac à dos coloré et résistant pour enfants',
          images: [
            'https://placehold.co/600x400/EBF5FB/17202A?text=Sac+a+dos',
            'https://placehold.co/600x400/EBF5FB/17202A?text=Sac+a+dos-1'
          ],
          features: [
            { label: 'Capacité', value: '15L' },
            { label: 'Couleur', value: 'Multicolore' }
          ],
          specs: [
            { label: 'Poids', value: '500g' },
            { label: 'Dimensions', value: '30x20x10 cm' },
            { label: 'Matériau', value: 'Polyester' }
          ],
          reviews: [
            { id: 1, user: 'Paul', rating: 5, comment: 'Sac solide et pratique.', date: '15 août 2025' }
          ],
          bulkOptions: [
            { quantity: 2, unitPrice: 7500, discount: 6 },
            { quantity: 5, unitPrice: 7000, discount: 12 }
          ]
        },
        {
          id: 'trousse-simple',
          name: 'Trousse simple',
          price: 500,
          image: 'https://i.pinimg.com/1200x/55/7e/3b/557e3b1b9a8b9e5b4a9e1a0b8c5a2a1d.jpg',
          originalPrice: null,
          isPromotion: false,
          inStock: true,
          category: 'Sacs',
          description: 'Trousse simple pour stylos et crayons',
          images: [
            'https://placehold.co/600x400/EBF5FB/17202A?text=Trousse',
            'https://placehold.co/600x400/EBF5FB/17202A?text=Trousse-1'
          ],
          features: [
            { label: 'Type', value: 'Trousse' },
            { label: 'Couleur', value: 'Bleu' }
          ],
          specs: [
            { label: 'Poids', value: '100g' },
            { label: 'Dimensions', value: '20x7x5 cm' },
            { label: 'Matériau', value: 'Polyester' }
          ],
          reviews: [
            { id: 1, user: 'Emma', rating: 4, comment: 'Simple et pratique.', date: '16 août 2025' }
          ],
          bulkOptions: [
            { quantity: 5, unitPrice: 480, discount: 4 },
            { quantity: 10, unitPrice: 450, discount: 10 }
          ]
        },

        // Calculatrices
        {
          id: 'calculatrice-basique',
          name: 'Calculatrice basique',
          price: 1500,
          image: 'https://i.pinimg.com/1200x/44/9d/4d/449d4d4b8e8e5b5a5e5b5a5e5b5a5e5b.jpg',
          originalPrice: null,
          isPromotion: false,
          inStock: true,
          category: 'Calculatrices',
          description: 'Calculatrice simple pour opérations basiques',
          images: [
            'https://placehold.co/600x400/EAECEE/17202A?text=Calculatrice+Basique',
            'https://placehold.co/600x400/EAECEE/17202A?text=Calculatrice+Basique-1'
          ],
          features: [
            { label: 'Type', value: 'Basique' },
            { label: 'Alimentation', value: 'Piles' }
          ],
          specs: [
            { label: 'Poids', value: '150g' },
            { label: 'Dimensions', value: '12x8x2 cm' },
            { label: 'Matériau', value: 'Plastique' }
          ],
          reviews: [
            { id: 1, user: 'Marc', rating: 5, comment: 'Fait le job.', date: '17 août 2025' }
          ],
          bulkOptions: [
            { quantity: 5, unitPrice: 1400, discount: 6 },
            { quantity: 10, unitPrice: 1300, discount: 13 }
          ]
        },
        {
          id: 'calculatrice-scientifique',
          name: 'Calculatrice Scientifique',
          price: 12000,
          image: 'https://i.pinimg.com/1200x/33/7e/3b/337e3b1b9a8b9e5b4a9e1a0b8c5a2a1d.jpg',
          originalPrice: null,
          isPromotion: false,
          inStock: true,
          category: 'Calculatrices',
          description: 'Calculatrice scientifique programmable',
          images: [
            'https://placehold.co/600x400/EAECEE/17202A?text=Calculatrice',
            'https://placehold.co/600x400/EAECEE/17202A?text=Calculatrice-1'
          ],
          features: [
            { label: 'Type', value: 'Scientifique' },
            { label: 'Fonctions', value: 'Programmable' }
          ],
          specs: [
            { label: 'Poids', value: '250g' },
            { label: 'Dimensions', value: '15x10x2.5 cm' },
            { label: 'Matériau', value: 'Plastique et métal' }
          ],
          reviews: [
            { id: 1, user: 'Claire', rating: 5, comment: 'Très complète.', date: '18 août 2025' }
          ],
          bulkOptions: [
            { quantity: 5, unitPrice: 11500, discount: 4 },
            { quantity: 10, unitPrice: 11000, discount: 8 }
          ]
        },

        // Ardoises
        {
          id: 'ardoise-moderne',
          name: 'Ardoise moderne',
          price: 1500,
          image: 'https://i.pinimg.com/1200x/22/9d/4d/229d4d4b8e8e5b5a5e5b5a5e5b5a5e5b.jpg',
          originalPrice: null,
          isPromotion: false,
          inStock: true,
          category: 'Ardoises',
          description: 'Ardoise double face avec feutre inclus',
          images: [
            'https://placehold.co/600x400/E8F8F5/17202A?text=Ardoise',
            'https://placehold.co/600x400/E8F8F5/17202A?text=Ardoise-1'
          ],
          features: [
            { label: 'Type', value: 'Double face' },
            { label: 'Accessoires', value: 'Feutre inclus' }
          ],
          specs: [
            { label: 'Poids', value: '400g' },
            { label: 'Dimensions', value: '25x20 cm' },
            { label: 'Matériau', value: 'Plastique et ardoise' }
          ],
          reviews: [
            { id: 1, user: 'Kevin', rating: 5, comment: 'Très pratique pour l’école.', date: '19 août 2025' }
          ],
          bulkOptions: [
            { quantity: 5, unitPrice: 1450, discount: 3 },
            { quantity: 10, unitPrice: 1400, discount: 7 }
          ]
        }


        // … et ainsi de suite pour tous les autres stylos, crayons, feutres, sacs, calculatrices, ardoises
      ];



      this.promotions = [
        {
          id: 'promo-cahiers',
          title: '10 Cahiers = 4000 CFA',
          description: '10 cahiers grand format au lieu de 5000 CFA',
          discount: 20,
          endDate: new Date('2024-12-31'),
          products: ['cahier-96p'],
          type: 'percentage'
        },
        {
          id: 'promo-pack-lycee',
          title: 'Pack Lycée + Livraison Gratuite',
          description: 'Achetez le pack lycée et bénéficiez de la livraison gratuite',
          discount: 0,
          endDate: new Date('2024-12-15'),
          products: ['pack-lycee'],
          type: 'fixed'
        }
      ]
    },

    // Charger les produits (simulation API)
    async fetchProducts(): Promise<void> {
      this.loading = true
      try {
        // Simulation d'appel API
        await new Promise<void>((resolve) => setTimeout(resolve, 1000))
        this.initializeDemoData()
      } catch (error: unknown) {
        if (error instanceof Error) {
          console.error('Error fetching products:', error.message)
        } else {
          console.error('An unknown error occurred while fetching products')
        }
      } finally {
        this.loading = false
      }
    },

  
    removeProduct(id: string) {
      this.products = this.products.filter(p => p.id !== id)
    }
,    
    // Calculer le nombre d'articles en promotion
    getPromotionCount(): number {
      return this.products.filter(p => p.isPromotion).length
    },
    // Ajouter un produit
    addProduct(product: Product): void {
      this.products.push(product)
    },

    // Ajouter un pack
    addPack(pack: Pack): void {
      this.packs.push(pack)
    },

    // Mettre à jour le stock d'un produit
    updateProductStock(id: string, inStock: boolean): void {
      const product = this.products.find((p: Product) => p.id === id)
      if (product) {
        product.inStock = inStock
      } else {
        const pack = this.packs.find((p: Pack) => p.id === id)
        if (pack) {
          pack.inStock = inStock
        }
      }
    },

    // Appliquer une promotion à un produit
    applyPromotionToProduct(productId: string, discount: number, endDate: Date): void {
      const product = this.products.find((p: Product) => p.id === productId)
      if (product) {
        product.originalPrice = product.price
        product.price = product.price * (1 - discount / 100)
        product.isPromotion = true
        product.promotionEndDate = endDate
      }
    },

    // Retirer une promotion d'un produit
    removePromotionFromProduct(productId: string): void {
      const product = this.products.find((p: Product) => p.id === productId)
      if (product && product.originalPrice !== null && product.originalPrice !== undefined) {
        product.price = product.originalPrice
        product.originalPrice = undefined
        product.isPromotion = false
        product.promotionEndDate = undefined
      }
    },

    // Obtenir des recommandations basées sur l'âge/niveau
    getRecommendations(level: string): (Product | Pack)[] {
      // Logique de recommandation basée sur le niveau
      const recommendedPacks = this.packs.filter((pack: Pack) => {
        if (['CP', 'CE1', 'CE2'].includes(level)) {
          return pack.level === 'Primaire' || pack.level === level
        } else if (['6ème', '5ème', '4ème', '3ème'].includes(level)) {
          return pack.level === 'Collège' || pack.level === level
        } else if (['Seconde', 'Première', 'Terminale'].includes(level)) {
          return pack.level === 'Lycée' || pack.level === level
        }
        return false
      })

      // Ajouter des produits complémentaires
      const recommendedProducts = this.products.filter((product: Product) => {
        if (['CP', 'CE1', 'CE2'].includes(level)) {
          return ['Cahiers', 'Stylos', 'Crayons'].includes(product.category)
        } else if (level === 'Collège') {
          return ['Classeurs', 'Feuilles', 'Calculatrices'].includes(product.category)
        } else if (level === 'Lycée') {
          return ['Classeurs', 'Calculatrices', 'Règles'].includes(product.category)
        }
        return false
      })

      return [...recommendedPacks, ...recommendedProducts].slice(0, 6)
    }
  }
})