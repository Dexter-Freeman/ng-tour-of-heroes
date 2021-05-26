import { Component, OnInit } from '@angular/core';
import { IHero } from '../interfaces/hero';
import { MessageService } from '../services/message/message.service';
import { HeroService } from './../services/hero-service/hero.service';

@Component({
  selector: 'app-heroes',
  templateUrl: './heroes.component.html',
  styleUrls: ['./heroes.component.scss']
})
export class HeroesComponent implements OnInit {

  heroes: IHero[] = [];

  constructor(private heroService: HeroService, private messageService: MessageService) { }

  getHeroes(): void {
    this.heroService.getHeroes().subscribe(heroes => this.heroes = heroes);
  }

  ngOnInit(): void {
    this.getHeroes();
  }

  addNewHero(newHeroName: string): void {
    newHeroName = newHeroName.trim();
    if (!newHeroName) { 
      return; 
    }
    this.heroService.addNewHero({ name: newHeroName } as IHero)
    .subscribe(newHero => this.heroes.push(newHero));
  }

  deleteHero(heroForDelete: IHero):void {
    this.heroes = this.heroes.filter(hero => hero !== heroForDelete);
    this.heroService.deleteHero(heroForDelete.id).subscribe();
  }

}
