<template>
  <n-modal
    :show="isSheepsActive"
    :closable="false"
    :mask-closable="false"
  >
    <div
      class="game-container"
      style="background-color: yellow"
    >
      <div class="counter">
        Поймай овцу (проверка что вы еще не уснули)
        <br>
        Счёт: {{ score }} / {{ targetScore }}
      </div>

      <div
        class="field"
        ref="fieldRef"
      >
        <div
          v-for="sheep in sheepList"
          :key="sheep.id"
          class="sheep"
          :class="{ awake: sheep.awake }"
          :style="{
            top: sheep.y + 'px',
            left: sheep.x + 'px',
            width: sheepSize + 'px',
            height: sheepSize + 'px'
          }"
          @click="onSheepClick(sheep)"
        ></div>

        <div
          v-if="gameOver"
          class="overlay"
        >
          <div class="message">
            Овца поймана 🥳🤙

            <span @click="isSheepsActive = false">завершить</span>
          </div>
        </div>
      </div>
    </div>
  </n-modal>

</template>

<script setup lang="ts">
import {defineEmits, defineProps, onMounted, ref} from 'vue';

const {disable} = defineProps<{
  disable?: boolean;
}>();


const totalSheep = 21;
const targetScore = 20;
const sheepSize = 60;
const padding = 10;
const isSheepsActive = ref(true);

interface Sheep {
  id: number
  awake: boolean
  x: number
  y: number
}

const score = ref(0);
const sheepList = ref<Sheep[]>([]);
const gameOver = ref(false);
const fieldRef = ref<HTMLElement | null>(null);


function randomPosition(fieldWidth: number, fieldHeight: number) {
  const x = Math.random() * (fieldWidth - sheepSize - padding * 2) + padding;
  const y = Math.random() * (fieldHeight - sheepSize - padding * 2) + padding;
  return {x, y};
}

function resetSheep() {
  const field = fieldRef.value!;
  const {width, height} = field.getBoundingClientRect();
  const newList: Sheep[] = [];

  for (let i = 0; i < totalSheep - 1; i++) {
    const {x, y} = randomPosition(width, height);
    newList.push({id: i, awake: false, x, y});
  }
  const {x, y} = randomPosition(width, height);
  newList.push({id: totalSheep - 1, awake: true, x, y});

  sheepList.value = newList.sort(() => Math.random() - 0.5);
}

const emit = defineEmits(["save"]);

function onSheepClick(sheep: Sheep) {
  if (gameOver.value) return;

  if (sheep.awake) {
    score.value++;
    if (score.value >= targetScore) {
      gameOver.value = true;
      emit("save");
    } else {
      resetSheep();
    }
  }
}

onMounted(() => {
  if (disable) {
    isSheepsActive.value = false;
  }
  resetSheep();
});
</script>

<style scoped>
.game-container {
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
  user-select: none;
}

.counter {
  text-align: center;
  font-size: 1.2rem;
  margin-bottom: 8px;
}

.field {
  position: relative;
  width: 100%;
  height: 400px;
  border: 2px solid #ccc;
  border-radius: 8px;
  overflow: hidden;
}

.sheep {
  position: absolute;
  background-size: cover;
  cursor: pointer;
  transition: transform 0.1s;
}

.sheep:hover {
  transform: scale(1.1);
}

.sheep:not(.awake) {
  background-image: url('./assets/sheep-sleeping.png');
}

.sheep.awake {
  background-image: url('./assets/sheep-awake.png');
  z-index: 100;

}

.sheep.awake:hover {
  outline: 2px solid #ff0;
}

.overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.message {
  background: #fff;
  padding: 24px 32px;
  border-radius: 8px;
  font-size: 1.5rem;
  color: #333;
}
</style>
