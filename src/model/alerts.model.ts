import type { VAlert } from 'vuetify/components';

export interface AutoClosable {
  autoClose?: boolean;
  delay?: number;
}

export type GlobalAlert = VAlert['$props'] & AutoClosable;

export interface GlobalAlerts {
  queue: GlobalAlert[];
  addAlert: (alert: GlobalAlert) => void;
  removeAlert: (index: number) => void;
}