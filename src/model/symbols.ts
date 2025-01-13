import type { InjectionKey } from 'vue';
import type { GlobalAlerts } from './alerts.model';

export const GlobalAlertsKey: InjectionKey<GlobalAlerts> = Symbol('GlobalAlerts');