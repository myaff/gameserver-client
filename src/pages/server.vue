<script setup lang="ts">
import { useServersStore } from '@/stores/servers';
import { useRoute, useRouter } from 'vue-router';
import { computed, watchEffect, ref, inject, watch, onBeforeUnmount } from 'vue';
import { getQueryParamValue } from '@/composables/useUrlHelpers';
import { ServerStatus, type ServerDetailDTO } from '@/model/server.model';
import { useI18n } from 'vue-i18n';
import { useGamesStore } from '@/stores/games';
import { GameSupportStatus, GameInstallationStatus, type GameDetailsDTO, type GameDTO } from '@/model/game.model';
import { GlobalAlertsKey } from '@/model/symbols';
import {
  ResponseMessageLevel,
  ResponseMessageLevelToType,
  type ResponseMessageDTO,
} from '@/model/common.model';
import type { GlobalAlert } from '@/model/alerts.model';
import { useDisplay } from 'vuetify';
import { useDelete } from '@/composables/useDelete';

const route = useRoute();
const router = useRouter();
const { t, te } = useI18n();

const globalAlerts = inject(GlobalAlertsKey);
if (!globalAlerts) {
  throw new Error(`Could not resolve ${GlobalAlertsKey.description}`);
}

const realKey = ref(getQueryParamValue(route.params.key));
if (route.params.key !== realKey.value) {
  router.replace({
    name: route.name,
    params: { key: realKey.value },
    query: { ...route.query },
  });
}
const serversStore = useServersStore();
const servers = computed(() => serversStore.list);
const activeServer = computed(() => servers.value.get(realKey.value));
if (!servers.value.size) serversStore.getList();
const details = ref<ServerDetailDTO | null>(null);
const isLoading = ref(true);

const gamesStore = useGamesStore();
const availableGames = computed(() => {
  const installed = new Set(details.value?.games.map(item => item.game.steamId));
  return Array.from(gamesStore.list.values())
    .filter(item => !installed.has(item.steamId)
      && (item.status === GameSupportStatus.FULL
      || item.status === GameSupportStatus.INSTALL)
    );
});
const gamesDetails = computed(() => gamesStore.details);
const activeGame = ref<GameDTO | null>(null);
const activeGameStatus = computed(() => {
  if (!activeGame.value) return '';
  const installed = details.value?.games.find(item => item.game.steamId === activeGame.value?.steamId);
  return installed?.status ?? activeGame.value.status;
})
if (!gamesStore.list.size) {
  gamesStore
    .getList()
    .then(data => data.map(item => item.gameSteamId))
    .then(steamIds => gamesStore.getDetails(steamIds));
}
const detailsError = ref<GlobalAlert | null>(null);
watchEffect(() => {
  if (activeServer.value) {
    serversStore
      .getDetails(activeServer.value.id)
      .then(data => {
        if (data) details.value = data;
      })
      .catch(data => {
        if (data?.level && data?.message) {
          detailsError.value = {
            type: ResponseMessageLevelToType[data.level as ResponseMessageLevel],
            text: data.key && te(data.key) ? t(data.key) : data.message,
          };
        }
      })
      .finally(() => isLoading.value = false);
  }
});
watch(() => details.value?.games, value => {
  const installing = value?.find(item => item.status === GameInstallationStatus.INSTALLATION_STARTED);
  if (installing) isGameInstalling.value = true;
})
const installingGameId = ref('');
const isGameInstalling = ref(false);
const install = (gameId: string) => {
  if (!activeServer.value || isGameInstalling.value) return;
  installingGameId.value = gameId;
  isGameInstalling.value = true;
  serversStore
    .install(activeServer.value.id, gameId)
    .then(data => {
      const key = data.key
        || data.level === ResponseMessageLevel.OK ? 'games.status.INSTALLATION_STARTED' : '';
      showAlert({...data, key });
      serversStore
        .getDetails(activeServer.value!.id)
        .then(data => {
          if (data) details.value = data;
        })
    })
    .catch(data => showAlert(data))
    .finally(() => {
      isGameInstalling.value = false;
      installingGameId.value = '';
    });
}

const isStatusUpdating = ref(false);
const changeStatus = (status: ServerStatus) => {
  if (!activeServer.value || !details.value) return;
  isStatusUpdating.value = true;
  serversStore
    .setStatus(activeServer.value.id, status)
    .then(data => {
      const key = data.key || data.level === ResponseMessageLevel.OK
        ? 'servers.status.success'
        : 'servers.status.error';
      showAlert({ ...data, key });
      checkUpdatedStatus();
    })
    .catch(data => showAlert(data));
}
const timerId = ref<number | null>(null);
const MAX_TRYES = 10;
const checkUpdatedStatus = (tryNumber = 0) => {
  if (!details.value) return;
  if (timerId.value) clearTimeout(timerId.value);
  serversStore
    .getDetails(details.value.id)
    .then(data => {
      const prev = details.value?.status;
      if (data) details.value = data;
      if (prev === details.value?.status && tryNumber < MAX_TRYES) {
        timerId.value = window.setTimeout(() => {
          checkUpdatedStatus(tryNumber + 1);
        }, 5000 * tryNumber);
      } else {
        if (timerId.value) clearTimeout(timerId.value);
        isStatusUpdating.value = false;
      }
    })
    .catch(data => {
      showAlert(data);
      if (timerId.value) clearTimeout(timerId.value);
      isStatusUpdating.value = false;
    });
}
onBeforeUnmount(() => {
  if (timerId.value) clearTimeout(timerId.value);
});
const showAlert = (data: ResponseMessageDTO) => {
  globalAlerts.addAlert({
    type: ResponseMessageLevelToType[data.level],
    text: data.key && te(data.key) ? t(data.key) : data.message,
    closable: true,
    autoClose: true,
  });
}

