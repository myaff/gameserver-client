<script setup lang="ts">
import { providersLogos } from '@/model/constants';
import type { ServerProviders } from '@/model/server.model';
import { defineProps, computed, type PropType } from 'vue';
import type { VCard } from 'vuetify/components';

const props = defineProps({
  name: {
    type: String as PropType<ServerProviders>,
    required: true,
  },
  variant: {
    type: String as PropType<VCard['$props']['variant']>,
    default: 'tonal',
  },
  color: {
    type: String as PropType<VCard['$props']['color']>,
    default: undefined,
  },
});
const emit = defineEmits(['click']);
const title = computed(() => props.name.replace('_', ' ').toLowerCase());
</script>

<template>
  <v-card :variant="variant" :color="color" class="provider-card" @click="emit('click')">
    <div class="server-card__provider pa-4 bg-white">
      <v-img :src="providersLogos[name]" :aspect-ratio="4" />
    </div>
    <v-card-item>
      <v-card-title class="text-capitalize">{{ title }}</v-card-title>
    </v-card-item>
  </v-card>
</template>