<script setup lang="ts">
import { osLogos, providersLogos } from '@/model/constants';
import type { ServerDTO } from '@/model/server.model';
import { type PropType, computed, defineProps } from 'vue';
import { useI18n } from 'vue-i18n';
import type { RouteLocationAsRelativeGeneric, RouteLocationAsPathGeneric } from 'vue-router';

const { t } = useI18n();
const props = defineProps({
  server: {
    type: Object as PropType<ServerDTO>,
    required: true,
  },
  to: {
    type: [String, Object] as PropType<string | RouteLocationAsRelativeGeneric | RouteLocationAsPathGeneric | undefined>,
  },
});
const emit = defineEmits(['edit', 'delete'])
const providerLogo = computed(() => providersLogos[props.server.providerName]);
const osLogo = computed(() => osLogos[props.server.operationSystem]);
</script>

<template>
  <v-card
    :to="props.to"
    class="server-card">
    <div class="server-card__provider pa-4 bg-white">
      <v-img :src="providerLogo" :aspect-ratio="4" />
    </div>
    <v-card-item :prepend-avatar="osLogo">
      <v-card-title>{{ server.name }}</v-card-title>
      <v-card-subtitle>{{ server.host }}</v-card-subtitle>
      <template #append>
        <v-tooltip :text="t('servers.edit.tooltip')">
          <template #activator="{ props }">
            <v-btn
              icon="mdi-pencil"
              variant="plain"
              v-bind="props"
              @click.prevent.stop="emit('edit')"
            />
          </template>
        </v-tooltip>
        <v-tooltip :text="t('servers.delete.tooltip')">
          <template #activator="{ props }">
            <v-btn
              icon="mdi-delete"
              color="red"
              variant="plain"
              v-bind="props"
              @click.prevent.stop="emit('delete')"
            />
          </template>
        </v-tooltip>
        <slot name="append" />
      </template>
    </v-card-item>
  </v-card>
</template>