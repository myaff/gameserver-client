import axios from "axios";

export class SteamAppsService {
  baseUrl = 'http://store.steampowered.com/api';
  static readonly api = axios.create({
    baseURL: 'http://store.steampowered.com/api',
    headers: {
      'Content-Type': 'application/json'
    },
  });

  getAppsDetails(ids: string[]) {
    return SteamAppsService.api
      .get(`appdetails`, {
        params: {
          // appids: ids.join(','),
          appids: ids.at(0),
          key: import.meta.env.VITE_STEAM_API_KEY,
        },
      })
      .then(data => {
        console.log(data);
      });
  }
}
// http://store.steampowered.com/api/appdetails?appids={APP_ID}