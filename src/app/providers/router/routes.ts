import MainLayout from "@shared/ui/layout/TheMainLayout.vue";
import EmptyLayout from "@shared/ui/layout/TheEmptyLayout.vue";
import {RouteRecordRaw} from "vue-router";

export const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('@/pages/home/TheHomeView.vue'),
    meta: {
      layout: MainLayout,
      auth: true
    },
    redirect: '/auth/login',
    children: [
      {
        path: 'home',
        component: () => import("@/pages/home/TheHomeView.vue"),      
      },
    ]
  },
  {
    path: '/auth',
    redirect: '/auth/login',
    meta: {
      layout: EmptyLayout
    },
    children: [
      {
        path: 'login',
        component: () => import("@/pages/auth/TheLoginView.vue")
      },
      {
        path: 'register',
        component: () => import("@/pages/auth/TheRegisterView.vue")
      }
    ]
  }
];