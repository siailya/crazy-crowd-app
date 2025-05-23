<template>
  <div class="payment-container">
    <div
      v-if="!paid"
      class="form-container"
    >
      <p>Для продолжения оплаты введите номер карты и CVC код</p>
      <input
        ref="cardInput"
        v-model="cardNumber"
        @input="onCardInput"
        type="text"
        inputmode="numeric"
        placeholder="Номер карты"
        class="card-input"
      />
      <input
        v-model="cvc"
        type="text"
        inputmode="numeric"
        maxlength="3"
        placeholder="CVC"
        class="cvc-input"
      />
      <button
        @click="pay"
        :disabled="!canPay"
        class="pay-button"
      >
        Оплатить
      </button>
    </div>
    <div
      v-else
      class="mammoth-container"
    >
      <img
        src="https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcS3DIQGmdzEjI0GrKa3RTSySUYa1JnjVEPAMidZezOIr3iHlLa5a3UkVvNh-dstxosllbweBNHk9RQ-YXDd6l-P2w"
        alt="Мамонт"
        class="mammoth-image"
      />
      <p>Спасибо за оплату!</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import {ref, computed, defineEmits} from 'vue';

const cardNumber = ref('');
const cvc = ref('');
const paid = ref(false);
const cardInput = ref<HTMLInputElement | null>(null);

const canPay = computed(() => cardNumber.value.length >= 12 && cvc.value.length === 3);

function onCardInput() {
  playBeep();
  triggerPulse();
}

function playBeep() {
  const ctx = new AudioContext();
  const osc = ctx.createOscillator();
  osc.type = 'square';
  osc.frequency.setValueAtTime(440, ctx.currentTime);
  osc.connect(ctx.destination);
  osc.start();
  osc.stop(ctx.currentTime + 0.05);
}

function triggerPulse() {
  const el = cardInput.value;
  if (!el) return;
  el.classList.add('pulse');
  el.addEventListener('animationend', () => {
    el.classList.remove('pulse');
  }, {once: true});
}

const emit = defineEmits(['save']);

function pay() {
  paid.value = true;
  emit('save');
}
</script>

<style scoped>
.payment-container {
  max-width: 320px;
  margin: 2rem auto;
  padding: 1rem;
  border: 1px solid #ccc;
  border-radius: 8px;
  text-align: center;
  font-family: sans-serif;
}

.form-container p {
  margin-bottom: 1rem;
}

.card-input,
.cvc-input {
  display: block;
  width: 100%;
  padding: 0.5rem;
  margin-bottom: 0.75rem;
  font-size: 1rem;
  border: 1px solid #888;
  border-radius: 4px;
  transition: border-color 0.2s;
}

.card-input.pulse {
  animation: pulse 0.2s ease;
}

@keyframes pulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
}

.pay-button {
  padding: 0.5rem 1rem;
  font-size: 1rem;
  background-color: #28a745;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.pay-button:disabled {
  background-color: #aaa;
  cursor: not-allowed;
}

.mammoth-container {
  animation: wobble 0.5s ease-in-out;
}

@keyframes wobble {
  0% {
    transform: rotate(0deg);
  }
  25% {
    transform: rotate(5deg);
  }
  50% {
    transform: rotate(-5deg);
  }
  75% {
    transform: rotate(3deg);
  }
  100% {
    transform: rotate(0deg);
  }
}

.mammoth-image {
  width: 100%;
  border-radius: 4px;
  margin-bottom: 0.5rem;
}
</style>
