<script lang="ts" setup>
import { ref, watch, provide, reactive } from 'vue';
import type { GlobalAlert, GlobalAlerts } from './model/alerts.model';
import { GlobalAlertsKey } from './model/symbols';

const queue = reactive<GlobalAlerts['queue']>([]);
const alertTimerId = ref<number | null>(null);

function addAlert(alert: GlobalAlert) {
  // @ts-ignore
  queue.push({
    ...alert,
    ...(alert.autoClose && !alert.delay && { delay: 10000 }),
  });
}
function removeAlert(i: number) {
  queue.splice(i, 1);
}

watch(queue, value => {
  if (value.length) {
    const last = value.at(-1);
    if (alertTimerId.value) clearTimeout(alertTimerId.value);
    if (last?.autoClose && last.delay) {
      alertTimerId.value = window.setTimeout(() => {
        value.pop();
        if (alertTimerId.value) clearTimeout(alertTimerId.value);
      }, last.delay);
    }
  } else if (alertTimerId.value) clearTimeout(alertTimerId.value);
});
provide(GlobalAlertsKey, { queue, addAlert, removeAlert });
</script>

<template>
  <v-app>
    <router-view />
    <div v-if="queue.length" class="global-alerts">
      <v-alert
        v-for="(alert, i) in queue"
        :key="i"
        v-bind="alert"
        class="global-alerts__item"
        :elevation="3 + i * 2"
        :style="{ top: `${i * 20}px` }"
        @click:close="removeAlert(i)"
      />
    </div>
  </v-app>
</template>

<style lang="scss" scoped>
.global-alerts {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 9999;

  &__item {
    position: absolute;
    right: 0;
    width: 360px;
    max-width: calc(100vw - 40px);
  }
}
</style>