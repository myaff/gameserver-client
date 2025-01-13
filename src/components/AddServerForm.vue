<script setup lang="ts">
import type { ServerProviders, OperationSystems, AddServerData } from '@/model/server.model';
import { GlobalAlertsKey } from '@/model/symbols';
import { useServersStore } from '@/stores/servers';
import { computed, ref, watch, reactive, inject } from 'vue';
import { useI18n } from 'vue-i18n';
import type { VForm } from 'vuetify/components';

const { t } = useI18n();
const serversStore = useServersStore();
const emit = defineEmits(['added']);

const globalAlerts = inject(GlobalAlertsKey);
if (!globalAlerts) {
  throw new Error(`Could not resolve ${GlobalAlertsKey.description}`);
}

const providers = computed(() => serversStore.supportedProviders);
const oss = computed(() => serversStore.supportedOSs);
const config = computed(() => serversStore.providersConfig);
if (!providers.value.length || !oss.value.length) serversStore.getInfo();
if (!config.value) serversStore.getConfig();
const provider = ref<ServerProviders | null>(null);
const os = ref<OperationSystems | null>(null);
const providerError = ref(false);
const osError = ref(false);
const isValid = computed(() => !providerError.value && !osError.value && (form.value?.isValid || false));
const isSending = ref(false);
const providerConfig = computed(() => {
  if (!config.value || !provider.value) return [];
  return config.value[provider.value];
});
const formData = reactive<Pick<AddServerData, 'name' | 'ipAddress' | 'port'>>({
  name: '',
  ipAddress: '',
  port: '',
});
const providerFormData = reactive<{ [key: string]: string }>({});
watch(providerConfig, value => {
  value.forEach(field => {
    providerFormData[field.name] = '';
  });
  form.value?.resetValidation();
});
watch(provider, value => {
  if (value) providerError.value = false;
});
watch(os, value => {
  if (value) osError.value = false;
});
const form = ref<VForm>();
const validate = async () => {
  providerError.value = !provider.value;
  osError.value = !os.value;
  await form.value?.validate();
}
const reset = () => {
  formData.name = '';
  formData.ipAddress = '';
  formData.port = '';
  provider.value = null;
  os.value = null;
  form.value?.reset();
}
const submit = async () => {
  await validate();
  if (isValid.value) {
    isSending.value = true;
    serversStore
      .addServer({
        ...formData,
        ...providerFormData,
        providerName: provider.value as string,
        operationSystem: os.value as string,
      })
      .then(data => {
        globalAlerts.addAlert({
          title: t('servers.add.success.title', { msg: data.name }),
          type: 'success',
          closable: true,
          autoClose: true,
        });
        reset();
        emit('added', data);
      })
      .finally(() => isSending.value = false);
  }
}
</script>

<template>
  <v-form ref="form" class="add-server pa-5" @submit.prevent="submit">
    <h4 class="text-h4 mb-4">{{ t('servers.add.title') }}</h4>
    <v-row v-if="providers.length">
      <v-col cols="12" class="pb-1">
        <p class="text-subtitle-1 text-medium-emphasis" :class="{'text-error': providerError}">
          {{ t('servers.add.provider.label') + ' *' }}
        </p>
      </v-col>
      <v-col v-for="item in providers" :key="item" cols="6">
        <provider-card
          :name="item"
          :variant="provider === item ? 'outlined' : 'tonal'"
          :color="provider === item ? 'primary' : providerError ? 'error' : undefined"
          @click="provider = item"
        />
      </v-col>
    </v-row>
    <v-row v-if="providers.length" class="mt-4">
      <v-col cols="12" class="pb-1">
        <p class="text-subtitle-1 text-medium-emphasis" :class="{'text-error': osError}">
          {{ t('servers.add.os.label') + ' *' }}
        </p>
      </v-col>
      <v-col v-for="item in oss" :key="item" cols="12" sm="6">
        <os-card
          :name="item"
          :variant="os === item ? 'outlined' : 'tonal'"
          :color="os === item ? 'primary' : osError ? 'error' : undefined"
          @click="os = item"
        />
      </v-col>
    </v-row>
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