<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
    <!-- 顶部区域 -->
    <header class="text-center py-8">
      <div class="mb-4">
        <h1 class="text-4xl font-bold text-gray-800 mb-2">🎮 Project Idle</h1>
        <p class="text-gray-600">挂机冒险，轻松成长</p>
      </div>
    </header>

    <!-- 中间区域 - 角色选择 -->
    <main class="container mx-auto px-4 py-8">
      <div class="max-w-md mx-auto">
        <!-- 角色选择区域 -->
        <div v-if="characters.length > 0" class="mb-8">
          <h2 class="text-xl font-semibold text-gray-700 mb-4 text-center">选择角色</h2>
          <div class="space-y-3">
            <div
              v-for="character in characters"
              :key="character.id"
              @click="selectCharacter(character)"
              :class="[
                'p-4 rounded-lg border-2 cursor-pointer transition-all duration-200',
                selectedCharacter?.id === character.id
                  ? 'border-blue-500 bg-blue-50 shadow-md'
                  : 'border-gray-200 bg-white hover:border-blue-300 hover:shadow-sm',
              ]"
            >
              <div class="flex items-center space-x-3">
                <div
                  class="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-lg"
                >
                  {{ character.name.charAt(0).toUpperCase() }}
                </div>
                <div class="flex-1">
                  <h3 class="font-semibold text-gray-800">{{ character.name }}</h3>
                  <p class="text-sm text-gray-600">
                    等级 {{ character.level }} • {{ character.class }}
                  </p>
                  <p class="text-xs text-gray-500">
                    最后登录: {{ formatDate(character.lastLogin) }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 创建新角色区域 -->
        <div v-else class="text-center mb-8">
          <div
            class="w-24 h-24 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center mx-auto mb-4"
          >
            <span class="text-4xl">👤</span>
          </div>
          <h2 class="text-xl font-semibold text-gray-700 mb-2">欢迎来到 Project Idle</h2>
          <p class="text-gray-600 mb-4">创建你的第一个角色开始冒险吧！</p>

          <!-- 游戏状态显示 -->
          <div class="bg-gray-100 rounded-lg p-3 mb-4">
            <div class="text-sm text-gray-600 mb-1">游戏状态</div>
            <div class="flex items-center justify-center space-x-4">
              <span
                class="text-xs px-2 py-1 rounded"
                :class="{
                  'bg-green-200 text-green-800': gameState === 'running',
                  'bg-yellow-200 text-yellow-800': gameState === 'paused',
                  'bg-blue-200 text-blue-800': gameState === 'loading',
                  'bg-gray-200 text-gray-800': gameState === 'initializing',
                  'bg-red-200 text-red-800': gameState === 'error',
                }"
              >
                {{
                  gameState === "running"
                    ? "运行中"
                    : gameState === "paused"
                    ? "已暂停"
                    : gameState === "loading"
                    ? "加载中"
                    : gameState === "initializing"
                    ? "初始化"
                    : "错误"
                }}
              </span>
              <span v-if="isGameRunning" class="text-xs text-green-600 animate-pulse"
                >● 游戏循环运行中</span
              >
            </div>
          </div>
        </div>

        <!-- 创建新角色按钮 -->
        <UButton
          @click="showCreateCharacter = true"
          size="lg"
          color="primary"
          variant="solid"
          class="w-full mb-4"
          :icon="characters.length > 0 ? 'i-heroicons-plus' : 'i-heroicons-user-plus'"
        >
          {{ characters.length > 0 ? "创建新角色" : "创建角色" }}
        </UButton>
      </div>
    </main>

    <!-- 底部区域 -->
    <footer class="container mx-auto px-4 py-6">
      <!-- 游戏控制按钮 -->
      <div class="max-w-md mx-auto mb-4">
        <div class="flex justify-center space-x-2">
          <UButton
            @click="startGame"
            :disabled="(!selectedCharacter && characters.length > 0) || isGameRunning"
            size="lg"
            color="success"
            variant="solid"
            class="flex-1"
            icon="i-heroicons-play"
          >
            开始游戏
          </UButton>

          <UButton
            v-if="isGameRunning"
            @click="gameManager.pauseGame()"
            size="lg"
            color="warning"
            variant="outline"
            class="flex-1"
            icon="i-heroicons-pause"
          >
            暂停
          </UButton>

          <UButton
            v-if="gameState === 'paused'"
            @click="gameManager.resumeGame()"
            size="lg"
            color="success"
            variant="outline"
            class="flex-1"
            icon="i-heroicons-play"
          >
            恢复
          </UButton>

          <UButton
            v-if="isGameRunning || gameState === 'paused'"
            @click="gameManager.stopGame()"
            size="lg"
            color="error"
            variant="outline"
            class="flex-1"
            icon="i-heroicons-stop"
          >
            停止
          </UButton>
        </div>
      </div>

      <!-- 设置和帮助按钮 -->
      <div class="max-w-md mx-auto flex justify-center space-x-4">
        <UButton
          @click="showSettings = true"
          size="lg"
          color="neutral"
          variant="outline"
          icon="i-heroicons-cog-6-tooth"
        >
          设置
        </UButton>
        <UButton
          @click="showHelp = true"
          size="lg"
          color="neutral"
          variant="outline"
          icon="i-heroicons-question-mark-circle"
        >
          帮助
        </UButton>
      </div>
    </footer>

    <!-- 创建角色模态框 -->
    <UModal v-model:open="showCreateCharacter">
      <template #header>
        <h3 class="text-lg font-semibold">创建新角色</h3>
      </template>

      <template #body>
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">角色名称</label>
            <UInput v-model="newCharacter.name" placeholder="输入角色名称" />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">职业</label>
            <USelect
              v-model="newCharacter.class"
              :options="characterClasses"
              placeholder="选择职业"
            />
          </div>
        </div>
      </template>

      <template #footer>
        <div class="flex justify-end space-x-2">
          <UButton @click="showCreateCharacter = false" color="neutral" variant="outline">
            取消
          </UButton>
          <UButton
            @click="createCharacter"
            color="primary"
            :disabled="!newCharacter.name || !newCharacter.class"
          >
            创建
          </UButton>
        </div>
      </template>
    </UModal>

    <!-- 设置模态框 -->
    <UModal v-model:open="showSettings">
      <template #header>
        <h3 class="text-lg font-semibold">设置</h3>
      </template>

      <template #body>
        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <label class="text-sm font-medium text-gray-700">音效</label>
            <UCheckbox v-model="settings.sound" />
          </div>

          <div class="flex items-center justify-between">
            <label class="text-sm font-medium text-gray-700">音乐</label>
            <UCheckbox v-model="settings.music" />
          </div>
        </div>
      </template>

      <template #footer>
        <div class="flex justify-end">
          <UButton @click="showSettings = false" color="primary"> 确定 </UButton>
        </div>
      </template>
    </UModal>

    <!-- 帮助模态框 -->
    <UModal v-model:open="showHelp">
      <template #header>
        <h3 class="text-lg font-semibold">帮助</h3>
      </template>

      <template #body>
        <div class="space-y-4">
          <div>
            <h4 class="font-semibold mb-2">游戏介绍</h4>
            <p class="text-sm text-gray-600">
              Project Idle
              是一款挂机冒险游戏，你可以创建多个角色，通过挂机获得资源，制作装备，提升实力。
            </p>
          </div>

          <div>
            <h4 class="font-semibold mb-2">基本操作</h4>
            <ul class="text-sm text-gray-600 space-y-1">
              <li>• 创建角色开始游戏</li>
              <li>• 选择挂机行动获得资源</li>
              <li>• 制作装备提升能力</li>
              <li>• 与敌人战斗获得奖励</li>
            </ul>
          </div>
        </div>
      </template>

      <template #footer>
        <div class="flex justify-end">
          <UButton @click="showHelp = false" color="primary"> 确定 </UButton>
        </div>
      </template>
    </UModal>
  </div>
