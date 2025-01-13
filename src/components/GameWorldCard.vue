<script setup lang="ts">
import { useDelete } from '@/composables/useDelete';
import { type ResponseMessageDTO, ResponseMessageLevelToType } from '@/model/common.model';
import type { WorldDTO } from '@/model/game.model';
import { GlobalAlertsKey } from '@/model/symbols';
import type { GameService } from '@/services/game.service';
import { type PropType, inject, ref } from 'vue';
import { useI18n } from 'vue-i18n';

const props = defineProps({
  world: {
    type: Object as PropType<WorldDTO>,
    required: true,
  },
  service: {
    type: Object as PropType<Pick<GameService, 'deleteWorld' | 'save' | 'uploadBackup'>>,
    required: true,
  },
});
const emit = defineEmits(['comment', 'save', 'remove', 'upload']);
const { t, te } = useI18n();
const globalAlerts = inject(GlobalAlertsKey);
if (!globalAlerts) {
  throw new Error(`Could not resolve ${GlobalAlertsKey.description}`);
}

// remove
const {
  isDeleteActive,
  isDeleting,
  shitToDelete,
  askDelete,
  deleteShit,
  cancelDelete,
} = useDelete<string>({
  entity: 'worlds',
  t, te,
  onSuccess: () => emit('remove', props.world.worldName),
  globalAlerts,
});

// save
const isSaving = ref(false);
function save(worldName: string) {
  isSaving.value = true;
  props.service
    .save(worldName)
    .then(data => {
      showAlert(data);
      emit('save', props.world.worldName);
    })
    .finally(() => (isSaving.value = false));
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

// upload
const fileToUpload = ref<File | null>(null);
const isUploadActive = ref(false);
const isUploading = ref(false);
function askUpload() {
  isUploadActive.value = true;
}
function uploadBackup() {
  if (!fileToUpload.value) return;
  isUploading.value = true;
  props.service.uploadBackup(props.world.worldName, fileToUpload.value)
    .then(data => {
      if (data.toLowerCase() === 'ok') {
        globalAlerts?.addAlert({
          title: t('OK'),
          type: 'success',
          closable: true,
          autoClose: true,
          delay: 5000,
        });
      }
      isUploadActive.value = false;
      resetUpload();
      emit('upload', props.world.worldName);
    })
    .finally(() => isUploading.value = false);
}
function resetUpload() {
  fileToUpload.value = null;
}
function cancelUpdload() {
  isUploadActive.value = false;
  resetUpload();
}
const isCommentHovered = ref(false);
</script>

<template>
  <v-card class="game-world-card" variant="text">
    <v-card-title>{{ world.worldName }}</v-card-title>
    <v-card-item
      prepend-icon="mdi-comment-edit"
      class="game-world-card__comment pt-4 rounded cursor-text"
      :class="{ 'align-start': world.comment, 'bg-surface': isCommentHovered }"
      @click="$emit('comment', { world })"
      @mouseenter="(isCommentHovered = true)"
      @mouseleave="(isCommentHovered = false)"
    >
      <v-card-subtitle v-if="world.comment" class="text-body-2 text-pre-wrap cursor-text">
        {{ world.comment }}
      </v-card-subtitle>
      <span v-else class="text-button text-medium-emphasis">
        {{ t('btn.comment') }}
      </span>
    </v-card-item>
    <div class="d-flex flex-column flex-sm-row ga-4 mt-4">
      <v-btn
        prepend-icon="mdi-content-save"
        color="primary"
        :loading="isSaving"
        :size="$vuetify.display.xs ? 'large' : 'default'"
        class="w-100 w-sm-auto"
        @click="save(world.worldName)"
      >
        {{ t('worlds.save') }}
      </v-btn>
      <v-btn
        prepend-icon="mdi-upload"
        color="primary"
        :loading="isUploading"
        :size="$vuetify.display.xs ? 'large' : 'default'"
        class="w-100 w-sm-auto"
        @click="askUpload()"
      >
        {{ t('btn.upload') }}
      </v-btn>
      <v-btn
        prepend-icon="mdi-delete"
        color="red"
        :loading="isDeleting"
        :size="$vuetify.display.xs ? 'large' : 'default'"
        class="w-100 w-sm-auto"
        @click="askDelete(world.worldName)"
      >
        {{ t('btn.deleteOne', { msg: t('worlds.one') }) }}
      </v-btn>
    </div>

    <v-dialog v-model="isDeleteActive" width="auto" max-width="600">
      <v-card
        prepend-icon="mdi-alert-circle"
        :title="t('delete.title')"
        :text="t('delete.text', { msg: t('worlds.one')})">
        <v-card-actions class="pb-4">
          <v-btn
            v-if="shitToDelete"
            color="red"
            size="large"
            :loading="isDeleting"
            @click="deleteShit(() => service.deleteWorld(shitToDelete as string))"
          >
            {{ t('btn.delete') }}
          </v-btn>
          <v-btn size="large" :disabled="isDeleting" @click="cancelDelete">
            {{ t('btn.cancel') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="isUploadActive" width="auto" max-width="600">
      <v-card class="pa-4">
        <v-card-title>{{ t('backups.upload.title') }}</v-card-title>
        <p class="text-body-1 text-medium-emphasis px-4 my-4 text-pre-wrap">{{ t('backups.upload.text') }}</p>
        <v-file-input v-model="fileToUpload" :label="t('backups.upload.label')" class="ma-4" />
        <v-card-actions>
          <v-btn
            color="primary"
            :disabled="!fileToUpload"
            :loading="isUploading"
            @click="uploadBackup"
          >
            {{ t('btn.submit') }}
          </v-btn>
          <v-btn @click="cancelUpdload">{{ t('btn.cancel') }}</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<style lang="scss" scoped>
.game-world-card {
  &__comment {
    transition: background-color .5s ease;
  }
}
</style>