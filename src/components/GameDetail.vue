<script setup lang="ts">
import { type GameDetailsDTO, type GameDTO, GameInstallationStatus, GameServerStatus, GameStatus, GameSupportStatus } from '@/model/game.model';
import { type ServerDetailDTO, ServerStatus } from '@/model/server.model';
import { type PropType, defineProps, ref, computed, watchEffect, onBeforeUnmount } from 'vue';
import { GameService } from '@/services/game.service';
import { useI18n } from 'vue-i18n';

const props = defineProps({
  game: {
    type: Object as PropType<GameDTO>,
    required: true,
  },
  details: {
    type: Object as PropType<GameDetailsDTO>,
    required: true,
  },
  server: {
    type: Object as PropType<Pick<ServerDetailDTO, 'id' | 'status'>>,
  },
  status: {
    type: String as PropType<GameSupportStatus | GameInstallationStatus>,
    required: true,
  },
});
const emit = defineEmits(['close']);
const { t } = useI18n();
const gameService = props.server?.id
  ? new GameService({
    server: props.server?.id,
    game: props.game.apiToken,
  })
  : null;
const serverIsOn = computed(() => props.server?.status === ServerStatus.ON);
const gameStatus = ref(GameStatus.STOPPED);
watchEffect(() => {
  if (serverIsOn.value) updateStatus();
})

function updateStatus() {
  if (!gameService) return Promise.reject();
  return gameService
    .getStatus()
    .then(data => {
      gameStatus.value = data.key === GameStatus.STARTED
        || data.message === GameStatus.STARTED
          ? GameStatus.STARTED
          : GameStatus.STOPPED;
    });
}
const activeTab = ref('');
interface ContentTab {
  title: string;
  value: string;
  active: boolean;
  disabled: boolean;
}
const tabsRaw = ['server', 'main', 'requirenments'];
const tabs = computed(() => {
  return tabsRaw.reduce((acc, item) => {
    if (item === 'server' && !props.server) return acc;
    acc.push({
      title: t(`games.tabs.${item}`),
      value: item,
      disabled: item === 'server' && (!serverIsOn.value || props.status !== GameInstallationStatus.INSTALLED || props.game.status !== GameSupportStatus.FULL),
      active: item === activeTab.value,
    })
    return acc;
  }, [] as ContentTab[]);
});
const isStatusUpdating = ref(false);
function toggleGameStatus() {
  if (!gameService) return;
  isStatusUpdating.value = true;
  const statusTo = gameStatus.value === GameStatus.STARTED ? GameServerStatus.OFF : GameServerStatus.ON;
  gameService.setStatus(statusTo)
    .then(() => {
      checkUpdatedStatus();
    });
}
const timerId = ref<number | null>(null);
const MAX_TRYES = 10;
function checkUpdatedStatus(tryNumber = 0) {
  if (!gameService) return;
  if (timerId.value) clearTimeout(timerId.value);
  const prev = gameStatus.value;
  updateStatus().then(() => {
    if (gameStatus.value === prev && tryNumber < MAX_TRYES) {
      timerId.value = window.setTimeout(() => {
        checkUpdatedStatus(tryNumber + 1);
      }, 5000 * tryNumber);
    } else {
      if (timerId.value) clearTimeout(timerId.value);
      isStatusUpdating.value = false;
    }
  }).finally(() => isStatusUpdating.value = false);
}
onBeforeUnmount(() => {
  if (timerId.value) clearTimeout(timerId.value);
})
</script>

<template>
  <div class="game-detail">
    <div class="game-detail__header position-relative" :style="{ backgroundImage: `url(${details.keyart || details.header_image})` }">
      <v-btn
        icon="mdi-arrow-left"
        variant="plain"
        class="position-absolute top-0 left-0 mt-2 ml-2"
        @click="emit('close')"
      />
      <div class="game-detail__logo px-4 pt-4 mx-auto">
        <v-img :src="details.logo" contain />
      </div>
      <div class="game-detail__header-bar d-flex align-center px-4 py-4 flex-wrap">
        <h2 class="text-h6 text-sm-h5 text-md-h4">{{ details.name }}</h2>
        <v-spacer />
        <template v-if="status === GameInstallationStatus.INSTALLED">
          <v-btn
            v-if="serverIsOn"
            :prepend-icon="gameStatus === GameStatus.STOPPED ? 'mdi-play' : 'mdi-stop'"
            :size="$vuetify.display.smAndUp ? 'large' : 'default'"
            :color="gameStatus === GameStatus.STOPPED ? 'green' : 'red'"
            :loading="isStatusUpdating"
            @click="toggleGameStatus"
          >
            {{ gameStatus === GameStatus.STOPPED ? t('btn.play') : t('btn.stop') }}
          </v-btn>
          <v-tooltip v-else :text="t('games.startToPlay')">
            <template #activator="{ props }">
              <div v-bind="props">
                <v-btn
                  prepend-icon="mdi-play"
                  size="large"
                  color="green"
                  disabled
                  :loading="isStatusUpdating"
                  @click="toggleGameStatus"
                >
                  {{ t('btn.play') }}
                </v-btn>
              </div>
            </template>
          </v-tooltip>
        </template>
        <v-btn
          v-else-if="server?.id && (status === GameSupportStatus.INSTALL || status === GameSupportStatus.FULL)"
          color="primary"
          :disabled="!serverIsOn"
          :size="$vuetify.display.smAndUp ? 'large' : 'default'"
        >
          {{ t('btn.install') }}
        </v-btn>
        <game-status-chip v-else :status="status" variant="flat" />
      </div>
    </div>
    <div class="game-detail__content">
       <v-tabs v-model="activeTab" class="game-detail__tabs-header">
        <v-tab
          v-for="tab in tabs"
          :value="tab.value"
          :disabled="tab.disabled"
          :active="tab.active"
        >
          {{ tab.title }}
        </v-tab>
       </v-tabs>
       <v-tabs-window v-model="activeTab" class="game-detail__tabs-content">
        <v-tabs-window-item v-if="server?.id && gameService" value="server">
          <game-worlds v-if="serverIsOn" :service="gameService" />
        </v-tabs-window-item>
        <v-tabs-window-item value="main">
          <game-detail-main-info :details="details" />
        </v-tabs-window-item>
        <v-tabs-window-item value="requirenments">
          <game-detail-requirenments :details="details" />
        </v-tabs-window-item>
       </v-tabs-window>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use "sass:map";
@use 'vuetify/settings';

.game-detail {
  &__header {
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
  }
  &__header-bar {
    background: linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 100%);
  }
  &__logo {
    max-width: 60%;

    @media #{map.get(settings.$display-breakpoints, 'md-and-up')} {
      max-width: 40%;
    }
  }

  &__tabs {
    &-header {
      max-width: 100vw;
    }
  }
}
</style>