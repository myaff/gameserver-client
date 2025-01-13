import type {
  ServerDTO,
  ServerProviders,
  OperationSystems,
  ServerConfigDTO,
  AddServerData,
  ServerStatus,
} from '@/model/server.model';
import { ServerService } from '@/services/server.service';
import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useServersStore = defineStore('servers', () => {
  const service = new ServerService();
  const list = ref<Map<string, ServerDTO>>(new Map());
  const isLoading = ref(false);
  const supportedProviders = ref<ServerProviders[]>([]);
  const supportedOSs = ref<OperationSystems[]>([]);
  const providersConfig = ref<ServerConfigDTO | null>(null);

  function getList() {
    isLoading.value = true;
    return service
      .getList()
      .then(data => {
        list.value = new Map(data.map(item => [item.name.replace(' ', '_'), item]));
      })
      .finally(() => (isLoading.value = false));
  }

  function getDetails(id: string) {
    return service.getDetail(id);
  }

  function getInfo() {
    return service.getInfo().then(data => {
      if (data.supportedProvider) supportedProviders.value = data.supportedProvider;
      if (data.supportedOs) supportedOSs.value = data.supportedOs;
      return data;
    })
  }

  function getConfig() {
    return service.getConfig().then(data => {
      if (data) providersConfig.value = data;
      return data;
    })
  }

  function addServer(formData: AddServerData) {
    return service.addServer(formData);
  }

  function editServer(id: string, formData: Partial<AddServerData>) {
    return service.editServer(id, formData);
  }

  function deleteServer(id: string) {
    return service.deleteServer(id);
  }

  function install(serverId: string, gameId: string) {
    return service.install(serverId, gameId);
  }

  function setStatus(serverId: string, status: ServerStatus) {
    return service.setStatus(serverId, status);
  }

  return {
    list,
    isLoading,
    supportedProviders,
    supportedOSs,
    providersConfig,
    getList,
    getDetails,
    getInfo,
    getConfig,
    addServer,
    deleteServer,
    install,
    setStatus,
    editServer,
  };
})

export type ServersStore = ReturnType<typeof useServersStore>;