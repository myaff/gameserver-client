<script lang="ts" setup>
import { useI18n } from 'vue-i18n';
import { useRouter, useRoute, type RouteRecordNormalized } from 'vue-router';
import { ref, computed } from 'vue';
import { useServersStore } from '@/stores/servers';
import { useUserStore } from '@/stores/user';
import { useDisplay } from 'vuetify'
import type { RouteMetaNav, RouteMetaNavItem } from '@/model/common.model';

const { t } = useI18n();
const { mobile } = useDisplay();
const router = useRouter();
const route = useRoute();
const serversStore = useServersStore();
const userStore = useUserStore();
const appTitle = computed(() => {
  if (mobile.value) return t('app.titleMobile');
  return t('app.title');
})
serversStore.getList().catch(async e => {
  if (e?.status === 403) {
    await userStore.logout();
    router.push({ name: 'login' });
  }
});
type RouteWithNav = RouteRecordNormalized & { meta: RouteMetaNav };
type RouteWithNavMain = RouteRecordNormalized & { meta: { nav: { main: RouteMetaNavItem } } };
const nav = computed(() => {
  return router
    .getRoutes()
    .filter<RouteWithNav>((item): item is RouteWithNavMain => !!(item.meta as RouteMetaNav).nav?.main)
    .map(item => ({
      to: item.path,
      title: t(`page.${item.meta.nav.main.key}`),
      ...(item.meta.nav.main.icon && { icon: item.meta.nav.main.icon }),
    }));
})
const drawer = ref(false);
</script>

<template>
  <v-app-bar color="primary">
    <v-app-bar-nav-icon variant="text" @click.stop="drawer = !drawer" />
    <v-toolbar-title>{{ appTitle }}</v-toolbar-title>
    <v-spacer v-if="!$vuetify.display.mobile" />
    <div class="w-auto"><lang-selector /></div>
  </v-app-bar>
  <v-navigation-drawer
    v-model="drawer"
    :location="$vuetify.display.mobile ? 'bottom' : undefined"
    temporary
  >
    <v-list v-if="nav.length">
      <v-list-item
        v-for="item in nav"
        :key="item.to"
        :to="item.to"
        :active="item.to === route.path"
        :title="item.title"
        :prepend-icon="item.icon"
      />
    </v-list>
  </v-navigation-drawer>
  <v-main>
    <router-view />
  </v-main>
</template>
