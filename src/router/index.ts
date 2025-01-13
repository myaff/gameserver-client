import { useUserStore } from '@/stores/user';
import {
  createRouter,
  createWebHistory,
  type RouteLocationNormalized,
  type RouteRecordRaw,
} from 'vue-router';
import { defu } from 'defu';

const routes = [
  {
    path: '/login',
    component: () => import('@/layouts/auth.vue'),
    children: [
      {
        path: '',
        name: 'login',
        component: () => import('@/pages/login.vue'),
      },
    ],
  },
  {
    path: '/',
    component: () => import('@/layouts/default.vue'),
    meta: { needAuth: true },
    children: [
      {
        path: '',
        name: 'home',
        component: () => import('@/pages/index.vue'),
        meta: {
          nav: { main: { key: 'home', icon: 'mdi-home' } },
        },
      },
      {
        path: 'servers',
        name: 'servers',
        component: () => import('@/pages/servers.vue'),
        meta: {
          nav: { main: { key: 'servers', icon: 'mdi-server' } },
        },
      },
      {
        path: 'servers/:key',
        name: 'server',
        component: () => import('@/pages/server.vue'),
      },
    ],
  },
];

function populateRouteMeta(routeRaw: RouteRecordRaw, meta?: RouteRecordRaw['meta']): RouteRecordRaw {
  if (!meta && !routeRaw.meta) return routeRaw;
  const newMeta = defu(meta, routeRaw?.meta || {});
  const children = routeRaw?.children?.map(item => populateRouteMeta(item, newMeta));
  return {
    ...routeRaw,
    meta: newMeta,
    children: children || [],
  };
}

function transformRoutes(routesRaw: RouteRecordRaw[]): RouteRecordRaw[] {
  return routesRaw.map(item => populateRouteMeta(item));
}

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: transformRoutes(routes),
})

router.beforeEach(async (to: RouteLocationNormalized) => {
  if (!to.meta?.needAuth || to.name === 'login') return true;
  const userStore = useUserStore();
  await userStore.init();
  if (userStore.isAuthorized) return true;
  else return { name: 'login' };
})

export default router
