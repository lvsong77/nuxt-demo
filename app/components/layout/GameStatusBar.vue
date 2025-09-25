<template>
  <div class="status-bar">
    <!-- 角色基本信息 -->
    <div class="character-info">
      <div class="avatar-section">
        <img
          :src="character?.avatar || '/default-avatar.png'"
          class="avatar"
          :class="{ loading: loading }"
        />
        <div class="level-badge">{{ character?.level || 1 }}</div>
      </div>

      <div class="basic-info">
        <h3 class="character-name">{{ character?.name || "加载中..." }}</h3>
        <div class="exp-bar">
          <div class="exp-fill" :style="{ width: expPercentage + '%' }"></div>
          <span class="exp-text">{{ character?.exp || 0 }}/{{ nextLevelExp }}</span>
        </div>
      </div>
    </div>

    <!-- 资源信息 -->
    <div class="resources">
      <div class="resource-item">
        <span class="resource-icon">💰</span>
        <span class="resource-value">{{ formatNumber(character?.gold || 0) }}</span>
      </div>
      <div class="resource-item">
        <span class="resource-icon">💎</span>
        <span class="resource-value">{{ formatNumber(character?.gems || 0) }}</span>
      </div>
      <div class="resource-item">
        <span class="resource-icon">⚡</span>
        <span class="resource-value">{{ character?.energy || 100 }}/100</span>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.status-bar {
  padding: calc(env(safe-area-inset-top) + 0.75rem) 1rem 0.75rem;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  display: flex;
  justify-content: space-between;
  align-items: center;
  z-index: 100;
  position: relative;
}

.character-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex: 1;
}

.avatar-section {
  position: relative;
  flex-shrink: 0;
}

.avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  border: 2px solid rgba(255, 255, 255, 0.3);
  object-fit: cover;
  transition: all 0.3s ease;

  &.loading {
    opacity: 0.6;
    animation: pulse 1.5s ease-in-out infinite;
  }
}

.level-badge {
  position: absolute;
  bottom: -2px;
  right: -2px;
  background: linear-gradient(45deg, #4caf50, #45a049);
  color: white;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.7rem;
  font-weight: bold;
  border: 2px solid rgba(255, 255, 255, 0.9);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.basic-info {
  flex: 1;
  min-width: 0; // 防止文字溢出
}

.character-name {
  margin: 0 0 0.25rem 0;
  font-size: 1.1rem;
  font-weight: 600;
  color: white;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);

  // 文字溢出处理
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.exp-bar {
  position: relative;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 10px;
  height: 16px;
  overflow: hidden;
  backdrop-filter: blur(5px);
}

.exp-fill {
  height: 100%;
  background: linear-gradient(90deg, #ffd700, #ffa500);
  border-radius: 10px;
  transition: width 0.5s ease;
  position: relative;

  &::after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.3),
      transparent
    );
    animation: shimmer 2s infinite;
  }
}

.exp-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 0.7rem;
  font-weight: 500;
  color: white;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
  z-index: 1;
}

.resources {
  display: flex;
  gap: 0.75rem;
  flex-shrink: 0;
}

.resource-item {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  background: rgba(255, 255, 255, 0.15);
  padding: 0.375rem 0.5rem;
  border-radius: 12px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: translateY(-1px);
  }
}

.resource-icon {
  font-size: 0.9rem;
}

.resource-value {
  font-size: 0.8rem;
  font-weight: 600;
  color: white;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}

// 动画
@keyframes pulse {
  0%,
  100% {
    opacity: 0.6;
  }
  50% {
    opacity: 1;
  }
}

@keyframes shimmer {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}

// 响应式适配
@media (max-width: 375px) {
  .status-bar {
    padding-left: 0.75rem;
    padding-right: 0.75rem;
  }

  .character-info {
    gap: 0.5rem;
  }

  .avatar {
    width: 45px;
    height: 45px;
  }

  .level-badge {
    width: 18px;
    height: 18px;
    font-size: 0.65rem;
  }

  .character-name {
    font-size: 1rem;
  }

  .resources {
    gap: 0.5rem;
  }

  .resource-item {
    padding: 0.25rem 0.375rem;
  }

  .resource-value {
    font-size: 0.75rem;
  }
}

// 横屏适配
@media (orientation: landscape) and (max-height: 500px) {
  .status-bar {
    padding-top: 0.5rem;
    padding-bottom: 0.5rem;
  }

  .avatar {
    width: 40px;
    height: 40px;
  }
}
</style>
