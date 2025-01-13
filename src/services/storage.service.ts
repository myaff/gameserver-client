import type { AxiosProgressEvent } from "axios";
import { ApiService } from "./api.service";

export class StorageService extends ApiService {
  resource = 'storage';

  getList() {
    return StorageService.api
      .get<string[]>(`${this.apiVersion}/${this.resource}`)
      .then(res => res.data);
  }

  getFile(fileName: string, onProgress?: (event: AxiosProgressEvent) => void) {
    return StorageService.api
      .get<string>(`${this.apiVersion}/${this.resource}/${fileName}`, {
        responseType: 'blob',
        onDownloadProgress: onProgress,
      })
      .then(res => {
        const blob = new Blob([res.data]);
        const link = document.createElement('a')
        link.href = window.URL.createObjectURL(blob)
        link.download = fileName;
        link.click()
      });
  }
}