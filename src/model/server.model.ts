import type { ServerGameDTO } from "./game.model";

export interface ServerDTO {
  id: string;
  name: string;
  host: string;
  providerName: ServerProviders;
  operationSystem: OperationSystems;
}

export interface ServerInfoDTO {
  supportedProvider: ServerProviders[];
  supportedOs: OperationSystems[];
}

export enum ServerProviders {
  KAMATERA = 'KAMATERA',
  YANDEX_CLOUD = 'YANDEX_CLOUD',
  FIRST_BYTE = 'FIRST_BYTE',
  LOCALHOST = 'LOCALHOST',
}

export enum OperationSystems {
  DEBIAN = 'Linux/Debian',
  UBUNTU = 'Linux/Ubuntu',
  CENTOS = 'Linux/CentOS',
  WIN10 = 'Windows/10',
}

export interface ServerConfigFieldDTO {
  type: 'text' | 'password',
  name: string;
  required: boolean;
}

export type ServerConfigDTO = {
  [key in ServerProviders]: ServerConfigFieldDTO[];
}

export interface AddServerData {
  [key: string]: string;
  name: string;
  ipAddress: string;
  port: string;
  providerName: string;
  operationSystem: string;
}

export enum ServerStatus {
  ON = 'on',
  OFF = 'off',
}

export interface ServerDetailDTO extends ServerDTO {
  datacenter: string;
  cpu: string;
  ram: string;
  discSizes: number[];
  networks: NetworkDTO[];
  billing: string;
  status: ServerStatus;
  games: ServerGameDTO[];
}

export interface NetworkDTO {
  network: string;
  ips: string[];
}

export interface ProviderErrorItem {
  category: string;
  code: number;
  info: string;
}

export interface ProviderError {
  errors: ProviderErrorItem[];
}

export interface GameLastSession {
  serverId: string;
  apiToken: string;
  worldName: string;
  date: string;
}