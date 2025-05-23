import { createRouter, createWebHashHistory } from 'vue-router';
import { routes } from './routes';
import { useRootStore } from '@/shared/model/store/useRootStore';

export const router = createRouter({
  history: createWebHashHistory(),
  routes
});

router.beforeEach((to, from, next) => {
  const rootStore = useRootStore();

  if (rootStore.isAuthenticated && to.path.startsWith('/auth')) {
    next({ path: '/home' });
    return;
  }

  if (to.matched.some(record => record.meta.auth)) {
    if (!rootStore.isAuthenticated) {
      next({ path: '/auth/login' });
      return;
    }
  }

  next();
});
