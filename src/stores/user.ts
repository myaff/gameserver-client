import type { AuthFormData } from "@/model/auth.model";
import AuthService from "@/services/auth.service";
import { useLocalStorage } from "@vueuse/core";
import { isBefore } from "date-fns";
import { defineStore } from "pinia";
import { computed } from 'vue';

interface Token {
  token: string;
  expiresAt: string;
}

const defaultTokenData = {
  token: '',
  expiresAt: '',
};

export const useUserStore = defineStore('user', () => {
  const accessToken = useLocalStorage('accessToken', {...defaultTokenData});
  const refreshToken = useLocalStorage('refreshToken', {...defaultTokenData});
  const isAuthorized = computed(() => !!accessToken.value);
  const authService = new AuthService();

  const login = (formData: AuthFormData) => {
    return authService.login(formData).then(data => {
      accessToken.value = data.accessToken;
      refreshToken.value = data.refreshToken;
      AuthService.setAuthToken(accessToken.value.token);
    })
  }

  const refresh = () => {
    AuthService.removeAuthToken();
    return authService.refresh(refreshToken.value.token).then(data => {
      accessToken.value = data.accessToken;
      refreshToken.value = data.refreshToken;
      AuthService.setAuthToken(data.accessToken.token);
      return Promise.resolve();
    });
  }

  const logout = () => {
    accessToken.value = defaultTokenData;
    refreshToken.value = defaultTokenData;
    AuthService.removeAuthToken();
  }

  const checkIfExpired = (tokenData: Token) => {
    const isExp = isBefore(new Date(tokenData.expiresAt), new Date());
    return isExp;
  }

  const actualizeToken = (token: Ref<Token>) => {
    if (token.value.token && checkIfExpired(token.value)) {
      token.value = defaultTokenData;
    }
  }

  const init = async () => {
    actualizeToken(accessToken);
    actualizeToken(refreshToken);
    if (!accessToken.value.token && refreshToken.value.token) await refresh();
    if (accessToken.value.token) {
      AuthService.setAuthToken(accessToken.value.token);
    }
    else logout();
  }

  return {
    accessToken,
    isAuthorized,
    login,
    logout,
    init,
  };
});