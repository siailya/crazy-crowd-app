<template>
  <div style="max-width: 320px; margin: 0 auto; padding: 32px 0;">
    <n-form>
      <n-form-item label="Логин">
        <n-input
          v-model:value="username"
          type="password"
          placeholder="Введите логин"
        />
      </n-form-item>
      <n-form-item label="Пароль">
        <n-input
          v-model:value="password"
          type="password"
          placeholder="Введите пароль"
        />
      </n-form-item>
      <n-button 
        type="primary" 
        block 
        @click="onLogin"
      >
        Войти
      </n-button>
      
      <n-gradient-text type="danger">
        {{ isError ? 'Неверный логин или пароль' : '' }}
      </n-gradient-text>
    </n-form>

    <n-modal
      v-model:show="showModal"
      :closable="false"
      :mask-closable="false"
    >
      <n-card
        style="width: 600px"
        title="Modal"
        :bordered="false"
        size="huge"
        role="dialog"
        aria-modal="true"
      >
        <template #header-extra>
          Oops!
        </template>
        <div style="text-align: center;">
          <img
            src="https://finstarbank.ru/public/images/ckfinder/images/Burger-King.jpg"
            alt="modal image"
            style="max-width: 100%; max-height: 300px; margin-bottom: 16px;"
          />
        </div>
        Content
        <template #footer>
          <n-button
            :disabled="!canCloseModal"
            @click="closeModal"
          >
            {{ canCloseModal ? 'Закрыть' : 'Подождите 5 секунд...' }}
          </n-button>
          <button
            style="background-color: red; font-size: 32px; font-weight: 600"
            v-if="!isError"
            @click="router.push('/home')"
          >
            ВОЙТИ
          </button>
          <n-button
            size="large"
            type="error"
            @click="router.push('/auth/register')"
          >
            РЕГИСТРАЦИЯ ТУТ
          </n-button>
        </template>
      </n-card>
    </n-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { NForm, NFormItem, NInput, NButton } from 'naive-ui';
import { useRootStore } from '@/shared/model/store/useRootStore';
import { useRouter } from 'vue-router';

const rootStore = useRootStore();
const router = useRouter();

const username = ref('');
const password = ref('');

const showModal = ref(false);
const isError = ref(false);
const canCloseModal = ref(true);

onMounted(() => {
  rootStore.initUsers();
});

function openModal() {
  showModal.value = true;
  canCloseModal.value = false;
  setTimeout(() => {
    canCloseModal.value = true;
  }, 5000);
}

function closeModal() {
  if (canCloseModal.value) {
    showModal.value = false;
  }
}

function onLogin() {
  openModal();
  if (rootStore.checkUser(username.value, password.value)) {
    rootStore.login();
    isError.value = false;
  } else {
    isError.value = true;
  }
}
</script>

<style scoped>

</style>