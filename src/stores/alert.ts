import { defineStore } from "pinia";
import type { VAlert } from 'vuetify/components';
import { ref } from 'vue';

interface AutoClosable {
  autoClose?: boolean;
  delay?: number;
}
export const useAlertStore = defineStore('alert', () => {
  const queue = ref<(VAlert & AutoClosable)[]>([]);

  function addAlert(alert: VAlert & AutoClosable) {
    queue.value.push(alert);
  }
});