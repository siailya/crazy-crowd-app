<template>
  <div>
    <n-card style="width: 600px; margin: 0 auto">
      <div style="text-align: center; margin-bottom: 16px; font-size: 52px;">
        Регистрация очень простая она не займет много времени!
      </div>

      <register-form
        v-model:username="username"
        v-model:password="password"
        @valid="onValidRegForm"
      />

      <generate-avatar
        v-if="step >= 1"
        @save="onClickSaveAvatar"
        :disable="!!state.avatar"
      />
      {{ state.avatar }}

      <colors-captcha
        v-if="step >= 2"
        @save="onColorsSolved"
        :disable="!!state.colors"
      />

      <reverse-typing
        v-if="step >= 3"
        @save="onReverseSolved"
        :disable="state.reverse"
      />

      <sheeps-capthca
        v-if="step >= 4"
        @save="onSheepsSolved"
        :disable="state.sheeps"
      />
      <ads-popup v-if="step >= 4 && step <= 7"/>

      <pay-capthca
        v-if="step >= 5"
        @save="onPaySolved"
        :disable="!!state.pay"
      />

      <clicks-captcha
        v-if="step >= 6"
        @save="onClicksSolved"
        :disable="!!state.clicks"
      />

      <n-button
        v-if="step < 7"
        type="primary"
        :disabled="isRegisterDisabled"
        @click="step < 6 ? onClickRegister() : onClickFinalRegister()"
      >
        {{
          step < 1
            ? 'Зарегистрироваться'
            : step < 6
              ? 'Продолжить регистрацию'
              : 'Завершить регистрацию'
        }}
      </n-button>
      <n-button
        v-else
        type="primary"
        @click="goToLogin"
      >
        На вход
      </n-button>
    </n-card>

    <n-modal
      v-model:show="showWait"
      :mask-closable="false"
      :closable="false"
      preset="card"
      style="width: 400px; text-align: center;"
    >
      <template #default>
        <div v-if="remaining > 0">
          Подождите ещё {{ minutes }}:{{ seconds }} перед входом.
          <br>
          <span style="font-size: 24px">Мы очень тщательно проверяем данные каждого пользователя. Спасибо что вы с нами</span>\
          <br>
          <n-button @click="onClickWait">
            ЖДАТЬ
          </n-button>
        </div>
        <div v-else>
          <n-button
            type="primary"
            @click="goToLogin"
          >
            На вход
          </n-button>
        </div>
      </template>
    </n-modal>

    <teleport to="body">
      <div
        style="position: fixed; top: 30px; right: 30px"
        v-if="step >= 2"
      >
        <n-popover
          :show="showPopover"
          placement="bottom"
          trigger="manual"
          @update:show="handleUpdateShow"
        >
          <template #trigger>
            <n-button @click="crazyFilters.applyFilters(); showPopover = false">
              СМЕНИТЬ ТЕМУ
            </n-button>
          </template>

          <div
            style="max-width: 150px; background-color: red;transform-origin: inherit; font-size: 28px; color: white"
          >
            NEW: СМЕНИТЕ ТЕМУ ЕСЛИ ПЛОХО ВИДНО!
          </div>
        </n-popover>
      </div>
    </teleport>
  </div>
</template>

<script setup lang="ts">
import {computed, nextTick, onMounted, onUnmounted, reactive, ref, watch} from 'vue';
import {useRouter} from 'vue-router';
import GenerateAvatar from '@/pages/auth/captcha/GenerateAvatar.vue';
import ColorsCaptcha from '@/pages/auth/captcha/ColorsCaptcha.vue';
import ReverseTyping from '@/pages/auth/captcha/ReverseTyping.vue';
import SheepsCapthca from '@/pages/auth/captcha/SheepsCapthca.vue';
import PayCapthca from '@/pages/auth/captcha/PayCapthca.vue';
import ClicksCaptcha from '@/pages/auth/captcha/ClicksCaptcha.vue';
import AdsPopup from '@/pages/auth/captcha/AdsPopup.vue';
import RegisterForm from '@/pages/auth/RegisterForm.vue';
import {useCrazyFilters} from '@shared/ui/useCrazyFilters';
import {useMessage} from 'naive-ui';

