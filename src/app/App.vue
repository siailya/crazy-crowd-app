<template>
  <n-config-provider
    :date-locale="dateRuRU"
    :locale="ruRU"
    :theme="appTheme"
  >
    <transition
      mode="out-in"
      name="fade"
    >
      <component :is="layout">
        <n-dialog-provider>
          <n-message-provider>
            <router-view v-slot="{ Component }">
              <transition
                mode="out-in"
                name="fade"
              >
                <component :is="Component" />
              </transition>
            </router-view>
          </n-message-provider>
        </n-dialog-provider>
      </component>
    </transition>
  </n-config-provider>
</template>

<script lang="ts" setup>
import { type Component as VueComponent, computed } from 'vue';
import { useRoute } from 'vue-router';
import { darkTheme, dateRuRU, lightTheme, ruRU } from 'naive-ui';

import EmptyLayout from '@shared/ui/layout/TheEmptyLayout.vue';
import { useRootStore } from '@shared/model/store/useRootStore';

const route = useRoute();
const root = useRootStore();
root.initTheme();

const layout = computed(() => {
  return (route.meta?.layout as VueComponent) ?? EmptyLayout;
});

const appTheme = computed(() => {
  return root.theme === 'light' ? lightTheme : darkTheme;
});
</script>

<style></style>
