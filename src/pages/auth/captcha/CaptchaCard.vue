<template>
  <div>
    <h2 class="mb-2 p-0">
      {{ title }}
    </h2>

    <div>
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import {defineProps} from 'vue';

const {title} = defineProps<{
  title: string;
}>();
</script>
