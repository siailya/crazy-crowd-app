import { onUnmounted } from 'vue';

type FilterGenerator = () => string

const filterGenerators: Record<string, FilterGenerator> = {
  grayscale: () => `grayscale(${(Math.random() * 15).toFixed(0)}%)`,
  sepia: () => `sepia(${(Math.random() * 15).toFixed(0)}%)`,
  invert: () => `invert(${(Math.random() * 15).toFixed(0)}%)`,
  hueRotate: () => `hue-rotate(${(Math.random() * 240).toFixed(0)}deg)`,
  saturate: () => `saturate(${(Math.random() * 8).toFixed(1)})`,
  contrast: () => `contrast(${(Math.random() * 8).toFixed(1)})`,
  brightness: () => `brightness(${(Math.random() * 2).toFixed(2)})`,
  blur: () => `blur(${(Math.random() * 2).toFixed(2)}px)`
};

function buildRandomFilter(): string {
  const keys = Object.keys(filterGenerators);
  const count = Math.floor(Math.random() * (keys.length - 2)) + 3;
  const picked = keys
    .sort(() => Math.random() - 0.5)
    .slice(0, count);
  return picked.map(k => filterGenerators[k]()).join(' ');
}

export function useCrazyFilters() {
  let intervalId: ReturnType<typeof setInterval> | null = null;

  function applyFilters() {
    const el = document.getElementById('app');
    el!.style.transition = 'filter 2s ease-in-out';
    el!.style.filter = buildRandomFilter();
  }

  function enable() {
    if (intervalId !== null) return;
    applyFilters();
    intervalId = setInterval(applyFilters, 15000);
  }

  function disable() {
    if (intervalId !== null) {
      clearInterval(intervalId);
      intervalId = null;
    }
    const html = document.documentElement;
    html.style.transition = '';
    html.style.filter = '';
  }

  onUnmounted(() => {
    disable();
  });

  return { enableCrazyFilters: enable, disableCrazyFilters: disable, applyFilters };
}
