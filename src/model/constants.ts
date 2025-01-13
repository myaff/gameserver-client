import { ServerProviders, OperationSystems } from "./server.model"

export const providersLogos = {
  [ServerProviders.KAMATERA]: '/src/assets/providers/kamatera.svg',
  [ServerProviders.YANDEX_CLOUD]: '/src/assets/providers/yandex-cloud.svg',
  [ServerProviders.FIRST_BYTE]: '/src/assets/providers/firstbyte.png',
  [ServerProviders.LOCALHOST]: '/src/assets/providers/localhost.svg',
}

export const osLogos = {
  [OperationSystems.DEBIAN]: '/src/assets/os/debian-symbol.svg',
  [OperationSystems.UBUNTU]: '/src/assets/os/ubuntu-symbol.svg',
  [OperationSystems.CENTOS]: '/src/assets/os/centos-symbol.svg',
  [OperationSystems.WIN10]: '/src/assets/os/win10-symbol.svg',
}