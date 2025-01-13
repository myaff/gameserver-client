<script setup lang="ts">
import { ServerStatus, type ServerDetailDTO, type ServerDTO } from '@/model/server.model';
import { type PropType, computed } from 'vue';
import { useI18n } from 'vue-i18n';

const { t, te } = useI18n();
const props = defineProps({
  server: {
    type: Object as PropType<ServerDTO>,
    required: true,
  },
  details: {
    type: Object as PropType<ServerDetailDTO | null>,
  },
  updating: {
    type: Boolean,
    default: false,
  },
});
const emit = defineEmits(['change-status', 'edit', 'delete']);
const features = computed(() => {
  const arr: { title: string; value: string; }[] = [];
  if (props.details?.cpu) arr.push({
    title: t('servers.features.cpu'),
    value: props.details.cpu,
  });
  if (props.details?.ram) arr.push({
    title: t('servers.features.ram'),
    value: `${parseInt(props.details.ram) / 1024}Gb`,
  });
  if (props.details?.discSizes) arr.push({
    title: t('servers.features.disc'),
    value: props.details.discSizes.map(item => `${item}Gb`).join(', '),
  });
  if (props.details?.datacenter) arr.push({
    title: t('servers.features.datacenter'),
    value: props.details.datacenter,
  });
  if (props.details?.billing) arr.push({
    title: t('servers.features.billing'),
    value: te(`servers.features.${props.details.billing}`)
      ? t(`servers.features.${props.details.billing}`)
      : props.details.billing,
  });
  return arr;
});
const statusTo = {
  [ServerStatus.ON]: ServerStatus.OFF,
  [ServerStatus.OFF]: ServerStatus.ON,
};
const statusColor = {
  [ServerStatus.ON]: 'green-accent-3',
  [ServerStatus.OFF]: 'red',
}
</script>

<template>
  <server-card
    :server="server"
    class="server-info"
    variant="flat"
    @edit="emit('edit')"
    @delete="emit('delete')"
  >
    <template v-if="details" #append>
      <v-tooltip :text="t(`servers.status.${statusTo[details.status]}`)">
        <template #activator="{ props }">
          <v-btn
            icon="mdi-power"
            :color="statusColor[details.status]"
            :loading="updating"
            variant="plain"
            v-bind="props"
            @click.prevent.stop="emit('change-status', statusTo[details.status])"
          />
        </template>
      </v-tooltip>
    </template>
  </server-card>
  <section class="features-list py-4 px-4 text-body-1">
    <dl v-for="(item, i) in features" :key="i" class="features-list__item d-flex py-3 border-t-sm">
      <dt class="featutes-list_term w-50 text-medium-emphasis">{{ item.title + ':' }}</dt>
      <dd class="featutes-list_def">{{ item.value }}</dd>
    </dl>
  </section>
</template>