import { defineStore } from 'pinia';

export const useSearchStore = defineStore('search', {
  state: () => ({
    query: '',
    isSearchOpen: false,
    searchResults: [] as any[],
    isLoading: false,
    error: null as string | null
  }),

  actions: {
    setQuery(query: string) {
      this.query = query;
    },
    
    toggleSearch() {
      this.isSearchOpen = !this.isSearchOpen;
      if (!this.isSearchOpen) {
        this.query = '';
        this.searchResults = [];
      }
    },
    
    async performSearch() {
      if (!this.query.trim()) {
        this.searchResults = [];
        return;
      }

      this.isLoading = true;
      this.error = null;

      try {
        // Ici, vous devrez implémenter la logique de recherche réelle
        // Par exemple, appeler votre API ou filtrer les données locales
        // Pour l'instant, nous allons simuler une recherche
        const productsStore = useProductsStore();
        
        // Recherche dans les produits
        const productResults = productsStore.products.filter(product => 
          product.name.toLowerCase().includes(this.query.toLowerCase()) ||
          product.description?.toLowerCase().includes(this.query.toLowerCase())
        );
        
        // Recherche dans les packs (si nécessaire)
        const packResults = productsStore.packs.filter(pack => 
          pack.name.toLowerCase().includes(this.query.toLowerCase()) ||
          pack.description?.toLowerCase().includes(this.query.toLowerCase())
        );

        this.searchResults = [...productResults, ...packResults];
      } catch (error) {
        console.error('Erreur lors de la recherche:', error);
        this.error = 'Une erreur est survenue lors de la recherche';
      } finally {
        this.isLoading = false;
      }
    },
    
    clearSearch() {
      this.query = '';
      this.searchResults = [];
      this.isSearchOpen = false;
    }
  }
});
