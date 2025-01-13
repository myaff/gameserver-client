<script lang="ts" setup>
import { useDelete } from '@/composables/useDelete';
import type { ServerDTO } from '@/model/server.model';
import { GlobalAlertsKey } from '@/model/symbols';
import { useServersStore } from '@/stores/servers';
import { computed, ref, inject } from 'vue';
import { useI18n } from 'vue-i18n';
import { useDisplay } from 'vuetify';

const { t, te } = useI18n();
const globalAlerts = inject(GlobalAlertsKey);
if (!globalAlerts) {
  throw new Error(`Could not resolve ${GlobalAlertsKey.description}`);
}

const { smAndDown, width } = useDisplay();
const serversStore = useServersStore();
const servers = computed(() => serversStore.list);
const isLoading = computed(() => serversStore.isLoading);

// add
const isAddServerActive = ref(false);
const onAdded = () => {
  isAddServerActive.value = false;
  serversStore.getList();
}
const addServer = () => {
  isAddServerActive.value = true;
}

// edit
const isEditServerActive = ref(false);
const serverToEdit = ref<ServerDTO | null>(null);
const onEdited = () => {
  isEditServerActive.value = false;
  serversStore.getList();
}
const editServer = (server: ServerDTO) => {
  serverToEdit.value = server;
  isEditServerActive.value = true;
}

// delete
const {
  isDeleteActive: isDeleteServerActive,
  isDeleting,
  shitToDelete: serverToDelete,
  askDelete: askDeleteServer,
  deleteShit: deleteServer,
  cancelDelete: cancelDeleteServer,
} = useDelete<string>({
  entity: 'servers',
  t, te,
  onSuccess: serversStore.getList,
  globalAlerts,
});
</script>

<template>
  <v-layout class="servers h-100">
    <div v-if="isLoading" class="d-flex align-center justify-center h-100 w-100">
      <v-progress-circular indeterminate />
    </div>
    <v-container v-else>
      <v-row
        :justify="servers.size ? 'start' : 'center'"
        :align="servers.size ? 'stretch' : 'center'"
        :class="{'h-100': !servers.size}"
      >
        <template v-if="servers.size">
          <v-col
            v-for="[key, server] in servers"
            :key="key"
            cols="12"
            sm="6"
            md="4"
          >
            <server-card
              :server="server"
              :to="{ name: 'server', params: { key } }"
              @edit="editServer(server)"
              @delete="askDeleteServer(server.id)"
            />
          </v-col>
        </template>
        <v-col cols="12" sm="6" md="4" :class="{ 'h-25': !servers.size }">
          <v-card class="d-flex align-center justify-center h-100" @click="addServer">
            <v-card-item prepend-icon="mdi-plus">
              <v-card-title>
                {{ t('btn.addOne', { msg: t('servers.server') }) }}
              </v-card-title>
            </v-card-item>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
    <v-navigation-drawer
      v-model="isAddServerActive"
      :location="smAndDown ? 'bottom' : 'right'"
      :width="smAndDown ? width : 600"
      absolute
      temporary
    >
      <v-btn icon="mdi-close" variant="plain" class="position-absolute top-0 right-0 mr-lg-5 mt-5" @click="isAddServerActive = false" />
      <add-server-form @added="onAdded" />
    </v-navigation-drawer>
    <v-navigation-drawer
      v-if="serverToEdit"
      v-model="isEditServerActive"
      :location="smAndDown ? 'bottom' : 'right'"
      :width="smAndDown ? width : 600"
      absolute
      temporary
    >
      <v-btn icon="mdi-close" variant="plain" class="position-absolute top-0 right-0 mr-lg-5 mt-5" @click="isEditServerActive = false" />
      <edit-server-form :server="serverToEdit" @edited="onEdited" />
    </v-navigation-drawer>
    <v-dialog v-model="isDeleteServerActive" width="auto" max-width="600">
      <v-card
        prepend-icon="mdi-alert-circle"
        :title="t('servers.delete.title')"
        :text="t('servers.delete.text')">
        <v-card-actions class="pb-4">
          <v-btn
            v-if="serverToDelete"
            color="red"
            size="large"
            :loading="isDeleting"
            @click="deleteServer(() => serversStore.deleteServer(serverToDelete as string))"
          >
            {{ t('btn.delete') }}
          </v-btn>
          <v-btn size="large" :disabled="isDeleting" @click="cancelDeleteServer">
            {{ t('btn.cancel') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-layout>
</template>