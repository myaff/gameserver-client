<script setup lang="ts">
import { osLogos } from '@/model/constants';
import type { OperationSystems } from '@/model/server.model';
import { defineProps, type PropType } from 'vue';
import type { VCard } from 'vuetify/components';

const props = defineProps({
  name: {
    type: String as PropType<OperationSystems>,
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
</script>

<template>
  <v-card :variant="variant" :color="color" class="provider-card" @click="emit('click')">
    <v-card-item :prepend-avatar="osLogos[name]">
      <v-card-title>{{ name }}</v-card-title>
    </v-card-item>
  </v-card>
</template>