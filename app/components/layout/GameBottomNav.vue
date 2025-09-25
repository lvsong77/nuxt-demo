<template>
  <nav class="bottom-nav">
    <NuxtLink
      v-for="section in sections"
      :key="section.id"
      :to="section.path"
      :class="[
        'nav-item',
        {
          active: isActive(section.id),
          'has-badge': section.badge > 0,
        },
      ]"
      @click="handleNavClick(section)"
    >
      <div class="nav-icon-container">
        <span class="nav-icon">{{ section.icon }}</span>
        <span v-if="section.badge" class="nav-badge">{{ section.badge }}</span>
      </div>
      <span class="nav-text">{{ section.name }}</span>

      <!-- 活跃状态指示器 -->
      <div v-if="isActive(section.id)" class="active-indicator"></div>
    </NuxtLink>
  </nav>
</template>

<style lang="scss" scoped>
.bottom-nav {
  display: flex;
  background: rgba(255, 255, 255, 0.98);
  backdrop-filter: blur(20px);
  padding: 0.5rem 0 calc(env(safe-area-inset-bottom) + 0.5rem);
  box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.1);
  border-top: 1px solid rgba(0, 0, 0, 0.05);
  z-index: 100;
  position: relative;
}

.nav-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
  padding: 0.5rem 0.25rem;
  text-decoration: none;
  color: #718096;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  cursor: pointer;

  // 触摸反馈
  -webkit-tap-highlight-color: transparent;

  &.active {
    color: #667eea;
    transform: translateY(-2px);

    .nav-icon {
      transform: scale(1.15);
    }

    .nav-text {
      font-weight: 600;
    }
  }

  &:active {
    transform: translateY(0);
  }

  // 涟漪效果
  &::before {
    content: "";
    position: absolute;
    top: 50%;
    left: 50%;
    width: 0;
    height: 0;
    background: rgba(102, 126, 234, 0.1);
    border-radius: 50%;
    transform: translate(-50%, -50%);
    transition: width 0.3s ease, height 0.3s ease;
  }

  &:active::before {
    width: 60px;
    height: 60px;
  }
}

.nav-icon-container {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
}

.nav-icon {
  font-size: 1.5rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  z-index: 1;
}

.nav-text {
  font-size: 0.75rem;
  font-weight: 500;
  text-align: center;
  transition: all 0.3s ease;
  line-height: 1.2;
}

.nav-badge {
  position: absolute;
  top: -6px;
  right: -6px;
  background: linear-gradient(45deg, #ff4757, #ff3742);
  color: white;
  border-radius: 50%;
  min-width: 18px;
  height: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.7rem;
  font-weight: bold;
  border: 2px solid white;
  box-shadow: 0 2px 8px rgba(255, 71, 87, 0.3);
  animation: pulse-badge 2s infinite;
  z-index: 2;
}

.active-indicator {
  position: absolute;
  bottom: -0.5rem;
  left: 50%;
  transform: translateX(-50%);
  width: 6px;
  height: 6px;
  background: #667eea;
  border-radius: 50%;
  box-shadow: 0 0 8px rgba(102, 126, 234, 0.5);
}

// 悬浮效果（仅桌面端）
@media (hover: hover) {
  .nav-item:hover {
    color: #667eea;

    .nav-icon {
      transform: scale(1.1);
    }
  }
}

// 动画
@keyframes pulse-badge {
  0%,
  100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
}

// 响应式适配
@media (max-width: 375px) {
  .nav-text {
    font-size: 0.7rem;
  }

  .nav-icon {
    font-size: 1.3rem;
  }

  .nav-badge {
    min-width: 16px;
    height: 16px;
    font-size: 0.65rem;
  }

  .nav-item {
    padding: 0.375rem 0.125rem;
  }
}

// 超小屏幕适配
@media (max-width: 320px) {
  .nav-text {
    font-size: 0.65rem;
  }

  .nav-icon {
    font-size: 1.2rem;
  }

  .nav-item {
    gap: 0.125rem;
  }
}

// 横屏适配
@media (orientation: landscape) and (max-height: 500px) {
  .bottom-nav {
    padding-top: 0.25rem;
    padding-bottom: calc(env(safe-area-inset-bottom) + 0.25rem);
  }

  .nav-item {
    padding: 0.25rem 0.125rem;
    gap: 0.125rem;
  }

  .nav-icon {
    font-size: 1.2rem;
  }

  .nav-text {
    font-size: 0.65rem;
  }
}

// iPhone X 及以上的安全区域适配
@supports (padding: env(safe-area-inset-bottom)) {
  .bottom-nav {
    padding-bottom: calc(env(safe-area-inset-bottom) + 0.5rem);
  }
}

// 深色模式支持
@media (prefers-color-scheme: dark) {
  .bottom-nav {
    background: rgba(45, 55, 72, 0.98);
    border-top-color: rgba(255, 255, 255, 0.1);
  }

  .nav-item {
    color: #a0aec0;

    &.active {
      color: #90cdf4;
    }
  }

  .active-indicator {
    background: #90cdf4;
    box-shadow: 0 0 8px rgba(144, 205, 244, 0.5);
  }
}

// 高对比度模式支持
@media (prefers-contrast: high) {
  .nav-item {
    color: #000;

    &.active {
      color: #0066cc;
      font-weight: bold;
    }
  }

  .bottom-nav {
    border-top: 2px solid #000;
  }
}

// 减少动画模式支持
@media (prefers-reduced-motion: reduce) {
  .nav-item,
  .nav-icon,
  .nav-text,
  .nav-badge {
    transition: none;
  }

  .nav-badge {
    animation: none;
  }
}
</style>