</template>

<script setup lang="ts">
// 导入游戏管理器
import { getGameManager, GameState, type GameEventListener, type GameEvent } from '../../core/managers/GameManager'

// 角色接口
interface Character {
  id: string;
  name: string;
  class: string;
  level: number;
  lastLogin: Date;
}

// 响应式数据
const characters = ref<Character[]>([]);
const selectedCharacter = ref<Character | null>(null);
const showCreateCharacter = ref(false);
const showSettings = ref(false);
const showHelp = ref(false);

// 新角色数据
const newCharacter = ref({
  name: "",
  class: "",
});

// 设置数据
const settings = ref({
  sound: true,
  music: true,
});

// 游戏管理器实例
const gameManager = getGameManager();

// 游戏状态
const gameState = ref<GameState>(gameManager.getCurrentState());
const isGameRunning = ref(false);

// 职业选项
const characterClasses = [
  { label: "战士", value: "warrior" },
  { label: "法师", value: "mage" },
  { label: "盗贼", value: "rogue" },
  { label: "牧师", value: "priest" },
];

// 方法
const selectCharacter = (character: Character) => {
  selectedCharacter.value = character;
};

const createCharacter = () => {
  if (!newCharacter.value.name || !newCharacter.value.class) return;

  const character: Character = {
    id: Date.now().toString(),
    name: newCharacter.value.name,
    class: newCharacter.value.class,
    level: 1,
    lastLogin: new Date(),
  };

  characters.value.push(character);
  selectedCharacter.value = character;
  newCharacter.value = { name: "", class: "" };
  showCreateCharacter.value = false;
};

