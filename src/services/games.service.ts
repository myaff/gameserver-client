import type { GameDetailsDTO, GameDTO } from "@/model/game.model";
import { ApiService } from "./api.service";

const GamesDetailsExtra: { [key: string]: Pick<GameDetailsDTO, 'logo' | 'keyart' | 'logoPosition'> } = {
  "346110": {
    logo: '/games/ark/logo-f.png',
    keyart: '/games/ark/keyart.jpg',
  },
  "892970": {
    logo: '/games/valheim/logo-f.svg',
    keyart: '/games/valheim/keyart.png',
  },
  "322330": {
    logo: '/games/dst/logo-f.png',
    keyart: '/games/dst/keyart.jpeg',
  },
  "1604030": {
    logo: '/games/vrising/logo-f.png',
    keyart: '/games/vrising/keyart.webp',
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