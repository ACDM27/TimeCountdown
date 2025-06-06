<script>
export default {
  name: 'TimerView',
  // ... existing code ...
}
</script>
<template>
    <div class="timer-container">
      <!-- 模式切换 -->
      <div class="mode-switch">
        <button 
          @click="switchMode('stopwatch')" 
          :class="{ active: mode === 'stopwatch' }">
          计时器
        </button>
        <button 
          @click="switchMode('countdown')" 
          :class="{ active: mode === 'countdown' }">
          倒计时
        </button>
      </div>
  
      <!-- 计时器显示 -->
      <div class="time-display">
        {{ formattedTime }}
      </div>
  
      <!-- 控制按钮 -->
      <div class="controls">
        <template v-if="mode === 'stopwatch'">
          <button @click="startStopwatch" :disabled="isRunning">开始</button>
          <button @click="pauseTimer" :disabled="!isRunning">暂停</button>
          <button @click="resetTimer">重置</button>
        </template>
  
        <template v-else>
          <div class="time-inputs">
            <input type="number" v-model="inputHours" min="0" placeholder="时" />
            <span>:</span>
            <input type="number" v-model="inputMinutes" min="0" max="59" placeholder="分" />
            <span>:</span>
            <input type="number" v-model="inputSeconds" min="0" max="59" placeholder="秒" />
          </div>
          <button 
            @click="startCountdown" 
            :disabled="!isCountdownSet || isRunning">
            {{ isRunning ? "运行中" : "开始倒计时" }}
          </button>
          <button @click="resetTimer" :disabled="!isRunning">重置</button>
        </template>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, computed, onBeforeUnmount } from "vue";
  
  // 状态管理
  const mode = ref("stopwatch"); // 'stopwatch' | 'countdown'
  const isRunning = ref(false);
  const elapsedTime = ref(0); // 毫秒
  const timerId = ref(null);
  
  // 倒计时相关
  const inputHours = ref(0);
  const inputMinutes = ref(0);
  const inputSeconds = ref(0);
  const remainingTime = ref(0);
  
  // 计算属性
  const isCountdownSet = computed(() => {
    return (
      inputHours.value > 0 || inputMinutes.value > 0 || inputSeconds.value > 0
    );
  });
  
  const formattedTime = computed(() => {
    if (mode.value === "stopwatch") {
      const totalSeconds = Math.floor(elapsedTime.value / 1000);
      const hours = Math.floor(totalSeconds / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      const seconds = totalSeconds % 60;
      return `${padZero(hours)}:${padZero(minutes)}:${padZero(seconds)}`;
    } else {
      const totalSeconds = Math.floor(remainingTime.value / 1000);
      const hours = Math.floor(totalSeconds / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      const seconds = totalSeconds % 60;
      return `${padZero(hours)}:${padZero(minutes)}:${padZero(seconds)}`;
    }
  });
  
  // 辅助函数
  const padZero = (num) => num.toString().padStart(2, "0");
  
  // 计时器功能
  const startStopwatch = () => {
    if (isRunning.value) return;
    isRunning.value = true;
    const startTime = Date.now() - elapsedTime.value;
    
    timerId.value = setInterval(() => {
      elapsedTime.value = Date.now() - startTime;
    }, 100);
  };
  
  // 倒计时功能
  const startCountdown = () => {
    if (isRunning.value || !isCountdownSet.value) return;
    
    isRunning.value = true;
    remainingTime.value = 
      (inputHours.value * 3600 + 
       inputMinutes.value * 60 + 
       inputSeconds.value) * 1000;
    
    timerId.value = setInterval(() => {
      remainingTime.value -= 1000;
      if (remainingTime.value <= 0) {
        clearInterval(timerId.value);
        isRunning.value = false;
        remainingTime.value = 0;
        alert("倒计时结束！");
      }
    }, 1000);
  };
  
  // 通用控制
  const pauseTimer = () => {
    clearInterval(timerId.value);
    isRunning.value = false;
  };
  
  const resetTimer = () => {
    clearInterval(timerId.value);
    isRunning.value = false;
    elapsedTime.value = 0;
    remainingTime.value = 0;
    inputHours.value = 0;
    inputMinutes.value = 0;
    inputSeconds.value = 0;
  };
  
  const switchMode = (newMode) => {
    if (isRunning.value) {
      if (!confirm("切换模式将重置计时器，是否继续？")) return;
      resetTimer();
    }
    mode.value = newMode;
  };
  
  // 清理定时器
  onBeforeUnmount(() => {
    clearInterval(timerId.value);
  });
  </script>
  
  <style scoped>
  .timer-container {
    max-width: 400px;
    margin: 0 auto;
    padding: 20px;
    text-align: center;
    border-radius: 10px;
    background-color: #f5f5f5;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  }
  
  .mode-switch {
    margin-bottom: 20px;
  }
  
  .mode-switch button {
    padding: 8px 16px;
    margin: 0 5px;
    background: #e0e0e0;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }
  
  .mode-switch button.active {
    background: #42b983;
    color: white;
  }
  
  .time-display {
    font-size: 3em;
    font-family: monospace;
    margin: 20px 0;
  }
  
  .controls {
    margin-top: 20px;
  }
  
  .controls button {
    padding: 10px 20px;
    margin: 0 5px;
    background: #42b983;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }
  
  .controls button:disabled {
    background: #cccccc;
    cursor: not-allowed;
  }
  
  .time-inputs {
    margin-bottom: 15px;
  }
  
  .time-inputs input {
    width: 50px;
    padding: 8px;
    text-align: center;
    border: 1px solid #ddd;
    border-radius: 4px;
  }
  
  .time-inputs span {
    margin: 0 5px;
  }
  </style>