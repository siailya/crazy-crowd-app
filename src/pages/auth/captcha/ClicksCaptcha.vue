<template>
  <div class="speed-meter">
    <h1>ЗАГРУЗКА:</h1>

    <div class="progress-bar">
      <div
        class="progress-fill"
        :style="{ width: progressPct }"
      ></div>
    </div>

    <button
      class="click-btn"
      @click="onClick"
      :disabled="won"
    >
      {{ buttonText }}
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch, defineEmits } from 'vue';

const WINDOW_MS = 10_000;
const REQUIRED_CLICKS = 30;
const DECAY_RATE = 1 / WINDOW_MS;
const CLICK_INCREMENT = 1 / REQUIRED_CLICKS;

const progress = ref(0);
const won = ref(false);
const emit = defineEmits(['save']);

let lastTime = performance.now();
let frameId: number;

function animate(now: number) {
  const dt = now - lastTime;
  lastTime = now;

  if (!won.value) {
    progress.value = Math.max(progress.value - DECAY_RATE * dt, 0);
  }

  frameId = requestAnimationFrame(animate);
}

function onClick() {
  if (won.value) return;
  progress.value = Math.min(progress.value + CLICK_INCREMENT, 1);
}

watch(progress, (val) => {
  if (val >= 1 && !won.value) {
    progress.value = 1;
    won.value = true;
    emit('save');
  }
});

onMounted(() => {
  lastTime = performance.now();
  frameId = requestAnimationFrame(animate);
});

onUnmounted(() => {
  cancelAnimationFrame(frameId);
});

const progressPct = computed(() => `${(progress.value * 100).toFixed(1)}%`);

const buttonText = computed(() => {
  if (won.value) return 'Загружено';
  const p = progress.value;
  if (p < 0.01) return 'Кликай';
  if (p < 0.5) return 'Кликай быстрее';
  if (p < 0.75) return 'ЖМИ БЫСТРЕЕ! ТАПАЙ!!!';
  return 'ДАВАВАВАВАААЙ ТЫ СМОЖЕШЬ!!!!';
});
</script>

<style scoped>
.speed-meter {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  max-width: 400px;
  margin: 0 auto;
  user-select: none;
}

.progress-bar {
  width: 100%;
  height: 20px;
  background: #eee;
  border-radius: 10px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: #409eff;
  width: 0;
  transition: width 0.1s linear;
}

.click-btn {
  padding: 12px 24px;
  font-size: 16px;
  background: #409eff;
  color: #fff;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  outline: none;
  user-select: none;
  transition: transform 0.1s;
}
.click-btn:disabled {
  background: #a0cfff;
  cursor: default;
}
.click-btn:active:not(:disabled) {
  transform: scale(0.97);
}
</style>