const startGame = () => {
  if (selectedCharacter.value) {
    console.log("开始游戏:", selectedCharacter.value);

    // 启动游戏管理器
    try {
      gameManager.startGame();
      console.log("游戏管理器启动成功");
    } catch (error) {
      console.error("启动游戏失败:", error);
    }
  }
};

const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat("zh-CN", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
};

// 游戏事件监听器
const gameEventListener: GameEventListener = {
  onGameEvent: (event: GameEvent) => {
    console.log('游戏事件:', event);

    // 更新游戏状态
    gameState.value = gameManager.getCurrentState();
    isGameRunning.value = gameManager.isRunning();

    // 处理特定事件
    switch (event.type) {
      case 'GAME_STARTED':
        console.log('游戏已启动!');
        break;
      case 'GAME_PAUSED':
        console.log('游戏已暂停');
        break;
      case 'GAME_RESUMED':
        console.log('游戏已恢复');
        break;
      case 'GAME_STOPPED':
        console.log('游戏已停止');
        break;
      case 'GAME_UPDATE':
        // 游戏循环更新事件（频率较高，可以选择性处理）
        // console.log('游戏更新:', event.data.deltaTime);
        break;
    }
  }
};

// 初始化
onMounted(() => {
  console.log('页面初始化，设置游戏管理器...');

  // 添加游戏事件监听器
  gameManager.addEventListener('GAME_STARTED', gameEventListener);
  gameManager.addEventListener('GAME_PAUSED', gameEventListener);
  gameManager.addEventListener('GAME_RESUMED', gameEventListener);
  gameManager.addEventListener('GAME_STOPPED', gameEventListener);
  gameManager.addEventListener('GAME_UPDATE', gameEventListener);
  gameManager.addEventListener('GAME_STATE_CHANGED', gameEventListener);

  // 初始化游戏状态
  gameState.value = gameManager.getCurrentState();
  isGameRunning.value = gameManager.isRunning();

  console.log('游戏管理器状态:', gameManager.getDebugInfo());

  // TODO: 从本地存储加载角色数据
  // 这里先创建一些示例数据用于测试
  characters.value = [
    {
      id: "1",
      name: "测试角色",
      class: "warrior",
      level: 5,
      lastLogin: new Date(Date.now() - 1000 * 60 * 30), // 30分钟前
    },
  ];
});

// 组件卸载时清理
onUnmounted(() => {
  console.log('页面卸载，清理游戏管理器监听器...');

  // 移除事件监听器
  gameManager.removeEventListener('GAME_STARTED', gameEventListener);
  gameManager.removeEventListener('GAME_PAUSED', gameEventListener);
  gameManager.removeEventListener('GAME_RESUMED', gameEventListener);
  gameManager.removeEventListener('GAME_STOPPED', gameEventListener);
  gameManager.removeEventListener('GAME_UPDATE', gameEventListener);
  gameManager.removeEventListener('GAME_STATE_CHANGED', gameEventListener);

  // 如果游戏在运行，则停止游戏
  if (gameManager.isRunning()) {
    gameManager.stopGame();
  }
});
</script>
