import type { GlobalAlerts } from "@/model/alerts.model";
import { ResponseMessageLevel, type ResponseMessageDTO } from "@/model/common.model";
import type { useI18n } from "vue-i18n";
import type { VAlert } from "vuetify/components";
import { ref, watch } from 'vue';

interface DependencyInjection {
  entity: string;
  onSuccess?: () => Promise<any> | void;
  t: ReturnType<typeof useI18n>['t'];
  te: ReturnType<typeof useI18n>['te'];
  globalAlerts: GlobalAlerts;
}
export function useDelete<T>(di: DependencyInjection) {
  const { t, te, globalAlerts, entity, onSuccess } = di;
  const isDeleteActive = ref(false);
  const shitToDelete = ref<T | null>(null);
  const isDeleting = ref(false);

  function askDelete(value: T) {
    isDeleteActive.value = true;
    shitToDelete.value = value;
  }

  function deleteShit(fn: () => Promise<ResponseMessageDTO>) {
    if (!shitToDelete.value) return;
    isDeleting.value = true;
    fn()
      .then(data => {
        handleResponse(data);
        if (onSuccess) onSuccess();
      })
      .finally(() => {
        isDeleting.value = false;
        isDeleteActive.value = false;
      });
  }
  function handleResponse(data: ResponseMessageDTO) {
    if (data.level === ResponseMessageLevel.OK) {
      globalAlerts.addAlert({
        title: t(`${entity}.delete.success`),
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
  }
  function cancelDelete() {
    isDeleteActive.value = false;
    shitToDelete.value = '';
  }
  watch(isDeleteActive, value => {
    if (!value) shitToDelete.value = '';
  });

  return {
    isDeleteActive,
    shitToDelete,
    isDeleting,
    askDelete,
    deleteShit,
    cancelDelete,
  };
}