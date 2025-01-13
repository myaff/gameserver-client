<script setup lang="ts">
import { type GameDetailsDTO } from '@/model/game.model';
import { type PropType, defineProps } from 'vue';

const props = defineProps({
  details: {
    type: Object as PropType<GameDetailsDTO>,
    required: true,
  },
});
</script>
<template>
  <div class="game-detail-main-info pt-4 px-6 pb-8">
    <raw-html-text :content="details.about_the_game" />
  </div>
</template>