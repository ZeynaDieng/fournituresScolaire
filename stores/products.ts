// stores/products.ts
import { defineStore } from 'pinia'


export interface Product {
  id: string
  name: string
  price: number
  originalPrice?: number
  image: string
  category: string
  description: string
  inStock: boolean
  isPromotion?: boolean
  promotionEndDate?: Date
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
    getProductsByCategory: (state) => (category: string): Product[] => {
      return state.products.filter(product => product.category === category)
    },

    // Packs par niveau
    getPacksByLevel: (state) => (level: string): Pack[] => {
      return state.packs.filter(pack => pack.level === level)
    },

    // Packs populaires
    popularPacks: (state): Pack[] => {
      return state.packs.filter(pack => pack.isPopular).slice(0, 4)
    },

    // Produits en promotion
    promotionalProducts: (state): Product[] => {
      return state.products.filter(product => product.isPromotion)
    },

    // Packs en promotion
    promotionalPacks: (state): Pack[] => {
      return state.packs.filter(pack => pack.isPromotion)
    },

    // Promotions actives
    activePromotions: (state): Promotion[] => {
      const now = new Date()
      return state.promotions.filter(promo => new Date(promo.endDate) > now)
    },

    // Recherche de produits
    searchProducts: (state) => (query: string): (Product | Pack)[] => {
      const searchTerm = query.toLowerCase()
      const matchingProducts = state.products.filter(product =>
        product.name.toLowerCase().includes(searchTerm) ||
        product.category.toLowerCase().includes(searchTerm)
      )
      const matchingPacks = state.packs.filter(pack =>
        pack.name.toLowerCase().includes(searchTerm) ||
        pack.level.toLowerCase().includes(searchTerm)
      )
      return [...matchingProducts, ...matchingPacks]
    },

    // Obtenir un produit par ID
    getProductById: (state) => (id: string): Product | undefined => {
      return state.products.find(product => product.id === id)
    },

