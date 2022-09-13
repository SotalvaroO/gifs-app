import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { GifsService } from '../services/gifs.service';

@Component({
  selector: 'app-gifs-search',
  templateUrl: './gifs-search.component.html',
  styles: [],
})
export class GifsSearchComponent implements OnInit {
  @ViewChild('txtSearch') //Busca la referencia que se creo
  public txtSearch!: ElementRef<HTMLInputElement>; //El ! se llama not null assertion operator sirve para decirle a typescript que confie en mi que eso no va a llegar null

  constructor(private gifService: GifsService) {}

  ngOnInit(): void {}

  public searchGif() {
    const value = this.txtSearch.nativeElement.value;
    
    this.gifService.saveInHistory(value);
    this.txtSearch.nativeElement.value = '';
  }
}
