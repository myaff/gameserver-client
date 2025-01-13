<script setup lang="ts">
import { type GameDetailsDTO } from '@/model/game.model';
import { type PropType, defineProps, ref, computed } from 'vue';

const props = defineProps({
  details: {
    type: Object as PropType<Pick<GameDetailsDTO, 'pc_requirements' | 'mac_requirements' | 'linux_requirements'>>,
    required: true,
  },
});
const activeTab = ref('');
const tabs = computed(() => {
  const arr = [];
  if (props.details?.pc_requirements) arr.push({
    title: 'PC',
    value: 'pc',
    content: props.details.pc_requirements,
  });
  if (props.details?.mac_requirements) arr.push({
    title: 'MAC',
    value: 'mac',
    content: props.details.mac_requirements,
  });
  if (props.details?.linux_requirements) arr.push({
    title: 'Linux',
    value: 'linux',
    content: props.details.linux_requirements,
  });
  return arr;
})
</script>
<template>
  <div class="game-detail-rerquirenments py-3 px-4">
    <v-tabs v-model="activeTab">
      <v-tab v-for="tab in tabs" :key="tab.value" :value="tab.value">
        {{ tab.title }}
      </v-tab>
    </v-tabs>
    <v-tabs-window v-model="activeTab">
      <v-tabs-window-item
        v-for="tab in tabs"
        :key="tab.value"
        :value="tab.value"
      >
        <v-card v-for="(value, key) in tab.content" :key="key" class="my-2">
          <raw-html-text v-if="value" :content="value" class="py-3 px-8" />
        </v-card>
      </v-tabs-window-item>
    </v-tabs-window>
  </div>
</template>

<style lang="scss" scoped>
.game-detail-rerquirenments {

}
</style>