const router = useRouter();
const STORAGE_KEY = 'registerState';
const crazyFilters = useCrazyFilters();

const username = ref('');
const password = ref('');
const step = ref(0);
const state = reactive({
  regform: false,
  avatar: null as string | null,
  colors: false,
  reverse: false,
  sheeps: false,
  pay: false,
  clicks: false
});
const countdownEnd = ref<number | null>(null);
const showWait = ref(false);
const now = ref(Date.now());
let timer: ReturnType<typeof setInterval> | null = null;

function loadState() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    const obj = JSON.parse(saved);
    username.value = obj.username || '';
    password.value = obj.password || '';
    step.value = obj.step || 0;
    Object.assign(state, obj.state || {});
    countdownEnd.value = obj.countdownEnd || null;
    if (step.value === 7 && countdownEnd.value! > Date.now()) {
      showWait.value = true;
    }
  }
}

function saveState() {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({
      username: username.value,
      password: password.value,
      step: step.value,
      state: state,
      countdownEnd: countdownEnd.value
    })
  );
}

loadState();
watch(
  [
    username,
    password,
    step,
    () => state.regform,
    () => state.avatar,
    () => state.colors,
    () => state.reverse,
    () => state.sheeps,
    () => state.pay,
    () => state.clicks,
    countdownEnd
  ],
  saveState,
  {deep: true}
);

const isRegisterDisabled = computed(() => {
  if (step.value === 0) return !state.regform;
  const keys: (keyof typeof state)[] = [
    'avatar',
    'colors',
    'reverse',
    'sheeps',
    'pay',
    'clicks'
  ];
  return !state[keys[step.value - 1]];
});

function onValidRegForm() {
  state.regform = true;
}

function onClickRegister() {
  step.value++;
}

function onClickSaveAvatar(avatar: string) {
  state.avatar = avatar;
  crazyFilters.applyFilters();
}

function onColorsSolved() {
  state.colors = true;
  crazyFilters.enableCrazyFilters();
}

function onReverseSolved() {
  state.reverse = true;
  crazyFilters.applyFilters();
}

function onSheepsSolved() {
  state.sheeps = true;
  crazyFilters.applyFilters();
}

function onPaySolved() {
  state.pay = true;
  crazyFilters.applyFilters();
}

function onClicksSolved() {
  state.clicks = true;
  crazyFilters.applyFilters();
}

function onClickFinalRegister() {
  const users = JSON.parse(localStorage.getItem('users') || '[]');
  users.push({username: username.value, password: password.value});
  localStorage.setItem('users', JSON.stringify(users));
  step.value = 7;
  countdownEnd.value = Date.now() + 5 * 60 * 1000;
  showWait.value = true;
  nextTick(() => window.location.reload());
}

const remaining = computed(() => {
  if (!countdownEnd.value) return 0;
  const diff = countdownEnd.value - now.value;
  return diff > 0 ? diff : 0;
});
const minutes = computed(() =>
  String(Math.floor(remaining.value / 60000)).padStart(2, '0')
);
const seconds = computed(() =>
  String(Math.floor((remaining.value % 60000) / 1000)).padStart(2, '0')
);

const showPopover = ref(true);
const handleUpdateShow = () => {
  showPopover.value = !showPopover.value;
};

onMounted(() => {
  timer = setInterval(() => {
    now.value = Date.now();
    if (remaining.value <= 0 && timer) {
      clearInterval(timer);
      timer = null;
    }
  }, 1000);

  if (step.value >= 2) {
    crazyFilters.enableCrazyFilters();
    crazyFilters.applyFilters();
    showPopover.value = true;
  }
});

onUnmounted(() => {
  if (timer) clearInterval(timer);
});

function clearState() {
  localStorage.removeItem(STORAGE_KEY);
}

const m = useMessage();

const onClickWait = () => {
  m.info("Спасибо что ждете!");
};

function goToLogin() {
  clearState();
  showWait.value = false;
  router.push('/auth/login');
}
</script>