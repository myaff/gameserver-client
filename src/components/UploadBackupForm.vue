<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useDisplay } from 'vuetify';

const { t } = useI18n();
const files = ref<File[]>([]);
const { mobile } = useDisplay();
const maxShown = computed(() => {
  return mobile.value ? 2 : 4;
})

function parseTribe(value: string) {
  // const reg = /.*TribeName\W*StrProperty\W*(?<TribeName>[\w\s]*)\s\W.*MembersPlayerName\W*ArrayProperty\W*StrProperty\W*(?<MembersPlayerName>[\w\s]*)\s/gm;
  const reg = /.*TribeName\W*StrProperty\W*(?<TribeName>[\w\s]*)\s/gm;
  const match = value.match(reg);
  console.log(match);

  return value
    .split(' ')
    .map(elem => String.fromCharCode(parseInt(elem, 2)))
    .join('');
}

watch(files, value => {
  console.log(value);
  value.forEach(item => {
    const reader = new FileReader();
    // reader.readAsText(item);
    reader.readAsArrayBuffer(item);
    reader.onloadend = function() {
      console.log(item.name);
      // const strRes = reader.result?.toString();
      // if (strRes) console.log(parseTribe(strRes));
      const uint32 = new Uint32Array(reader.result as ArrayBuffer);
      const view = new DataView(reader.result as ArrayBuffer);
      view.setUint32(1, 4294967295); // Max unsigned 32-bit integer

      console.log(view.getUint32(1));
      // console.log(uint32);

      // const dec = new TextDecoder().decode(reader.result);
      // console.log(dec);
    }
  })
})

function submit() {
  console.log(files.value);
}
</script>

<template>
  <v-form class="upload-backup-form py-8 px-4" @submit.prevent="submit">
    <v-file-input v-model="files" multiple clearable :center-affix="false">
      <template #selection="{ fileNames }">
        <template v-for="(fileName, i) in fileNames" :key="fileName">
          <v-chip
          v-if="i < maxShown"
          class="me-2"
          size="small"
          label
        >
          {{ fileName }}
        </v-chip>

        <span
          v-else-if="i === maxShown"
          class="text-overline text-grey-darken-1 mx-2"
        >
          +{{ t('backups.upload.files', files.length - maxShown) }}
        </span>
        </template>
      </template>
    </v-file-input>
  </v-form>
</template>