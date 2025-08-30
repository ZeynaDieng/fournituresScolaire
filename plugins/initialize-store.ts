// plugins/initialize-store.ts
export default defineNuxtPlugin(async (nuxtApp) => {
  const productsStore = useProductsStore()
  
  // Only initialize if we're in development mode or if the store is empty
  if (process.env.NODE_ENV !== 'production' || productsStore.products.length === 0) {
    await productsStore.initializeDemoData()
  }
})
