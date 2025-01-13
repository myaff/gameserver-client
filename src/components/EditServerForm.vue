<script setup lang="ts">
import type { AddServerData, ServerDTO } from '@/model/server.model';
import { GlobalAlertsKey } from '@/model/symbols';
import { useServersStore } from '@/stores/servers';
import { computed, ref, watch, reactive, inject, type PropType } from 'vue';
import { useI18n } from 'vue-i18n';
import type { VForm } from 'vuetify/components';

const { t } = useI18n();
const props = defineProps({
  server: {
    type: Object as PropType<ServerDTO>,
    required: true,
  },
});
const serversStore = useServersStore();
const emit = defineEmits(['edited']);

const globalAlerts = inject(GlobalAlertsKey);
if (!globalAlerts) {
  throw new Error(`Could not resolve ${GlobalAlertsKey.description}`);
}

const config = computed(() => serversStore.providersConfig);
if (!config.value) serversStore.getConfig();
const isValid = computed(() => (form.value?.isValid || false));
const isSending = ref(false);
const providerConfig = computed(() => {
  if (!config.value) return [];
  return config.value[props.server.providerName];
});
const formData = reactive<Pick<AddServerData, 'name' | 'ipAddress' | 'port'>>({
  name: props.server.name,
  ipAddress: props.server.host.split(':').at(0) || '',
  port: props.server.host.split(':').at(1) || '',
});
const providerFormData = reactive<{ [key: string]: string }>({});
watch(providerConfig, value => {
  value.forEach(field => {
    providerFormData[field.name] = '';
  });
  form.value?.resetValidation();
});
const form = ref<VForm>();

const submit = async () => {
  await form.value?.validate();
  if (isValid.value) {
    isSending.value = true;
    serversStore
      .editServer(props.server.id, {
        ...formData,
        ...providerFormData,
        providerName: props.server.providerName as string,
        operationSystem: props.server.operationSystem as string,
      })
      .then(() => {
        globalAlerts.addAlert({
          title: t('servers.edit.success.title', { msg: props.server.name }),
          type: 'success',
          closable: true,
          autoClose: true,
        });
        emit('edited');
      })
      .finally(() => isSending.value = false);
  }
}
</script>

<template>
  <v-form ref="form" class="add-server pa-5" @submit.prevent="submit">
    <h4 class="text-h4 mb-4">{{ t('servers.edit.title') }}</h4>
    <v-row class="mt-4">
      <v-col v-for="field, key in formData" :key="key" cols="12">
        <v-text-field
          v-model="formData[key]"
          :name="(key as string)"
          :required="true"
          type="text"
          :label="t(`servers.add.${key}.label`) + ' *'"
          :rules="[value => !!value || t('servers.add.config.required')]"
        />
      </v-col>
    </v-row>
    <v-row v-if="providerConfig.length" class="mt-4">
      <v-col cols="12">
        <p class="text-subtitle-1 text-medium-emphasis mb-1">{{ t('servers.add.config.label') }}</p>
      </v-col>
      <v-col v-for="field in providerConfig" :key="field.name" cols="12">
        <v-text-field
          v-model="providerFormData[field.name]"
          :name="field.name"
          :required="field.required"
          :type="field.type"
          :label="field.name.replace('_', ' ') + ' *'"
          :rules="[value => !!value || t('servers.add.config.required')]"
        />
      </v-col>
    </v-row>
    <div class="add-server__actions d-flex justify-center mt-6">
      <v-btn
        :disabled="!isValid"
        :loading="isSending"
        color="primary"
        size="large"
        class="mx-auto"
        @click="submit"
      >
        {{ t('btn.submit') }}
      </v-btn>
    </div>
  </v-form>
</template>