<script setup lang="ts">
import { GameSupportStatus, GameInstallationStatus } from '@/model/game.model';
import { type PropType, defineProps } from 'vue';
import { useI18n } from 'vue-i18n';
import type { VChip } from 'vuetify/components';

defineProps({
  status: {
    type: String as PropType<GameSupportStatus | GameInstallationStatus>,
    required: true,
  },
  variant: {
    type: String as PropType<VChip['$props']['variant']>,
    default: 'tonal',
  },
});
const { t } = useI18n();
const statusIcon = {
  [GameSupportStatus.FULL]: 'mdi-check-decagram',
  [GameSupportStatus.INSTALL]: 'mdi-check',
  [GameSupportStatus.PLANNED]: 'mdi-pin',
  [GameInstallationStatus.INSTALLED]: 'mdi-check',
  [GameInstallationStatus.AVAILABLE]: 'mdi-download',
  [GameInstallationStatus.UNAVAILABLE]: 'mdi-minus-circle',
  [GameInstallationStatus.INSTALLATION_STARTED]: 'mdi-progress-download',
  [GameInstallationStatus.INSTALLATION_FAILED]: 'mdi-progress-close',
};
const statusColor = {
  [GameSupportStatus.FULL]: 'success',
  [GameSupportStatus.INSTALL]: 'info',
  [GameSupportStatus.PLANNED]: 'error',
  [GameInstallationStatus.INSTALLED]: 'success',
  [GameInstallationStatus.AVAILABLE]: 'info',
  [GameInstallationStatus.UNAVAILABLE]: 'default',
  [GameInstallationStatus.INSTALLATION_STARTED]: 'info',
  [GameInstallationStatus.INSTALLATION_FAILED]: 'error',
}
</script>

<template>
  <v-chip
    :prepend-icon="statusIcon[status]"
    :color="statusColor[status]"
    :variant="variant">
    {{ t(`games.status.${status}`) }}
  </v-chip>
</template>