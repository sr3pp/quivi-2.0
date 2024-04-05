export default defineNuxtRouteMiddleware((to, from) => {
  if (to.meta.layout === "panel") {
    if (!useAuth().isLoggedIn) {
      return navigateTo("/");
    }
  }
});
