<template>
  <div class="mobile-game-layout">
    <!-- 🔝 顶部状态栏 -->
    <GameStatusBar :character="currentCharacter" :loading="loading" />

    <!-- 📱 主内容区域 -->
    <div class="main-content">
      <!-- 子路由内容 -->
      <NuxtPage
        v-if="hasChildRoute"
        :character="currentCharacter"
        @character-update="onCharacterUpdate"
      />

      <!-- 默认首页内容 -->
      <GameDashboard
        v-else
        :character="currentCharacter"
        @character-update="onCharacterUpdate"
        @navigate="navigateToSection"
      />
    </div>

    <!-- 🔽 底部导航栏 -->
    <GameBottomNav
      :sections="gameSections"
      :current-section="currentSectionId"
      @section-change="onSectionChange"
    />

    <!-- 🔔 浮动通知 -->
    <!-- <GameNotifications /> -->

    <!-- ⚙️ 全局操作按钮 -->
    <!-- <GameFloatingActions
      v-if="showFloatingActions"
      @save="handleSave"
      @settings="showSettings = true"
    /> -->

    <!-- 📋 设置弹窗 -->
    <!-- <GameSettingsModal v-model="showSettings" :character="currentCharacter" /> -->
  </div>
</template>

<script setup lang="ts">
import { useGameAsync } from "~/composables/useGame";

const currentCharacterId = ref("");

onMounted(async () => {
  const gameManager = await useGameAsync();
  currentCharacterId.value = gameManager.currentCharacterId;
});
</script>

<style lang="scss" scoped>
.mobile-game-layout {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  position: relative;
  overflow: hidden;
}

.main-content {
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.95);
  margin: 0.5rem;
  border-radius: 1.25rem 1.25rem 0 0;
  box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.1);
  position: relative;

  // 滚动优化
  -webkit-overflow-scrolling: touch;
  scroll-behavior: smooth;

  // 防止内容贴边
  &::-webkit-scrollbar {
    display: none;
  }

  // 滚动条样式（桌面端）
  scrollbar-width: none;
  -ms-overflow-style: none;
}

// 响应式适配
@media (max-width: 375px) {
  .main-content {
    margin: 0.25rem;
    padding: 0.75rem;
  }
}

// iPhone X 及以上的安全区域适配
@supports (padding: env(safe-area-inset-bottom)) {
  .mobile-game-layout {
    padding-bottom: env(safe-area-inset-bottom);
  }
}

// 深色模式支持（可选）
@media (prefers-color-scheme: dark) {
  .mobile-game-layout {
    background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%);
  }

  .main-content {
    background: rgba(45, 55, 72, 0.95);
    color: #e2e8f0;
  }
}
</style>
