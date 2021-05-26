import { Component, OnInit } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { IHero } from 'src/app/interfaces/hero';
import { HeroService } from 'src/app/services/hero-service/hero.service';

@Component({
  selector: 'app-hero-search',
  templateUrl: './hero-search.component.html',
  styleUrls: ['./hero-search.component.scss']
})
export class HeroSearchComponent implements OnInit {

  heroes$!: Observable<IHero[]>;
  private searchTerms = new Subject<string>();
  
  constructor(private heroService: HeroService) { }

  ngOnInit(): void {
    this.heroes$ = this.searchTerms.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((term: string) =>
        this.heroService.searchHeroes(term))
    );
  }

  searchHeroes(term: string): void {
    this.searchTerms.next(term);
  }

}
