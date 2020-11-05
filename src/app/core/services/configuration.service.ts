import { Injectable, isDevMode } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ConfigurationService {

  baseUrl: string;

  constructor(
    private httpClient: HttpClient
  ) { }

  load(): Promise<any> {
    let path = './appsettings.json'
    if (isDevMode()) {
      path = '/assets/appsettings.json';
    }

    const promise = this.httpClient.get(path)
      .toPromise()
      .then(data => {
        Object.assign(this, data);
        console.log(this.baseUrl)
        return data;
      });

    return promise;
  }
}
