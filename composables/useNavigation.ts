// composables/useNavigation.ts
import { defineAsyncComponent } from 'vue'

export const useNavigation = () => {
  const navItems = [
    {
      name: 'Accueil',
      path: '/',
      icon: defineAsyncComponent(() => import('~/components/icons/HomeIcon.vue'))
    },
    {
      name: 'Packs',
      path: '/packs',
      icon: defineAsyncComponent(() => import('~/components/icons/PackageIcon.vue'))
    },
    {
      name: 'Articles',
      path: '/products',
      icon: defineAsyncComponent(() => import('~/components/icons/ProductIcon.vue'))
    },
    {
      name: 'Promos',
      path: '/promotions',
      icon: defineAsyncComponent(() => import('~/components/icons/ProductIcon.vue'))
    },
    {
        name: 'Contact',
        path: '/contact',
        icon: defineAsyncComponent(() => import('~/components/icons/HomeIcon.vue'))
    }
  ]

  return {
    navItems
  }
}
