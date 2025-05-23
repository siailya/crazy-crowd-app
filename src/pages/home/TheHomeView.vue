<template>
  <div class="home-scene">
    <div class="floating-shapes">
      <div class="shape circle shape1"></div>
      <div class="shape circle shape2"></div>
      <div class="shape square shape3"></div>
      <div class="shape triangle shape4"></div>
      <div class="shape circle shape5"></div>
    </div>
    <div class="home-container">
      <h1 class="crazy-text">Добро пожаловать</h1>
      <n-button
        @click="openRickroll"
        size="large"
        class="action-btn"
      >
        ОТКРЫТЬ ДЛЯ СЕБЯ ТОПОВЫЙ ФУНКЦИОНАЛ 2025
      </n-button>
      <n-button
        @click="logout"
        size="large"
        class="logout-btn"
      >
        Выйти
      </n-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import {useRouter} from 'vue-router';
import {useRootStore} from '@/shared/model/store/useRootStore';

const router = useRouter();
const rootStore = useRootStore();

function openRickroll() {
  window.open('https://www.youtube.com/watch?v=dQw4w9WgXcQ', '_blank');
}

function logout() {
  rootStore.logout();
  router.push('/auth/login');
}
</script>

<style scoped>
.home-scene {
  position: relative;
  width: 100%;
  height: 100vh;
  background: linear-gradient(45deg, rgba(255, 0, 0, 0.3), rgba(0, 255, 255, 0.3)),
  url('https://placecats.com/800/600') center/cover no-repeat;
  overflow: hidden;
}

.floating-shapes .shape {
  position: absolute;
  opacity: 0.7;
}

.shape.circle {
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.5);
}

.shape.square {
  background: rgba(0, 0, 0, 0.5);
}

.shape.triangle {
  width: 0;
  height: 0;
  border-left: 20px solid transparent;
  border-right: 20px solid transparent;
  border-bottom: 30px solid rgba(255, 255, 255, 0.5);
}

.shape1 {
  width: 40px;
  height: 40px;
  top: 10%;
  left: 5%;
  animation: float1 7s ease-in-out infinite alternate;
}

.shape2 {
  width: 60px;
  height: 60px;
  top: 80%;
  left: 20%;
  animation: float2 5s ease-in-out infinite alternate;
}

.shape3 {
  width: 50px;
  height: 50px;
  top: 30%;
  left: 85%;
  animation: float3 6s ease-in-out infinite alternate;
}

.shape4 {
  top: 60%;
  left: 50%;
  animation: float4 8s ease-in-out infinite alternate;
}

.shape5 {
  width: 30px;
  height: 30px;
  top: 40%;
  left: 40%;
  animation: float5 4s ease-in-out infinite alternate;
}

@keyframes float1 {
  to {
    transform: translate(100px, -50px) rotate(45deg);
  }
}

@keyframes float2 {
  to {
    transform: translate(-80px, 60px) scale(1.2);
  }
}

@keyframes float3 {
  to {
    transform: translate(-100px, -100px) rotate(-30deg);
  }
}

@keyframes float4 {
  to {
    transform: translate(50px, 120px) skew(20deg, 10deg);
  }
}

@keyframes float5 {
  to {
    transform: translate(-60px, 80px) rotate(90deg);
  }
}

.home-container {
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  gap: 1.5rem;
}

.crazy-text {
  font-size: 5rem;
  font-weight: 900;
  text-align: center;
  background: linear-gradient(
      45deg,
      #ff0000,
      #ff9a00,
      #ffee00,
      #00ff6a,
      #00eaff,
      #000cff,
      #c800ff,
      #ff00c8,
      #ff0000
  );
  background-size: 400% 400%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: gradientShift 8s ease infinite, jitter 0.1s infinite;
  filter: drop-shadow(2px 2px 2px rgba(0, 0, 0, 0.5));
}

@keyframes gradientShift {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

@keyframes jitter {
  0% {
    transform: translate(0, 0) skew(0deg);
  }
  20% {
    transform: translate(-2px, 2px) skew(-1deg);
  }
  40% {
    transform: translate(2px, -2px) skew(1deg);
  }
  60% {
    transform: translate(-1px, 1px) skew(0deg);
  }
  80% {
    transform: translate(1px, -1px) skew(-1deg);
  }
  100% {
    transform: translate(0, 0) skew(1deg);
  }
}

.action-btn {
  font-size: 1.2rem;
  background: #ff0099;
  color: #fff;
  animation: pulseBtn 1s ease-in-out infinite alternate;
}

.logout-btn {
  font-size: 1.2rem;
  background: #555;
  color: #fff;
  animation: pulseBtn 1s ease-in-out infinite alternate;
}

@keyframes pulseBtn {
  from {
    transform: scale(1);
  }
  to {
    transform: scale(1.05);
  }
}
</style>
