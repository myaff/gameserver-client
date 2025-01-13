import type { BackupDTO, BackupFileDTO, CommentDTO, GameServerStatus, WorldDTO } from "@/model/game.model";
import { ApiService } from "./api.service"
import type { ResponseMessageDTO } from "@/model/common.model";
import type { GameLastSession } from "@/model/server.model";

export class GameService extends ApiService {
  server: string;
  game: string;

  get resource() {
    return `server/${this.server}/${this.game}`;
  }

  constructor(config: { server: string; game: string }) {
    super();
    this.server = config.server;
    this.game = config.game;
  }

  getStatus() {
    return GameService.api
      .get<ResponseMessageDTO>(`${this.apiVersion}/${this.resource}`)
      .then(res => res.data);
  }

  getLastSession() {
    return GameService.api
      .get<GameLastSession>(`${this.apiVersion}/${this.resource}/state`)
      .then(res => res.data);
  }

  setStatus(value: GameServerStatus) {
    const body = {
      command: 'CHANGE_STATUS',
      message: value,
    };
    return this.sendCommand(body);
  }

  getWorlds() {
    return GameService.api
      .get<WorldDTO[]>(`${this.apiVersion}/${this.resource}/world`)
      .then(res => res.data);
  }

  deleteWorld(world: string) {
    return GameService.api
      .delete<ResponseMessageDTO>(`${this.apiVersion}/${this.resource}/world/${world}`)
      .then(res => res.data);
  }

  getBackups(world: string) {
    return GameService.api
      .get<BackupDTO[]>(`${this.apiVersion}/${this.resource}/world/${world}/saves`)
      .then(res => res.data);
  }

  deleteBackup(world: string, backup: string) {
    return GameService.api
      .delete<ResponseMessageDTO>(`${this.apiVersion}/${this.resource}/world/${world}/saves/${backup}`)
      .then(res => res.data);
  }

  getFiles(world: string, backup: string) {
    return GameService.api
      .get<BackupFileDTO[]>(`${this.apiVersion}/${this.resource}/world/${world}/saves/${backup}`)
      .then(res => res.data);
  }

  downloadBackup(world: string, backup: string) {
    return GameService.api
      .post<ResponseMessageDTO>(`${this.apiVersion}/${this.resource}/world/${world}/saves/${backup}/prepare`)
      .then(res => res.data);
  }

  uploadBackup(world: string, file: File) {
    const formData = new FormData();
    formData.append('file', file);
    return GameService.api
      .postForm<string>(`${this.apiVersion}/${this.resource}/world/${world}/upload`, formData)
      .then(res => res.data);
  }

  addComment(formData: CommentDTO) {
    return GameService.api
      .post<ResponseMessageDTO>(`${this.apiVersion}/${this.resource}/comment`, formData)
      .then(res => res.data);
  }

  addWorld(worldName: string) {
    const body = {
      command: 'CREATE_WORLD',
      message: worldName,
    };
    return this.sendCommand(body);
  }

  save(world: string) {
    const body = {
      command: 'SAVE',
      message: `${world}`,
    };
    return this.sendCommand(body);
  }

  restore(world: string, save: string) {
    const body = {
      command: 'RESTORE',
      message: `${world}/${save}`,
    };
    return this.sendCommand(body);
  }

  private sendCommand(body: { command: string; message: string; }) {
    return GameService.api
      .post<ResponseMessageDTO>(`${this.apiVersion}/${this.resource}`, body)
      .then(res => res.data);
  }
}