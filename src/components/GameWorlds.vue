<script setup lang="ts">
import { type ResponseMessageDTO, ResponseMessageLevelToType } from '@/model/common.model';
import type { BackupDTO, WorldDTO } from '@/model/game.model';
import type { GameLastSession } from '@/model/server.model';
import { GlobalAlertsKey } from '@/model/symbols';
import type { GameService } from '@/services/game.service';
import { type PropType, defineProps, ref, computed, watch, inject, watchEffect } from 'vue';
import { useI18n } from 'vue-i18n';

const props = defineProps({
  service: {
    type: Object as PropType<GameService>,
    required: true,
  },
});
const { t, te } = useI18n();
const globalAlerts = inject(GlobalAlertsKey);
if (!globalAlerts) {
  throw new Error(`Could not resolve ${GlobalAlertsKey.description}`);
}

const ADD_WORLD = 'addWorld';
const worlds = ref<WorldDTO[]>([]);
const activeWorldName = ref('');
const activeWorld = computed(() => worlds.value.find(item => item.worldName === activeWorldName.value));
const isLoading = ref(false);
function fetchWorlds() {
  isLoading.value = true;
  return props.service
    .getWorlds()
    .then(data => (worlds.value = data))
    .finally(() => (isLoading.value = false));
}
fetchWorlds();

// last session
const lastSession = ref<GameLastSession | null>(null);
function getLastSession() {
  return props.service
    .getLastSession()
    .then(data => {
      if (data) lastSession.value = data;
    });
}
getLastSession();

watchEffect(() => {
  if (worlds.value.length
    && lastSession.value?.worldName
    && !activeWorldName.value
    && worlds.value.find(item => item.worldName === lastSession.value?.worldName)) {
      activeWorldName.value = lastSession.value.worldName;
  }
  if (activeWorldName.value
    && activeWorldName.value !== ADD_WORLD
    && !backups.value.has(activeWorldName.value)) {
    getBackups(activeWorldName.value);
  }
})

// backups
const backups = ref<Map<string, BackupDTO[]>>(new Map());
const isBackupsLoading = ref(false);
function getBackups(worldName: string) {
  if (!worldName || worldName === ADD_WORLD) return;
  isBackupsLoading.value = true;
  return props.service
    .getBackups(worldName)
    .then(data => {
      if (data) backups.value.set(worldName, data);
    })
    .finally(() => (isBackupsLoading.value = false));
}
const activePage = ref(1);

// comments
const isCommentFormActive = ref(false);
const isCommentSending = ref(false);
const comment = ref('');
const attachTo = ref('');
function showComment(target: string, oldValue?: string) {
  if (oldValue) comment.value = oldValue;
  attachTo.value = target;
  isCommentFormActive.value = true;
}
function sendComment() {
  if (!comment.value || !attachTo.value) return;
  isCommentSending.value = true;
  props.service
    .addComment({ comment: comment.value, attachedTo: attachTo.value })
    .then(data => {
      showAlert(data);
      fetchWorlds();
      if (activeWorld.value) getBackups(activeWorld.value.worldName);
    })
    .finally(() => {
      isCommentFormActive.value = false;
      isCommentSending.value = false;
      resetComment()
    });
}
function resetComment() {
  comment.value = '';
  attachTo.value = '';
}
function cancelComment() {
  isCommentFormActive.value = false;
  resetComment();
}
function showAlert(data: ResponseMessageDTO) {
  if (!globalAlerts) return;
  globalAlerts.addAlert({
    type: ResponseMessageLevelToType[data.level],
    text: data.key && te(data.key) ? t(data.key) : data.message,
    closable: true,
    autoClose: true,
  });
}

async function onWorldRemoved(worldName: string) {
  await fetchWorlds();
  if (worldName === activeWorldName.value) activeWorldName.value = '';
}
async function onWorldAdded() {
  await fetchWorlds();
  await getLastSession();
  activeWorldName.value = '';
}
</script>

<template>
  <div class="game-worlds py-3 px-4">
    <v-tabs v-model="activeWorldName" :mandatory="false" :show-arrows="false" center-active>
      <v-tab
        v-for="world in worlds"
        :key="world.worldName"
        :value="world.worldName"
        :active="world.worldName === activeWorldName"
      >
        {{ world.worldName }}
        <template v-if="world.worldName === lastSession?.worldName" #append>
          <v-chip variant="elevated" prepend-icon="mdi-check-decagram" color="green" density="compact">
            {{ t('worlds.last') }}
          </v-chip>
        </template>
      </v-tab>
      <v-tab
        :key="ADD_WORLD"
        :value="ADD_WORLD"
        color="primary"
        prepend-icon="mdi-plus"
        variant="elevated"
        :class="{ rounded: activeWorldName !== ADD_WORLD }"
      >
        {{ t('btn.addOne', { msg: t('worlds.one') }) }}
      </v-tab>
    </v-tabs>
    <div v-if="activeWorldName !== ADD_WORLD" class="game-worlds__world pt-4">
      <game-world-card
        v-if="activeWorld"
        :world="activeWorld"
        :service="service"
        @comment="(world) => showComment(world.worldName, world.comment)"
        @save="(worldName) => getBackups(worldName)"
        @remove="(worldName) => onWorldRemoved(worldName)"
        @upload="(worldName) => getBackups(worldName)"
      />
      <div v-if="activeWorld && backups.size" class="game-worlds__backups mt-6 pb-8">
        <v-data-iterator
          :items="backups.get(activeWorldName)"
          :page="activePage"
          :loading="isBackupsLoading"
        >
          <template #default="{ items }">
            <template v-for="(item, i) in items" :key="i">
              <game-backup
                :world="activeWorld"
                :backup="item.raw"
                :service="service"
                @comment="showComment(item.raw.saveName, item.raw.comment)"
                @restore="() => service.getLastSession()"
                @remove="(worldName) => getBackups(worldName)"
              />
            </template>
          </template>
          <template #loader>
            <div class="d-flex justify-center pa-4">
              <v-progress-circular indeterminate />
            </div>
          </template>
          <template #no-data>
            <p class="text-body-1 text-medium-emphasis pa-4">
              {{ t('backups.nodata') }}
            </p>
          </template>
        </v-data-iterator>
      </div>
      <div v-else class="game-worlds__nodata text-body-1 text-medium-emphasis pa-4">
        {{ t('worlds.choose') }}
      </div>
    </div>
    <div v-if="activeWorldName === ADD_WORLD" class="game-worlds__add">
      <add-world-form
        :service="service"
        :worlds="worlds.map(item => item.worldName)"
        :restricted="[ADD_WORLD]"
        @submit="onWorldAdded"
      />
    </div>
    <v-dialog max-width="600" v-model="isCommentFormActive" scrim="#000" @update:model-value="value => !value && cancelComment()">
      <v-card class="pa-3">
        <v-textarea v-model="comment" autofocus :label="t('form.comment.label')" />
        <v-card-actions>
          <v-btn
            color="primary"
            :disabled="!comment"
            :loading="isCommentSending"
            @click="sendComment"
          >
            {{ t('btn.submit') }}
          </v-btn>
          <v-btn @click="cancelComment">{{ t('btn.cancel') }}</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<style lang="scss" scoped>
@use "sass:map";
@use 'vuetify/settings';

.game-worlds {
  max-width: 100vw;

  @media #{map.get(settings.$display-breakpoints, 'md-and-up')} {
    max-width: calc(66.66vw - 16px);
  }
}
</style>