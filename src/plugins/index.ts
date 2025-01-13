/**
 * plugins/index.ts
 *
 * Automatically included in `./src/main.ts`
 */

// Plugins
import makeVuetifyInstance from './vuetify';
import pinia from '../stores'
import router from '../router'

// Locales
import { createVueI18nAdapter } from 'vuetify/locale/adapters/vue-i18n';
import { useI18n, type I18n } from 'vue-i18n';
import i18n from '../i18n';

// Dates
import DateFnsAdapter from '@date-io/date-fns';
import { enUS } from 'date-fns/locale/en-US';
import { ru } from 'date-fns/locale/ru';


const vuetify = makeVuetifyInstance({
  locale: {
    adapter: createVueI18nAdapter({
      i18n: i18n as I18n<any, {}, {}, string, false>,
      useI18n,
    }),
  },
  date: {
    adapter: DateFnsAdapter,
    locale: {
      en: enUS,
      ru: ru,
    },
  },
});

// Types
import type { App } from 'vue'

export function registerPlugins (app: App) {
  app
    .use(i18n)
    .use(vuetify)
    .use(router)
    .use(pinia)
}
