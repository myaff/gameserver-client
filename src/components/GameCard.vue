<script setup lang="ts">
import { GameInstallationStatus, GameSupportStatus, type GameDetailsDTO, type GameDTO } from '@/model/game.model';
import { type PropType, defineProps, computed } from 'vue';

const props = defineProps({
  game: {
    type: Object as PropType<GameDTO>,
    required: true,
  },
  details: {
    type: Object as PropType<GameDetailsDTO>,
    default: () => ({}),
  },
  status: {
    type: String as PropType<GameSupportStatus | GameInstallationStatus>,
  },
  statusPosition: {
    type: String as PropType<'aside' | 'bottom'>,
    default: 'bottom',
  },
  variant: {
    type: String as PropType<'default' | 'small'>,
    default: 'default',
  },
});
const subtitle = computed(() => {
  if (!props.details.publishers && !props.details.release_date) return '';
  return [props.details.publishers?.join(', '), props.details.release_date?.date].join(', ');
});
const titleClass = computed(() => props.variant === 'small' ? 'text-body-1' : 'text-h6');
const subtitleClass = computed(() => props.variant === 'small' ? 'text-body-1' : 'text-body-2');
</script>

<template>
  <v-card class="game-card d-flex flex-column">
    <v-img
      v-if="details"
      :src="details.header_image"
      :aspect-ratio="572/267"
      class="flex-0-0"
    />
    <v-card-item class="flex-1-1 align-content-start">
      <v-card-title :class="titleClass" class="text-wrap">
        {{ game.name }}
      </v-card-title>
      <v-card-subtitle v-if="subtitle" :class="subtitleClass" class="text-wrap mt-2">
        {{ subtitle }}
      </v-card-subtitle>
      <template v-if="status && statusPosition === 'aside'" #append>
        <game-status-chip :status="status" />
      </template>
    </v-card-item>
    <v-card-actions v-if="(status && statusPosition === 'bottom') || $slots.actions" class="px-4 pt-1 pb-4">
      <game-status-chip v-if="status" :status="status" />
      <slot name="actions" />
    </v-card-actions>
  </v-card>
</template>