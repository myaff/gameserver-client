<script lang="ts" setup>
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
const { t, locale, availableLocales } = useI18n();
const locales = computed(() => availableLocales.map(item => ({
  value: item,
  title: t(`locale.${item}`)
})));
</script>

<template>
  <v-select v-model="locale" :items="locales" variant="plain" />
</template>