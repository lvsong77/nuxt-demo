export default defineNuxtRouteMiddleware(async (to) => {
  if (import.meta.server) return;

  // 检查登录状态
  const userToken = localStorage.getItem("user_token");
  if (!userToken) {
    return navigateTo("/login");
  }

  // 检查角色状态
  try {
    const gameManager = await useGameAsync();
    const currentCharacterId = gameManager.currentCharacterId;

    if (!currentCharacterId) {
      // 没有选中角色，跳转到角色选择
      return navigateTo("/game/character/select");
    }
  } catch (error) {
    return navigateTo("/login");
  }
});
