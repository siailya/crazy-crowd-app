<template>
  <captcha-card title="Испытание цветовосприятия">
    <p class="hint"><span style="color: red">НЕОБХОДИМА ПРОВЕРКА</span> Сопоставьте круги. Сначала выберите цвет, потом
      нажмите на нужный круг</p>

    <div class="circles">
      <div
        v-for="color in colors"
        :key="color"
        class="circle"
        :style="{ backgroundColor: color }"
        tabindex="0"
        @click="onCircleClick(color)"
      >
        <span
          v-if="matches[color]"
          class="label-under-circle"
        >
          {{ matches[color] }}
        </span>
      </div>
    </div>

    <div class="labels">
      <n-tag
        v-for="label in labels"
        :key="label"
        size="small"
        :draggable="!disable && !isMatched(label)"
        :class="{ selected: selectedLabel === label, disabled: disable || isMatched(label) }"
        @click="onLabelClick(label)"
      >
        {{ label }}
      </n-tag>
    </div>

    <p class="counter">{{ matchesCount }}/6</p>

    <p
      v-if="disable"
      class="completed"
      style="color: #28a745; font-size: 48px"
    >Спасибо, испытание пройдено!</p>
  </captcha-card>
</template>

<script setup lang="ts">
import {computed, onMounted, ref, watch} from 'vue';
import {useMessage} from 'naive-ui';
import CaptchaCard from "@/pages/auth/captcha/CaptchaCard.vue";

interface Props {
  disable?: boolean
  palette?: string[]
}

const props = defineProps<Props>();
const emit = defineEmits<{
  (e: 'save', result: Record<string, string>): void
}>();

const message = useMessage();

const defaultPalette = [
  '#ff0000',
  '#00a000',
  '#0000ff',
  '#ffff00',
  '#ffa500',
  '#800080'
];
const nameMap: Record<string, string> = {
  '#ff0000': 'Красный',
  '#00a000': 'Зелёный',
  '#0000ff': 'Синий',
  '#ffff00': 'Жёлтый',
  '#ffa500': 'Оранжевый',
  '#800080': 'Фиолетовый'
};

/** Fisher–Yates shuffle **/
function shuffle<T>(array: T[]): T[] {
  const a = array.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const colors = ref<string[]>([]);
const labels = ref<string[]>([]);
const matches = ref<Record<string, string>>({});
const selectedLabel = ref<string | null>(null);
let hasEmitted = false;

const matchesCount = computed(() => Object.keys(matches.value).length);
const solved = computed(() => matchesCount.value === 6);

onMounted(() => {
  const palette = props.palette && props.palette.length === 6
    ? props.palette
    : defaultPalette;
  colors.value = shuffle(palette);
  labels.value = shuffle(palette.map(c => nameMap[c]));
});

function isMatched(label: string) {
  return Object.values(matches.value).includes(label);
}

function onLabelClick(label: string) {
  if (props.disable || isMatched(label)) return;
  selectedLabel.value = selectedLabel.value === label ? null : label;
}

function onCircleClick(color: string) {
  if (props.disable || !selectedLabel.value) return;
  const label = selectedLabel.value;
  if (label.toLowerCase() === nameMap[color].toLowerCase()) {
    matches.value = {...matches.value, [color]: label};
  } else {
    message.error('Не тот цвет!');
  }
  selectedLabel.value = null;
}

watch(solved, (newVal) => {
  if (newVal && !hasEmitted) {
    console.log("solved");
    emit('save', matches.value);
    hasEmitted = true;
  }
});
</script>

<style scoped>
.circles {
  display: flex;
  gap: 12px;
  justify-content: center;
  margin: 16px 0;
}

.circle {
  width: 70px;
  height: 70px;
  border-radius: 50%;
  position: relative;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  cursor: pointer;
}

.label-under-circle {
  background: rgba(255, 255, 255, 0.8);
  padding: 2px 4px;
  border-radius: 4px;
  font-size: 12px;
  margin-bottom: 4px;
}

.labels {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  justify-content: center;
  margin: 12px 0;
}

.n-tag {
  cursor: grab;
}

.n-tag.disabled {
  cursor: default;
  pointer-events: none;
  opacity: 0.5;
}

.n-tag.selected {
  border: 2px solid #409eff;
}

.hint {
  font-size: 14px;
  color: #666;
  text-align: center;
  margin: 8px 0;
}

.counter {
  text-align: center;
  margin: 8px 0;
  font-weight: bold;
}

.completed {
  text-align: center;
  margin-top: 16px;
  font-size: 16px;
  color: #28a745;
}
</style>
