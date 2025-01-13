<script setup lang="ts">
import { useVuelidate } from '@vuelidate/core';
import { required, minLength } from '@vuelidate/validators';
import { useI18n } from 'vue-i18n';
import { defineProps, defineModel, defineEmits, type Ref } from 'vue';
import type { AuthFormData } from '@/model/auth.model';
const { t } = useI18n();

const props = defineProps({
  loading: {
    type: Boolean,
    default: false,
  },
});
const emits = defineEmits(['submit']);

const rules = {
  username: { required },
  password: { required, minLength: minLength(8) },
}
const formData = defineModel<AuthFormData>();
const $v = useVuelidate(rules, formData as Ref<AuthFormData>);
const submit = async () => {
  const isValid = await $v.value.$validate();
  if (!isValid) return;
  emits('submit', formData);
}
</script>

<template>
  <v-form v-if="formData" class="text-left" @keyup.enter="submit">
    <v-text-field
      v-model="formData.username"
      :label="t('form.username.label')"
      required
      :error-messages="$v.username.$errors.map(e => e.$message as string)"
      type="text"
      class="mb-4"
      @blur="$v.username.$touch"
    />
    <v-text-field
      v-model="formData.password"
      :label="t('form.password.label')"
      required
      :error-messages="$v.password.$errors.map(e => e.$message as string)"
      type="password"
      class="mb-4"
      @blur="$v.password.$touch"
    />
    <v-btn
      size="x-large"
      color="primary"
      :loading="loading"
      @click="submit"
    >
      {{ t('btn.submit') }}
    </v-btn>
  </v-form>
</template>