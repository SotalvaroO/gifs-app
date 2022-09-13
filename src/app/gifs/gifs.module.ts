import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GifsPageComponent } from './gifs-page/gifs-page.component';
import { GifsSearchComponent } from './gifs-search/gifs-search.component';
import { GifsListComponent } from './gifs-list/gifs-list.component';

@NgModule({
  declarations: [GifsPageComponent, GifsSearchComponent, GifsListComponent],
  imports: [CommonModule],
  exports: [GifsPageComponent],
})
export class GifsModule {}
