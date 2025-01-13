<script setup lang="ts">
import { GlobalAlertsKey } from '@/model/symbols';
import type { GameService } from '@/services/game.service';
import { ref, type PropType, inject } from 'vue';
import { useI18n } from 'vue-i18n';
import type { VForm } from 'vuetify/components';

const props = defineProps({
  service: {
    type: Object as PropType<Pick<GameService, 'addWorld' | 'addComment'>>,
    required: true,
  },
  worlds: {
    type: Array as PropType<string[]>,
    default: () => [],
  },
  restricted: {
    type: Array as PropType<string[]>,
    default: () => [],
  },
});
const emit = defineEmits(['submit']);
const { t } = useI18n();

const globalAlerts = inject(GlobalAlertsKey);
if (!globalAlerts) {
  throw new Error(`Could not resolve ${GlobalAlertsKey.description}`);
}

const formEl = ref<VForm>();
const worldName = ref('');
const comment = ref('');
const isSending = ref(false);
function worldNameValidator(value: string) {
  const ns = 'form.worldName.error';
  if (!value) return t(`${ns}.required`);
  if (!/^[\w\d\-_]{2,32}$/gm.test(value)) return t(`${ns}.patternMismatch`);
  if (props.worlds.map(item => item.toLowerCase()).includes(value.toLowerCase())) return t(`${ns}.notUnique`, { msg: value });
  if (props.restricted.includes(value)) return t(`${ns}.restricted`, { msg: value });
  return true;
}
async function submit() {
  await formEl.value?.validate();
  if (!formEl.value?.isValid) return;
  Promise.all([
    props.service.addWorld(worldName.value),
    ...(comment.value && [props.service.addComment({
      comment: comment.value,
      attachedTo: worldName.value,
    })]),
  ])
  .then(() => {
    globalAlerts?.addAlert({
      title: t('OK'),
      closable: true,
      autoClose: true,
      delay: 5000,
    });
    formEl.value?.reset();
    emit('submit');
  })
  .catch(() => {
    globalAlerts?.addAlert({
      title: t('error.unknown.title'),
      text: t('error.unknown.text'),
      closable: true,
      autoClose: true,
      delay: 5000,
    });
  });
}
</script>

<template>
  <v-form ref="formEl" class="add-world-form py-8 px-4" @submit.prevent="submit">
    <v-text-field
      v-model.trim="worldName"
      :label="t('form.worldName.label') + ' *'"
      :rules="[worldNameValidator]"
      required
      autofocus
      class="mb-3"
    />
    <v-textarea
      v-model="comment"
      :label="t('form.comment.label')"
    />
    <v-btn color="primary" :loading="isSending" @click="submit">
      {{ t('btn.submit') }}
    </v-btn>
  </v-form>
</template>