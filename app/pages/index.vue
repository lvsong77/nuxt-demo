<template>
  <div class="app-entry">
    <!-- <div v-if="loading" class="loading-screen">
      <div class="loading-spinner"></div>
      <p>正在检查登录状态...</p>
    </div>


    <div v-else>

    </div> -->
  </div>
</template>

<script setup lang="ts">
// 状态检查和路由逻辑
const loading = ref(true);

onMounted(async () => {
  // try {
  //   // 1. 检查用户登录状态
  //   const isLoggedIn = await checkUserAuth();
  //   if (!isLoggedIn) {
  //     // 未登录 -> 跳转到登录页
  //     navigateTo("/login");
  //     return;
  //   }
  //   // 2. 检查游戏角色状态
  //   const gameManager = await useGameAsync();
  //   const characters = await gameManager.getCharacterList();
  //   if (characters.length === 0) {
  //     // 已登录但无角色 -> 跳转到角色创建
  //     navigateTo("/game/character/create");
  //     return;
  //   }
  //   // 3. 检查是否有选中的角色
  //   const currentCharacterId = gameManager.currentCharacterId;
  //   if (!currentCharacterId) {
  //     // 有角色但未选中 -> 显示角色选择界面
  //     await showCharacterSelection(characters);
  //     return;
  //   }
  //   // 4. 一切就绪 -> 直接进入游戏
  //   navigateTo("/game");
  // } catch (error) {
  //   console.error("App initialization failed:", error);
  //   // 出错时跳转到登录页
  //   navigateTo("/login");
  // } finally {
  //   loading.value = false;
  // }

  navigateTo("/character/list");
});

// // 检查用户认证状态
// const checkUserAuth = async (): Promise<boolean> => {
//   // 这里实现你的认证逻辑
//   // 可能是检查 token、cookie 或其他认证方式

//   // 示例：检查 localStorage 中的用户信息
//   const userToken = localStorage.getItem("user_token");
//   const userId = localStorage.getItem("user_id");

//   if (!userToken || !userId) {
//     return false;
//   }

//   // 可选：验证 token 是否有效
//   try {
//     // const response = await $fetch('/api/auth/verify', {
//     //   headers: { Authorization: `Bearer ${userToken}` }
//     // });
//     // return response.valid;

//     // 简化版本：假设 token 存在就是有效的
//     return true;
//   } catch {
//     return false;
//   }
// };

// // 显示角色选择界面
// const showCharacterSelection = async (characters: Character[]) => {
//   // 这里可以显示角色选择界面
//   // 或者跳转到专门的角色选择页面
//   navigateTo("/game/character/select");
// };
</script>
