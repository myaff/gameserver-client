import type { GameDetailsDTO, GameDTO } from "@/model/game.model";
import { GamesService } from "@/services/games.service";
import { defineStore } from "pinia";
import { ref } from 'vue';

export const useGamesStore = defineStore('games', () => {
  const gameService = new GamesService();
  const list = ref<Map<string, GameDTO>>(new Map());
  const details = ref<Map<string, GameDetailsDTO>>(new Map());
  const isLoading = ref(false);

  function getList() {
    isLoading.value = true;
    return gameService
      .getList()
      .then(data => {
        if (data) list.value = new Map(data.map(item => [item.apiToken, item]));
        return data;
      })
      .finally(() => (isLoading.value = false));
  }

  function getDetails(ids: string[]) {
    return gameService
      .getDetails(ids)
      .then(data => {
        details.value = new Map(Object.entries(data));
        return data;
      });
  }

  return {
    list,
    isLoading,
    details,
    getList,
    getDetails,
  }
})