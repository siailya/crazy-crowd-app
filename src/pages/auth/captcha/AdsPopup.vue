<template>
  <div>
    <n-button @click="showAdManually">Показать рекламу</n-button>

    <n-modal
      v-model:show="show"
      :closable="closable"
      :esc-to-close="false"
      :mask-closable="false"
      class="ad-modal"
      :class="modalAnimClass"
      preset="card"
      style="max-width: 360px"
    >
      <template #header>
        <h3 :class="headerAnimClass">{{ variant.title }}</h3>
      </template>

      <template #default>
        <p :class="textAnimClass">{{ variant.message }}</p>
        <img
          v-if="variant.image"
          :src="variant.image"
          alt="Ad image"
          class="ad-image"
          :class="imageAnimClass"
        />
      </template>

      <template #footer>
        <n-button
          v-if="closable"
          @click="closeAd"
          class="ad-close-btn"
        >
          Закрыть
        </n-button>
        <n-button
          v-else
          disabled
          class="ad-wait-btn"
        >
          Подождите...
        </n-button>
      </template>
    </n-modal>
  </div>
</template>

<script setup lang="ts">
import {onMounted, onUnmounted, ref} from 'vue';
import {NButton, NModal} from 'naive-ui';

interface AdVariant {
  title: string
  message: string
  image?: string
  link?: { url: string; text: string }
}

const variants: AdVariant[] = [
  {
    title: 'Успей сейчас!',
    message: 'Скидка 50% на все товары только сегодня!',
    image: 'https://fairless.ru/uploads/ygbp_creative_94e14d41d84361f4c0c58093eb626320_1_93bcc84638.jpg'
  },
  {
    title: 'Не пропусти!',
    message: 'Новинки уже в продаже. Жми на картинку и узнай больше.',
    image: 'https://basket-19.wbbasket.ru/vol3055/part305518/305518273/images/big/1.webp'
  },
  {
    title: 'Специальное предложение',
    message: 'Подарок при оформлении заказа от 1000 ₽',
    image: 'https://storage01.sb.by/iblock/9e4/9e446db5c3ff1d07ee973a4171be72ec/8c033b2ea34b18b8122f7ce015ba4eb0.jpg'
  },
  {
    title: 'Только до полуночи!',
    message: 'Успей оформить заказ со скидкой 💥'
  },
  {
    title: '🎉 Бесплатная доставка!',
    message: 'По промокоду FREESHIP — уже действует!',
    image: 'https://static.insales-cdn.com/files/1/7651/3136995/original/%D0%B1%D0%B5%D1%81%D0%BF%D0%BB%D0%B0%D1%82%D0%BD%D0%B0%D1%8F_%D0%B4%D0%BE%D1%81%D1%82%D0%B0%D0%B2%D0%BA%D0%B0.jpg'
  }
];

const animations = ['shake', 'pulse', 'bounce', 'hue-shift', 'gradient-bg'];

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

const show = ref(false);
const closable = ref(false);
const variant = ref<AdVariant>(pickRandom(variants));

const modalAnimClass = ref('');
const headerAnimClass = ref('');
const textAnimClass = ref('');
const imageAnimClass = ref('');

let nextTimeout: ReturnType<typeof setTimeout> | null = null;
let enableCloseTimeout: ReturnType<typeof setTimeout> | null = null;

function scheduleNext() {
  const delay = Math.floor(Math.random() * 12000) + 8000;
  console.log("next ads in", delay);
  nextTimeout = setTimeout(() => {
    showAd();
    scheduleNext();
  }, delay);
}

function showAd() {
  variant.value = pickRandom(variants);
  modalAnimClass.value = pickRandom(animations);
  headerAnimClass.value = pickRandom(animations);
  textAnimClass.value = pickRandom(animations);
  imageAnimClass.value = pickRandom(animations);

  show.value = true;
  closable.value = false;
  if (enableCloseTimeout) clearTimeout(enableCloseTimeout);
  enableCloseTimeout = setTimeout(() => {
    closable.value = true;
  }, 3000);
}

function closeAd() {
  show.value = false;
}

function showAdManually() {
  showAd();
}

onMounted(() => {
  scheduleNext();
});

onUnmounted(() => {
  if (nextTimeout) clearTimeout(nextTimeout);
  if (enableCloseTimeout) clearTimeout(enableCloseTimeout);
});
</script>

<style scoped>
.ad-modal {
  max-width: 360px;
}

.ad-image {
  display: block;
  width: 100%;
  border-radius: 4px;
  margin-top: 12px;
}

.ad-close-btn {
  background: #f56c6c;
  color: #fff;
}

.ad-wait-btn {
  background: #999;
  color: #fff;
}

@keyframes shake {
  0% {
    transform: translate(0, 0) rotate(0deg);
  }
  100% {
    transform: translate(5px, -5px) rotate(-2deg);
  }
}

.shake {
  animation: shake 0.5s ease-in-out infinite alternate;
}

@keyframes pulse {
  0% {
    transform: scale(1);
  }
  100% {
    transform: scale(1.05);
  }
}

.pulse {
  animation: pulse 1s ease-in-out infinite alternate;
}

@keyframes bounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

.bounce {
  animation: bounce 1.2s ease-in-out infinite;
}

@keyframes hueShift {
  0% {
    filter: hue-rotate(0deg);
  }
  100% {
    filter: hue-rotate(360deg);
  }
}

.hue-shift {
  animation: hueShift 4s linear infinite;
}

@keyframes gradientBG {
  0% {
    background: linear-gradient(45deg, #ff6b6b, #feca57);
  }
  50% {
    background: linear-gradient(45deg, #5f27cd, #01a3a4);
  }
  100% {
    background: linear-gradient(45deg, #54a0ff, #00d2d3);
  }
}

.gradient-bg {
  animation: gradientBG 6s ease-in-out infinite;
  color: #fff;
}
</style>
