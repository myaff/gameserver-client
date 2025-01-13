import type { GlobalAlerts } from "@/model/alerts.model";
import { ResponseMessageLevel } from "@/model/common.model";
import type { ServersStore } from "@/stores/servers";
import type { useI18n } from "vue-i18n";
import type { VAlert } from "vuetify/components";
import { ref, watch } from 'vue';

interface DependencyInjection {
  serversStore: Pick<ServersStore, 'deleteServer' | 'getList'>;
  t: ReturnType<typeof useI18n>['t'];
  te: ReturnType<typeof useI18n>['te'];
  globalAlerts: GlobalAlerts;
}
export function useDeleteServer(di: DependencyInjection) {
  const { serversStore, t, te, globalAlerts } = di;
  const isDeleteServerActive = ref(false);
  const serverToDelete = ref('');
  const isDeleting = ref(false);
  const askDeleteServer = (id: string) => {
    isDeleteServerActive.value = true;
    serverToDelete.value = id;
  }
  const deleteServer = (id: string) => {
    isDeleting.value = true;
    serversStore.deleteServer(id)
      .then(data => {
        if (data.level === ResponseMessageLevel.OK) {
          globalAlerts.addAlert({
            title: t('servers.delete.success'),
            type: 'success',
            closable: true,
            autoClose: true,
          });
        } else {
          globalAlerts.addAlert({
            title: data.key && te(data.key) ? t(data.key) : data.message,
            type: data.level.toLowerCase() as VAlert['$props']['type'],
            closable: true,
            autoClose: true,
          });
        }
        serversStore.getList();
      })
      .finally(() => {
        isDeleting.value = false;
        isDeleteServerActive.value = false;
      });
  }
  const cancelDeleteServer = () => {
    isDeleteServerActive.value = false;
    serverToDelete.value = '';
  }
  watch(isDeleteServerActive, value => {
    if (!value) serverToDelete.value = '';
  });

  return {
    isDeleteServerActive,
    serverToDelete,
    isDeleting,
    askDeleteServer,
    deleteServer,
    cancelDeleteServer,
  };
}