export default defineNuxtRouteMiddleware((to) => {
  // 只在客户端执行
  if (import.meta.server) return;

  const userToken = localStorage.getItem("user_token");

  if (!userToken) {
    // 未登录，跳转到登录页
    return navigateTo("/login");
  }
});
