<template>
  <n-form
    ref="formRef"
    :model="form"
    status-icon
  >
    <n-form-item
      label="Логин"
      path="username"
      :rule="usernameRules"
    >
      <div class="w-full">
        <n-input
          v-model:value="form.username"
          @input="onUsernameInput"
        />
        <div class="hints">
          <div :class="{ ok: checks.usernameLength }">От 3 до 20 символов</div>
          <div :class="{ ok: checks.usernameChars }">
            Латинские буквы, цифры, _.@-
          </div>
        </div>
      </div>
    </n-form-item>

    <n-form-item
      label="Пароль"
      path="password"
      :rule="passwordRules"
    >
      <div class="w-full">
        <n-input
          v-model:value="form.password"
          type="password"
          @input="onPasswordInput"
        />
        <div class="hints">
          <div :class="{ ok: checks.pwLength }">Не менее 8 символов</div>
          <div :class="{ ok: checks.pwUpper }">Есть заглавная</div>
          <div :class="{ ok: checks.pwLower }">Есть строчная</div>
          <div :class="{ ok: checks.pwDigit }">Есть цифра</div>
          <div :class="{ ok: checks.pwSpecial }">Есть спецсимвол</div>
        </div>
      </div>
    </n-form-item>
  </n-form>
</template>

<script setup lang="ts">
import {computed, defineEmits, defineProps, reactive, ref, watch} from 'vue';
import type {FormInst} from 'naive-ui';

const props = defineProps({
  username: {type: String, default: ''},
  password: {type: String, default: ''}
});
const emit = defineEmits<{
  (e: 'update:username', v: string): void
  (e: 'update:password', v: string): void
  (e: 'valid'): void
}>();

const formRef = ref<FormInst>();
const form = reactive({
  username: props.username,
  password: props.password
});

watch(() => props.username, v => form.username = v);
watch(() => props.password, v => form.password = v);

const checks = reactive({
  usernameLength: false,
  usernameChars: false,
  pwLength: false,
  pwUpper: false,
  pwLower: false,
  pwDigit: false,
  pwSpecial: false
});

const usernameRules = [
  {validator: () => checks.usernameLength, message: 'Неверная длина'},
  {validator: () => checks.usernameChars, message: 'Недопустимые символы'}
];
const passwordRules = [
  {validator: () => checks.pwLength, message: 'Минимум 8 символов'},
  {validator: () => checks.pwUpper, message: 'Нет заглавной буквы'},
  {validator: () => checks.pwLower, message: 'Нет строчной буквы'},
  {validator: () => checks.pwDigit, message: 'Нет цифры'},
  {validator: () => checks.pwSpecial, message: 'Нет спецсимвола'}
];

function validateUsername() {
  const u = form.username;
  checks.usernameLength = u.length >= 3 && u.length <= 20;
  checks.usernameChars = /^[A-Za-z0-9_.@-]+$/.test(u);
}

function validatePassword() {
  const p = form.password;
  checks.pwLength = p.length >= 8;
  checks.pwUpper = /[A-Z]/.test(p);
  checks.pwLower = /[a-z]/.test(p);
  checks.pwDigit = /\d/.test(p);
  checks.pwSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(p);
}

function onUsernameInput() {
  validateUsername();
  emit('update:username', form.username);
}

function onPasswordInput() {
  validatePassword();
  emit('update:password', form.password);
}

const allValid = computed(
  () =>
    checks.usernameLength &&
        checks.usernameChars &&
        checks.pwLength &&
        checks.pwUpper &&
        checks.pwLower &&
        checks.pwDigit &&
        checks.pwSpecial
);

watch(allValid, valid => {
  if (valid) emit('valid');
});
</script>

<style scoped>
.hints {
  margin-top: 4px;
  font-size: 12px;
  color: #999;
}

.hints .ok {
  color: #3adb76;
}
</style>
