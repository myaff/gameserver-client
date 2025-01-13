import type { AuthFormData, AuthResponseData } from "@/model/auth.model";
import { ApiService } from "./api.service";

export default class AuthService extends ApiService {

  login(formData: AuthFormData) {
    return AuthService.api
      .post<AuthResponseData>(`${this.apiVersion}/login`, formData)
      .then(res => {
        return {
          accessToken: this.transformToken(res.data.access_token),
          refreshToken: this.transformToken(res.data.refresh_token),
        }
      })
  }

  refresh(token: string) {
    AuthService.setAuthToken(token);
    return AuthService.api
      .post<AuthResponseData>(`${this.apiVersion}/refresh-token`)
      .then(res => {
        return {
          accessToken: this.transformToken(res.data.access_token),
          refreshToken: this.transformToken(res.data.refresh_token),
        }
      })
  }

  transformToken(tokenData: { token: string; expiresIn: string }) {
    const min = 60 * 1000;
    const expiresAt = Date.now() + parseInt(tokenData.expiresIn) - (10 * min);
    return {
      token: tokenData.token,
      expiresAt: new Date(expiresAt).toISOString(),
    }
  }
}