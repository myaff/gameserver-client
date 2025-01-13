<script lang="ts" setup>
import type { UiAlert } from '@/model/ui.model';
import { useI18n } from 'vue-i18n';
import { reactive, ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/stores/user';

const router = useRouter();
const userStore = useUserStore();
const { t, te } = useI18n();
const formData = reactive({
  username: 'arkAdmin',
  password: 'W#1c0me!',
});
const isLoading = ref(false);
const resError: Ref<UiAlert | null> = ref(null);
const showError = ref(false);
watch(resError, value => (showError.value = !!value));
const submit = async () => {
  console.log('Login submit', formData);
  userStore.login(formData).then(() => {
    router.push({ name: 'home' });
  });
}
</script>

<template>
  <div class="view view-login text-center">
    <div class="text-h3 mb-8">{{ t('signin.title') }}</div>
    <LoginForm v-model="formData" :is-loading="isLoading" @submit="submit" />
    <v-bottom-sheet v-model="showError" inset>
      <v-alert :title="resError?.title" type="error">
        {{ resError?.message }}
      </v-alert>
    </v-bottom-sheet>
  </div>
</template>


