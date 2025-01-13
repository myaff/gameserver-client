<script lang="ts" setup>
import type { GameDetailsDTO, GameDTO } from '@/model/game.model';
import { GlobalAlertsKey } from '@/model/symbols';
import { useGamesStore } from '@/stores/games';
import { useServersStore } from '@/stores/servers';
import { computed, ref, inject, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useDisplay } from 'vuetify';
import type { VLayout } from 'vuetify/components';

const { t } = useI18n();
const globalAlerts = inject(GlobalAlertsKey);
if (!globalAlerts) {
  throw new Error(`Could not resolve ${GlobalAlertsKey.description}`);
}

const serversStore = useServersStore();
const providers = computed(() => serversStore.supportedProviders);
const gamesGrid = {
  ark: {
    order: 0,
    size: 6,
  },
  default: {
    size: 4,
    order: 2,
  },
} as { [key: string]: { order?: number; size: number; } }
const gamesStore = useGamesStore();
const games = computed(() => Array.from(gamesStore.list).map(v => {
  const [key, game] = v;
  const gridSettings = key in gamesGrid
    ? gamesGrid[key]
    : gamesGrid.default;
  return { ...game, ...gridSettings };
}));
const gameDetails = computed(() => gamesStore.details);
const isGamesLoading = computed(() => gamesStore.isLoading);
gamesStore
  .getList()
  .then(data => {
    return data.reduce((acc, item) => {
      acc.push(item.steamId);
      acc.push(item.gameSteamId);
      return acc;
    }, [] as string[]);
  })
  .then(ids => gamesStore.getDetails(ids));
serversStore.getInfo();
const selectedGame = ref<GameDTO | null>(null);
const isGameDetailsActive = ref(false);
function openDetails(game: GameDTO) {
  selectedGame.value = game;
  isGameDetailsActive.value = true;
}
function closeDetails() {
  isGameDetailsActive.value = false;
  selectedGame.value = null;
}
const layoutEl = ref<VLayout>();
const { width, mdAndUp } = useDisplay();
const asideWidth = computed(() => {
  return mdAndUp.value
    ? width.value * 0.66
    : width.value;
})
</script>

<template>
  <v-layout ref="layoutEl" class="page page-home h-100">
    <div v-if="isGamesLoading" class="d-flex align-center justify-center w-100 h-100">
      <v-progress-circular indeterminate />
    </div>
    <v-container v-else>
      <section class="games">
        <v-row>
          <v-col cols="12" md="6" align-self="center">
            <h2 class="text-h4 text-sm-h2 text-md-h3 text-lg-h2">
              {{ t('games.supported') }}
            </h2>
            <p class="text-body-1 mt-6">{{ t('games.description') }}</p>
          </v-col>
          <v-col v-for="game in games" :key="game.apiToken" cols="12" sm="6" :md="game.size" :order="game.order">
            <game-card
              :game="game"
              :details="gameDetails.get(game.gameSteamId)"
              :status="game.status"
              :status-position="$vuetify.display.lgAndUp && game.size >= 6 ? 'aside' : 'bottom'"
              :variant="game.size < 6 ? 'small' : 'default'"
              class="h-100"
              @click="openDetails(game)"
            />
          </v-col>
        </v-row>
      </section>
      <section class="providers mt-16 pb-8">
        <h2 class="text-h4 text-sm-h2 text-md-h3 text-lg-h2 mb-10">
          {{ t('providers.supported') }}
        </h2>
        <v-row>
          <v-col v-for="provider in providers" :key="provider" cols="6" md="3">
            <provider-card :name="provider" />
          </v-col>
        </v-row>
      </section>
    </v-container>
    <v-overlay
      v-model="isGameDetailsActive"
      :location="$vuetify.display.mobile ? 'bottom center' : 'top right'"
      scrim="#000"
      :attach="layoutEl?.$el"
      content-class="page-home__aside"
      @update:model-value="value => !value && closeDetails()"
    >
      <v-sheet
        v-if="selectedGame && gameDetails.has(selectedGame.gameSteamId)"
        :width="asideWidth"
        class="page-home__aside-content overflow-y-auto"
      >
        <game-detail
          :game="selectedGame"
          :details="(gameDetails.get(selectedGame.gameSteamId) as GameDetailsDTO)"
          :status="selectedGame?.status"
          @close="closeDetails"
        />
      </v-sheet>
    </v-overlay>
  </v-layout>
</template>

<style lang="scss">
.page-home {
  &__aside {
    top: var(--v-layout-top);
    right: 0;
    height: calc(100dvh - var(--v-layout-top));

    &-content {
      transition: right 1s ease;
      height: calc(100dvh - var(--v-layout-top));
    }
  }
}
</style>