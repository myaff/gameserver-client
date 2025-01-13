import type { RouteMeta } from "vue-router";

export interface RouteMetaNavItem {
  key: string;
  icon?: string;
}
export interface RouteMetaNav extends RouteMeta {
  nav: {
    [key: string]: RouteMetaNavItem;
  }
}

export type BooleanString = 'true' | 'false';
export type BooleanNumber = 0 | 1;
export type BooleanStringNumber = '0' | '1';

export enum ResponseMessageLevel {
  OK = 'OK',
  WARNING = 'WARNING',
  ERROR = 'ERROR',
}

export const ResponseMessageLevelToType = {
  [ResponseMessageLevel.OK]: 'success',
  [ResponseMessageLevel.WARNING]: 'warning',
  [ResponseMessageLevel.ERROR]: 'error',
} as const;

export interface ResponseMessageDTO {
  level: ResponseMessageLevel;
  key: string | null;
  message: string;
}