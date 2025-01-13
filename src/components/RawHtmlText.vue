<script setup lang="ts">
import { defineProps, type PropType } from 'vue';
defineProps({
  content: {
    type: String,
    required: true,
  },
  size: {
    type: [String, Number],
    default: '1',
  },
  emphasis: {
    type: String as PropType<'high' | 'medium' | 'low'>,
    default: 'medium',
  },
});
</script>

<template>
  <div
    class="raw-html-text"
    :class="[`text-body-${size}`,
    `text-${emphasis}-emphasis`]"
    v-html="content"
  />
</template>

<style lang="scss" scoped>
.raw-html-text {
  :deep(ul),
  :deep(ol) {
    margin: 1em 0;
    padding-left: 1em;
  }
  :deep(li) {
    margin: 0.5em 0;
  }
  :deep(h1) {
    margin: 0.75em 0 0.5em;
  }
  :deep(h2),
  :deep(h3),
  :deep(h4) {
    margin: 1em 0 0.75em;
  }
  :deep(img) {
    display: block;
    margin: 1.5em auto;
    max-width: 100%;
  }
  :deep(p) {
    margin: 1em 0;
  }
}
</style>