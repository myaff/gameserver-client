<script setup lang="ts">
import { useDelete } from '@/composables/useDelete';
import { type ResponseMessageDTO, ResponseMessageLevel, ResponseMessageLevelToType } from '@/model/common.model';
import type { BackupDTO, BackupFileDTO, WorldDTO } from '@/model/game.model';
import { GlobalAlertsKey } from '@/model/symbols';
import type { GameService } from '@/services/game.service';
import { StorageService } from '@/services/storage.service';
import type { AxiosProgressEvent } from 'axios';
import { type PropType, inject, ref } from 'vue';
import { useI18n } from 'vue-i18n';

const props = defineProps({
  world: {
    type: Object as PropType<Pick<WorldDTO, 'worldName'>>,
    required: true,
  },
  backup: {
    type: Object as PropType<BackupDTO>,
    required: true,
  },
  service: {
    type: Object as PropType<Pick<GameService, 'deleteBackup' | 'restore' | 'downloadBackup' | 'getFiles'>>,
    required: true,
  },
});
const emit = defineEmits(['restore', 'comment', 'download', 'remove']);
const { d, t, te } = useI18n();

const globalAlerts = inject(GlobalAlertsKey);
if (!globalAlerts) {
  throw new Error(`Could not resolve ${GlobalAlertsKey.description}`);
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

// delete
const {
  isDeleteActive,
  isDeleting,
  shitToDelete,
  askDelete,
  deleteShit,
  cancelDelete,
} = useDelete<{ world: string; backup: string }>({
  entity: 'backups',
  t, te,
  onSuccess: () => emit('remove', props.world.worldName),
  globalAlerts,
});

// restore
const isRestoring = ref(false);
function restore() {
  isRestoring.value = true;
  props.service.restore(props.world.worldName, props.backup.saveName)
    .then(data => {
      showAlert(data);
      emit('restore')
    })
    .finally(() => (isRestoring.value = false));
}

// download
const isDownloading = ref(false);
const downloadingProgress = ref(0);
function downloadBackup() {
  isDownloading.value = true;
  props.service
    .downloadBackup(props.world.worldName, props.backup.saveName)
    .then(async data => {
      if (data.level === ResponseMessageLevel.OK) {
        const storageService = new StorageService();
        await storageService.getFile(data.message, onProgress);
        emit('download');
      }
    })
    .finally(() => {
      isDownloading.value = false;
      downloadingProgress.value = 0;
    });
}
function onProgress(event: AxiosProgressEvent) {
  if (event.progress) downloadingProgress.value = event.progress * 100;
}
const isCommentHovered = ref(false);

// files
const backupFiles = ref<BackupFileDTO[]>([]);
const isFilesLoading = ref(false);
function getFiles() {
  isFilesLoading.value = true;
  return props.service
    .getFiles(props.world.worldName, props.backup.saveName)
    .then(data => {
      if (data) backupFiles.value = data;
    })
    .finally(() => isFilesLoading.value = false);
}
function onToggle(isOpened: boolean) {
  if (isOpened && !backupFiles.value.length) getFiles();
}
</script>

<template>
  <v-card class="game-backup mt-3 d-sm-flex flex-sm-wrap align-start">
    <v-card-item class="flex-sm-1-0">
      <v-card-title class="text-body-1 text-sm-h6">
        {{ backup.saveName }}
      </v-card-title>
      <v-card-subtitle class="text-body-2 text-sm-body-1 mt-1">
        {{ d(backup.createDate, 'long') }}
      </v-card-subtitle>
    </v-card-item>
    <v-card-item
      prepend-icon="mdi-comment-edit"
      :class="{ 'align-start': backup.comment, 'bg-surface-light': isCommentHovered }"
      class="game-backup__comment w-sm-100 order-sm-3 cursor-text"
      @click="$emit('comment')"
      @mouseenter="(isCommentHovered = true)"
      @mouseleave="(isCommentHovered = false)"
    >
      <v-card-subtitle v-if="backup.comment" class="text-body-2 text-pre-wrap">
        {{ backup.comment }}
      </v-card-subtitle>
      <span v-else class="text-button text-medium-emphasis cursor-text">
        {{ t('btn.comment') }}
      </span>
    </v-card-item>
    <v-card-actions class="flex-sm-0-1 flex-wrap">
      <v-btn prepend-icon="mdi-backup-restore" :disabled="isRestoring" @click="restore">
        {{ t('btn.restore') }}
      </v-btn>
      <v-btn
        prepend-icon="mdi-download"
        :disabled="isRestoring"
        :loading="isDownloading"
        @click="downloadBackup"
      >
        {{ t('btn.download') }}
        <template #loader>
          <v-progress-circular
            size="24"
            width="2"
            :model-value="downloadingProgress"
            :indeterminate="!downloadingProgress"
          />
        </template>
      </v-btn>
      <v-btn
        prepend-icon="mdi-delete"
        color="red"
        :disabled="isRestoring"
        :loading="isDeleting"
        @click="askDelete({ world: world.worldName, backup: props.backup.saveName })"
      >
        {{ t('btn.delete') }}
      </v-btn>
    </v-card-actions>
    <v-expansion-panels class="order-5">
      <v-expansion-panel :title="t('backups.files.title')" @group:selected="(val) => onToggle(val.value)">
        <v-expansion-panel-text>
          <div v-if="isFilesLoading" class="game-backup__files-loading w-100 d-flex py-4 justify-center">
            <v-progress-circular indeterminate />
          </div>
          <div v-else-if="backupFiles.length" class="game-backup__files">
            <div v-for="(item, i) in backupFiles" :key="item.fileName" class="game-backup__file px-0 py-2 d-sm-flex align-center border-b-1" :class="{'border-b': i < backupFiles.length - 1}">
              <div class="game-backup__file-name flex-sm-1-0 text-body-1">
                {{ item.fileName }}
              </div>
              <div class="game-backup__file-date mt-1 flex-sm-0-0 text-body-2 text-medium-emphasis">
                {{ d(item.createDate, 'long') }}
              </div>
            </div>
          </div>
          <div v-else class="text-body-1 text-medium-emphasis pa-4">
            {{ t('backups.files.nodata') }}
          </div>
        </v-expansion-panel-text>
      </v-expansion-panel>
    </v-expansion-panels>
    <v-dialog v-model="isDeleteActive" width="auto" max-width="600" scrim="#000">
      <v-card
        prepend-icon="mdi-alert-circle"
        :title="t('delete.title')"
        :text="t('delete.text', { msg: t('backups.one')})">
        <v-card-actions class="pb-4">
          <v-btn
            v-if="shitToDelete?.world && shitToDelete?.backup"
            color="red"
            size="large"
            :loading="isDeleting"
            @click="deleteShit(() => service.deleteBackup(shitToDelete!.world, shitToDelete!.backup))"
          >
            {{ t('btn.delete') }}
          </v-btn>
          <v-btn size="large" :disabled="isDeleting" @click="cancelDelete">
            {{ t('btn.cancel') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<style lang="scss" scoped>
.game-backup {
  &__comment {
    transition: background-color .5s ease;
  }
}
</style>