import type { GlobalAlerts } from "@/model/alerts.model";
import type { ServersStore } from "@/stores/servers";
import type { useI18n } from "vue-i18n";
import { ref } from 'vue';
import type { AddServerData } from "@/model/server.model";

interface DependencyInjection {
  serversStore: Pick<ServersStore, 'addServer' | 'getList'>;
  t: ReturnType<typeof useI18n>['t'];
  globalAlerts: GlobalAlerts;
}
export function useAddServer(di: DependencyInjection) {
  const { serversStore, t, globalAlerts } = di;
  const isAddServerActive = ref(false);
  const isSending = ref(false);

  const onAdded = () => {
    isAddServerActive.value = false;
    serversStore.getList();
  }
  const openAddServer = () => {
    isAddServerActive.value = true;
  }
  const addServer = (formData: AddServerData) => {
    isSending.value = true;
    serversStore
      .addServer(formData)
      .then(data => {
        globalAlerts.addAlert({
          title: t('servers.add.success.title', { msg: data.name }),
          type: 'success',
          closable: true,
          autoClose: true,
        });
      })
      .finally(() => isSending.value = false);
  }
  return {
    isAddServerActive,
    onAdded,
    openAddServer,
    addServer,
  }
}