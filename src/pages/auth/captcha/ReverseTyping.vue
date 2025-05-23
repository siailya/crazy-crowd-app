<template>
  <captcha-card title="Введите слово в обратном порядке">
    <template #default>
      <div class="space-y-4">
        <p>Слово: <strong style="font-size: 32px; font-family: Serif">{{ word }}</strong></p>

        <p>До смены слова: <strong>{{ countdown }}</strong> с</p>

        <p>Осталось символов: {{ remaining }}</p>

        <n-input
          v-model:value="input"
          :disabled="disableComputed"
          :maxlength="reversed.length"
          :pattern="pattern"
          aria-label="Обратный ввод слова"
          :aria-invalid="!!error"
          aria-describedby="error-msg"
          @input="onInput"
          class="w-full"
        />

        <n-button
          @click="check"
          :disabled="disableComputed || remaining > 0"
          :aria-disabled="disableComputed || remaining > 0"
        >
          Проверить
        </n-button>

        <div
          v-if="error"
          id="error-msg"
          class="text-error"
        >
          {{ error }}
        </div>

        <div
          v-if="disableComputed"
          style="font-size: 32px; color: blueviolet; background-color: red"
        >
          Капча пройдена
        </div>
      </div>
    </template>
  </captcha-card>
</template>

<script setup lang="ts">
import {computed, onMounted, onUnmounted, ref, watch} from 'vue';
import CaptchaCard from '@/pages/auth/captcha/CaptchaCard.vue';

const props = defineProps<{
  disable?: boolean
  targetWord?: string
}>();
const emit = defineEmits<{
  (e: 'save', payload: { target: string; input: string }): void
}>();

// ODNETNIN
// VEHCABROG
// DLROWOLLEH
const DICT = ['GORBACHEV', 'NINTENDO', 'TELEPHONE', 'HELLO', 'MARCH'];

function getRandomWord(): string {
  const i = Math.floor(Math.random() * DICT.length);
  return DICT[i];
}

const word = ref('');
const input = ref('');
const error = ref('');
const countdown = ref(10);

let timerId: number | null = null;

const reversed = computed(() => word.value.split('').reverse().join(''));
const remaining = computed(() => reversed.value.length - input.value.length);
const solved = computed(() => input.value === reversed.value);
const disableComputed = computed(() => props.disable || solved.value);

const pattern = computed(() => {
  const isLatin = /^[A-Za-z]+$/.test(word.value);
  return isLatin ? '[A-Za-z]+' : '[А-ЯЁ]+';
});

function reset() {
  word.value = props.targetWord?.toUpperCase() || getRandomWord();
  input.value = '';
  error.value = '';
  countdown.value = 10;
}

function onInput(val: string) {
  error.value = '';
  for (let i = 0; i < val.length; i++) {
    if (val[i] !== reversed.value[i]) {
      error.value = `Неверный символ на позиции ${i + 1}`;
      break;
    }
  }
  input.value = val;
}

function check() {
  error.value = '';
  if (input.value !== reversed.value) {
    for (let i = 0; i < input.value.length; i++) {
      if (input.value[i] !== reversed.value[i]) {
        error.value = `Ошибка на позиции ${i + 1}`;
        break;
      }
    }
  }
}

watch(solved, (ok) => {
  if (ok) {
    emit('save', {target: word.value, input: input.value});
  }
});

function startTimer() {
  timerId = window.setInterval(() => {
    if (disableComputed.value) {
      // При окончании/отключении прекращаем таймер
      stopTimer();
      return;
    }
    countdown.value--;
    if (countdown.value <= 0) {
      reset();
    }
  }, 1000);
}

function stopTimer() {
  if (timerId !== null) {
    clearInterval(timerId);
    timerId = null;
  }
}

onMounted(() => {
  reset();
  startTimer();
});

onUnmounted(() => {
  stopTimer();
});

watch(
  () => props.targetWord,
  () => {
    reset();
  }
);
</script>
