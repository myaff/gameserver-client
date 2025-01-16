import { ServerProviders, OperationSystems } from "./server.model"

export const providersLogos = {
  [ServerProviders.KAMATERA]: '/providers/kamatera.svg',
  [ServerProviders.YANDEX_CLOUD]: '/providers/yandex-cloud.svg',
  [ServerProviders.FIRST_BYTE]: '/providers/firstbyte.png',
  [ServerProviders.LOCALHOST]: '/providers/localhost.svg',
}

export const osLogos = {
  [OperationSystems.DEBIAN]: '/os/debian-symbol.svg',
  [OperationSystems.UBUNTU]: '/os/ubuntu-symbol.svg',
  [OperationSystems.CENTOS]: '/os/centos-symbol.svg',
  [OperationSystems.WIN10]: '/os/win10-symbol.svg',
}