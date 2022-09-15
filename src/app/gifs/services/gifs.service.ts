import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GifsResponse, Result } from '../interfaces/gifs.interface';

@Injectable({
  providedIn: 'root',
})
export class GifsService {
  private _history: string[] = [];
  private API_KEY: string = 'LIVDSRZULELA';
  public response: Result[] = [];

  constructor(private http: HttpClient) {
    /* this._history = localStorage.getItem('history'); */ //Puede llegar a ser null
    this._history = JSON.parse(localStorage.getItem('history')!) || [];
    /* if (localStorage.getItem('history')) {
      this._history = JSON.parse(localStorage.getItem('history')!);
    } */
    this.response = JSON.parse(localStorage.getItem('last-result')!) || '';
  }

  public get history() {
    return [...this._history];
  }

  public searchGif(query: string) {
    const httpParams: HttpParams = new HttpParams()
      .set('q', query)
      .set('key', this.API_KEY)
      .set('limit', '10');

    this.http
      .get<GifsResponse>(`https://g.tenor.com/v1/search`, {
        params: httpParams,
      })
      .subscribe((resp) => {
        this.response = resp.results;
        localStorage.setItem('last-result', JSON.stringify(this.response));
      });
  }

  public saveInHistory(query: string) {
    query = query.trim().toLowerCase();
    if (query.trim().length === 0) return;
    if (this._history.includes(query)) {
      this.removeFromArrayByValue(query, this._history);
    }
    this._history.unshift(query);

    this._history = this._history.splice(0, 10);
    localStorage.setItem('history', JSON.stringify(this._history));

    this.searchGif(query);
  }

  private removeFromArrayByValue(value: string, arr: string[]) {
    for (var i = 0; i < arr.length; i++) {
      if (arr[i] === value) {
        arr.splice(i, 1);
      }
    }
  }
}
