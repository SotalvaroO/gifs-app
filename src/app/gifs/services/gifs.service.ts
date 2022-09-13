import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class GifsService {
  private _history: string[] = [];

  public get history() {
    return [...this._history];
  }

  public saveInHistory(query: string) {
    query = query.trim().toLowerCase();
    if (query.trim().length === 0) return;
    if (this._history.includes(query)) {
      this.removeFromArrayByValue(query, this._history);
    }
    this._history.unshift(query);

    this._history = this._history.splice(0, 10);

    console.log(this._history);
  }

  private removeFromArrayByValue(value: string, arr: string[]) {
    for (var i = 0; i < arr.length; i++) {
      if (arr[i] === value) {
        arr.splice(i, 1);
      }
    }
  }
}