    // Obtenir un pack par ID
    getPackById: (state) => (id: string): Pack | undefined => {
      return state.packs.find(pack => pack.id === id)
    }
  },

  actions: {
    // Initialiser les données de démo
    initializeDemoData() {
      this.packs = [
        {
          id: 'pack-cp',
          name: 'Pack Complet CP',
          level: 'CP',
          price: 15000,
          originalPrice: 18000,
          image: '/images/pack-cp.jpg',
          description: 'Tout ce qu\'il faut pour une rentrée réussie en CP',
          contents: [
            '10 cahiers seyes 96 pages',
            '5 cahiers de dessin',
            '1 trousse complète',
            '6 stylos bille',
            '4 crayons de couleur',
            '1 ardoise + feutre',
            '1 règle 20cm'
          ],
          isPopular: true,
          inStock: true,
          isPromotion: true,
          promotionEndDate: new Date('2024-12-31')
        },
        {
          id: 'pack-ce',
          name: 'Pack CE1-CE2',
          level: 'CE1-CE2',
          price: 18000,
          originalPrice: 22000,
          image: '/images/pack-ce.jpg',
          description: 'Pack adapté aux élèves de CE1 et CE2',
          contents: [
            '15 cahiers 96 pages',
            '6 cahiers de brouillon',
            '1 trousse renforcée',
            '8 stylos bille',
            '1 boîte de crayons couleur',
            '1 ardoise moderne',
            '1 équerre et 1 règle'
          ],
          isPopular: true,
          inStock: true
        },
        {
          id: 'pack-college',
          name: 'Pack Collège',
          level: 'Collège',
          price: 25000,
          originalPrice: 30000,
          image: '/images/pack-college.jpg',
          description: 'Pack complet pour les élèves du collège',
          contents: [
            '20 cahiers grands formats',
            '5 classeurs A4',
            '1 sac à dos renforcé',
            '10 stylos diverses couleurs',
            '1 kit géométrie complet',
            '1 calculatrice scientifique',
            '1 agenda scolaire'
          ],
          isPopular: true,
          inStock: true,
          isPromotion: true,
          promotionEndDate: new Date('2024-12-15')
        },
        {
          id: 'pack-lycee',
          name: 'Pack Lycée',
          level: 'Lycée',
          price: 35000,
          originalPrice: 42000,
          image: '/images/pack-lycee.jpg',
          description: 'Pack premium pour les lycéens',
          contents: [
            '25 cahiers grand format',
            '8 classeurs A4',
            '1 sac à dos premium',
            '15 stylos et marqueurs',
            '1 kit géométrie professionnel',
            '1 calculatrice graphique',
            '1 agenda et 1 trieur'
          ],
          isPopular: true,
          inStock: true
        }
      ]

      this.products = [
        {
          id: 'cahier-96p',
          name: 'Cahier 96 pages',
          price: 500,
          originalPrice: 600,
          image: '/images/cahier-96p.jpg',
          category: 'Cahiers',
          description: 'Cahier grand format 96 pages, seyes',
          inStock: true,
          isPromotion: true,
          promotionEndDate: new Date('2024-11-30')
        },
        {
          id: 'stylo-bille-bleu',
          name: 'Stylo Bille Bleu',
          price: 200,
          image: '/images/stylo-bleu.jpg',
          category: 'Stylos',
          description: 'Stylo bille encre bleue, pointe fine',
          inStock: true
        },
        {
          id: 'sac-a-dos-enfant',
          name: 'Sac à dos enfant',
          price: 8000,
          originalPrice: 10000,
          image: '/images/sac-enfant.jpg',
          category: 'Sacs',
          description: 'Sac à dos coloré et résistant pour enfants',
          inStock: true,
          isPromotion: true,
          promotionEndDate: new Date('2024-12-20')
        },
        {
          id: 'ardoise-moderne',
          name: 'Ardoise moderne',
          price: 1500,
          image: '/images/ardoise.jpg',
          category: 'Ardoises',
          description: 'Ardoise double face avec feutre inclus',
          inStock: true
        },
        {
          id: 'calculatrice-scientifique',
          name: 'Calculatrice Scientifique',
          price: 12000,
          image: '/images/calculatrice.jpg',
          category: 'Calculatrices',
          description: 'Calculatrice scientifique programmable',
          inStock: true
        }
      ]

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
    async fetchProducts() {
      this.loading = true
      try {
        // Simulation d'appel API
        await new Promise(resolve => setTimeout(resolve, 1000))
        this.initializeDemoData()
      } catch (error) {
        console.error('Error fetching products:', error)
      } finally {
        this.loading = false
      }
    },

    // Ajouter un produit
    addProduct(product: Product) {
      this.products.push(product)
    },

    // Ajouter un pack
    addPack(pack: Pack) {
      this.packs.push(pack)
    },

    // Mettre à jour le stock d'un produit
    updateProductStock(id: string, inStock: boolean) {
      const product = this.products.find(p => p.id === id)
      if (product) {
        product.inStock = inStock
      }
      
      const pack = this.packs.find(p => p.id === id)
      if (pack) {
        pack.inStock = inStock
      }
    },

    // Appliquer une promotion à un produit
    applyPromotionToProduct(productId: string, discount: number, endDate: Date) {
      const product = this.products.find(p => p.id === productId)
      if (product) {
        product.originalPrice = product.price
        product.price = Math.round(product.price * (1 - discount / 100))
        product.isPromotion = true
        product.promotionEndDate = endDate
      }
    },

    // Retirer une promotion d'un produit
    removePromotionFromProduct(productId: string) {
      const product = this.products.find(p => p.id === productId)
      if (product && product.originalPrice) {
        product.price = product.originalPrice
        product.originalPrice = undefined
        product.isPromotion = false
        product.promotionEndDate = undefined
      }
    },

    // Obtenir des recommandations basées sur l'âge/niveau
    getRecommendations(level: string): (Product | Pack)[] {
      const levelPacks = this.getPacksByLevel(level)
      const recommendedProducts = []
      
      // Logique de recommandation simple
      switch (level.toLowerCase()) {
        case 'cp':
          recommendedProducts.push(
            ...this.products.filter(p => 
              ['Cahiers', 'Stylos', 'Ardoises'].includes(p.category)
            ).slice(0, 3)
          )
          break
        case 'ce1-ce2':
          recommendedProducts.push(
            ...this.products.filter(p => 
              ['Cahiers', 'Stylos', 'Règles'].includes(p.category)
            ).slice(0, 3)
          )
          break
        case 'collège':
          recommendedProducts.push(
            ...this.products.filter(p => 
              ['Calculatrices', 'Classeurs', 'Sacs'].includes(p.category)
            ).slice(0, 3)
          )
          break
        case 'lycée':
          recommendedProducts.push(
            ...this.products.filter(p => 
              ['Calculatrices', 'Classeurs', 'Sacs'].includes(p.category)
            ).slice(0, 3)
          )
          break
      }
      
      return [...levelPacks, ...recommendedProducts]
    }
  }
})