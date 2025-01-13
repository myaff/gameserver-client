import type {
  ServerDTO,
  AddServerData,
  ServerInfoDTO,
  ServerConfigDTO,
  ServerDetailDTO,
  ServerStatus,
  GameLastSession,
} from "@/model/server.model";
import { ApiService } from "./api.service";
import { ResponseMessageLevel, type ResponseMessageDTO } from "@/model/common.model";

export class ServerService extends ApiService {
  resource = 'server';

  getList(): Promise<ServerDTO[]> {
    return ServerService.api
      .get<ServerDTO[]>(`${this.apiVersion}/${this.resource}`)
      .then(res => res.data);
  }

  addServer(formData: AddServerData) {
    return ServerService.api
      .post<ServerDTO>(`${this.apiVersion}/${this.resource}`, formData)
      .then(res => res.data);
  }

  editServer(id: string, formData: Partial<AddServerData>) {
    return ServerService.api
      .put<ResponseMessageDTO>(`${this.apiVersion}/${this.resource}/${id}`, formData)
      .then(res => res.data);
  }

  deleteServer(id: string) {
    return ServerService.api
      .delete<ResponseMessageDTO>(`${this.apiVersion}/${this.resource}/${id}`)
      .then(res => res.data);
  }

  getDetail(id: string) {
    return ServerService.api
      .get<ServerDetailDTO>(`${this.apiVersion}/${this.resource}/${id}`)
      .then(res => res.data)
      .catch(err => {
        if (err?.response?.data?.errors?.length) {
          const message = err.response.data.errors.at(0)?.info;
          throw {
            key: message ? null : 'error.unknown.title',
            level: ResponseMessageLevel.ERROR,
            message: err.response.data.errors.at(0)?.info ?? '',
          }
        }
      });
  }

  getInfo() {
    return ServerService.api
      .get<ServerInfoDTO>(`${this.apiVersion}/${this.resource}/info`)
      .then(res => res.data);
  }

  getConfig() {
    return ServerService.api
      .get<ServerConfigDTO>(`${this.apiVersion}/${this.resource}/config`)
      .then(res => res.data);
  }

  install(serverId: string, gameId: string) {
    return ServerService.api
      .post<ResponseMessageDTO>(`${this.apiVersion}/${this.resource}/${serverId}/install/${gameId}`)
      .then(res => res.data);
  }

  setStatus(serverId: string, status: ServerStatus) {
    return ServerService.api
      .post<ResponseMessageDTO>(`${this.apiVersion}/${this.resource}/${serverId}`, { id: serverId, status })
      .then(res => res.data);
  }

  getState(serverId: string) {
    return ServerService.api
      .get<GameLastSession[]>(`${this.apiVersion}/${this.resource}/${serverId}/state`)
      .then(res => res.data);
  }
}