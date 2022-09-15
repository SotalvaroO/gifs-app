import { Component, OnInit } from '@angular/core';
import { Result } from '../interfaces/gifs.interface';
import { GifsService } from '../services/gifs.service';

@Component({
  selector: 'app-gifs-list',
  templateUrl: './gifs-list.component.html',
  styles: [],
})
export class GifsListComponent implements OnInit {
  get results(): Result[] {
    return this.gifsService.response;
  }
  constructor(private gifsService: GifsService) {}

  ngOnInit(): void {}
}
