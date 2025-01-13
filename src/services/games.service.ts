import type { GameDetailsDTO, GameDTO } from "@/model/game.model";
import { ApiService } from "./api.service";

const GamesDetailsExtra: { [key: string]: Pick<GameDetailsDTO, 'logo' | 'keyart' | 'logoPosition'> } = {
  "346110": {
    logo: '/src/assets/games/ark/logo-f.png',
    keyart: '/src/assets/games/ark/keyart.jpg',
  },
  "892970": {
    logo: '/src/assets/games/valheim/logo-f.svg',
    keyart: '/src/assets/games/valheim/keyart.png',
  },
  "322330": {
    logo: '/src/assets/games/dst/logo-f.png',
    keyart: '/src/assets/games/dst/keyart.jpeg',
  },
  "1604030": {
    logo: '/src/assets/games/vrising/logo-f.png',
    keyart: '/src/assets/games/vrising/keyart.webp',
  },
};

export class GamesService extends ApiService {
  resource = 'game';

  getList() {
    return GamesService.api
      .get<GameDTO[]>(`${this.apiVersion}/game`)
      .then(res => {
        return res.data;
      });
  }

  getDetails(ids: string[]) {
    return import('@/data/games.data').then(res => {
      return ids.reduce((acc, id) => {
        if (id in res.default) acc[id] = res.default[id];
        if (id in GamesDetailsExtra) {
          acc[id] = { ...acc[id], ...GamesDetailsExtra[id] };
        }
        return acc;
      }, {} as { [key: string]: GameDetailsDTO });
    })
  }
}