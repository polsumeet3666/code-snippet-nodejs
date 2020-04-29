import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class ConfigService {
  constructor(private http: HttpClient) {}

  configUrl = 'assets/config.json';

  getConfig() {
    return this.http.get(this.configUrl);
  }

  showConfig() {
    this.configService.getConfig().subscribe(
      (data: Config) =>
        (this.config = {
          heroesUrl: data['heroesUrl'],
          textfile: data['textfile'],
        })
    );
  }
}
