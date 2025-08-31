export default defineNuxtRouteMiddleware((to, from) => {
  if (to.path.startsWith('/admin') && to.path !== '/admin/login') {
    const token = process.client ? localStorage.getItem('admin_token') : null
    if (token !== 'supersecrettoken') {
      return navigateTo('/admin/login')
    }
  }
})