const { smAndDown, width } = useDisplay();
// edit
const isEditServerActive = ref(false);
const onEdited = () => {
  isEditServerActive.value = false;
  serversStore
    .getDetails(activeServer.value!.id)
    .then(data => {
      if (data) details.value = data;
    });
}
const editServer = () => {
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
const deleteServerInternal = (id: string) => {
  deleteServer(() => serversStore.deleteServer(id));
  router.push({ name: 'servers' });
}
</script>

<template>
  <v-layout class="page w-100" :class="{ 'h-100': isLoading || true }">
    <div class="page__aside">
      <v-sheet :class="{'h-100': $vuetify.display.mdAndUp}">
        <server-info
          v-if="activeServer"
          :server="activeServer"
          :details="details"
          :updating="isStatusUpdating"
          @change-status="changeStatus"
          @edit="editServer"
          @delete="askDeleteServer(activeServer.id)"
        />
      </v-sheet>
    </div>
    <div class="page__content" :class="{ 'd-flex': isLoading }">
      <div v-if="isLoading" class="page__loading w-100 h-100 d-flex align-center justify-center">
        <v-progress-circular indeterminate />
      </div>
      <template v-else-if="details">
        <game-detail
          v-if="activeServer && activeGame && gamesDetails.has(activeGame.gameSteamId) && activeGameStatus"
          :game="activeGame"
          :details="(gamesDetails.get(activeGame.gameSteamId) as GameDetailsDTO)"
          :server="details"
          :status="activeGameStatus"
          @close="activeGame = null"
        />
        <template v-else>
          <section v-if="details?.games.length" class="installed-games py-5 px-4 px-md-6">
            <h3 class="text-h5 text-sm-h4 mb-5">{{ t('games.installed') }}</h3>
            <v-row>
              <v-col v-for="item in details?.games" :key="item.game.steamId" cols="12" md="6">
                <game-card
                  :game="item.game"
                  :details="gamesDetails.get(item.game.gameSteamId)"
                  :status="item.status"
                  class="h-100"
                  @click="activeGame = item.game"
                />
              </v-col>
            </v-row>
          </section>
          <section v-if="availableGames.length" class="available-games py-5 px-4 px-md-6">
            <h3 class="text-h5 text-sm-h4 mb-5">{{ t('games.available') }}</h3>
            <v-row>
              <v-col v-for="item in availableGames" :key="item.steamId" cols="12" sm="6">
                <game-card
                  :game="item"
                  :loading="isGameInstalling && installingGameId === item.steamId"
                  :details="gamesDetails.get(item.gameSteamId)"
                  :status="item.status"
                  class="h-100"
                  @click="activeGame = item"
                >
                  <template #actions>
                    <v-spacer />
                    <v-tooltip :text="isGameInstalling ? t('KEY_GAME_INSTALLATION_CONFLICT') : t('games.install')">
                      <template #activator="{ props }">
                        <v-btn
                          v-bind="props"
                          color="primary"
                          icon="mdi-download"
                          @click.prevent.stop="install(item.steamId)"
                        />
                      </template>
                    </v-tooltip>
                  </template>
                </game-card>
              </v-col>
            </v-row>
          </section>
        </template>
      </template>
      <template v-else>
        <v-alert
          :type="detailsError?.type || 'error'"
          :text="detailsError?.text || t('errors.unknown.title')"
          class="ma-8"
        />
      </template>
    </div>
    <v-navigation-drawer
      v-if="activeServer"
      v-model="isEditServerActive"
      :location="smAndDown ? 'bottom' : 'right'"
      :width="smAndDown ? width : 600"
      absolute
      temporary
    >
      <v-btn icon="mdi-close" variant="plain" class="position-absolute top-0 right-0 mr-lg-5 mt-5" @click="isEditServerActive = false" />
      <edit-server-form :server="activeServer" @edited="onEdited" />
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
            @click="deleteServerInternal(serverToDelete)"
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

<style lang="scss" scoped>
@use "sass:map";
@use 'vuetify/settings';

.page {
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: 1fr;
  grid-template-areas: 'aside' 'main';

  @media #{map.get(settings.$display-breakpoints, 'md-and-up')} {
    grid-template-columns: 1fr 2fr;
    grid-template-rows: 1fr;
    grid-template-areas: 'aside main';
  }

  &__aside {
    grid-area: aside;
    @media #{map.get(settings.$display-breakpoints, 'md-and-up')} {
      position: fixed;
      width: 33.33%;
      height: calc(100dvh - var(--v-layout-top));
      top: var(--v-layout-top);
    }
  }

  &__content {
    grid-area: main;
  }
}
</style>