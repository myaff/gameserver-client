import type { LocationQueryValue } from 'vue-router';
import { isArray } from 'lodash-es';

export function getQueryParamValue(value: LocationQueryValue | LocationQueryValue[]) {
  return isArray(value) && value.length
    ? value.at(0) as string ?? ''
    : value as string ?? '';
}