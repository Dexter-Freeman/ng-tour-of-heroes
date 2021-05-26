import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { HEROES } from 'src/app/data-api/mock-heroes';
import { IHero } from 'src/app/interfaces/hero';
import { MessageService } from '../message/message.service';

@Injectable({
  providedIn: 'root'
})
export class HeroService {

  private heroesUrl = 'api/heroes';
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(
    private messageService: MessageService,
    private http: HttpClient) { }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      this.log(`${operation} failed: ${error.message}`);
      return of(result as T);
    }
  }

  private log(message: string) {
    this.messageService.add(`HeroService: ${message}`);
  }

  getHeroes(): Observable<IHero[]> {
    return this.http.get<IHero[]>(this.heroesUrl)
      .pipe(
        tap(_ => this.log('fetched heroes')),
        catchError(this.handleError<IHero[]>('getHeroes', []))
      );
  }

  getHero(id: number): Observable<IHero> {
    const url = `${this.heroesUrl}/${id}`;

    return this.http.get<IHero>(url).pipe(
      tap(_ => this.log(`fetched hero id=${id}`)),
      catchError(this.handleError<IHero>(`getHero id=${id}`))
    );
  }

  updateHero(hero: IHero): Observable<any> {
    return this.http.put(this.heroesUrl, hero, this.httpOptions).pipe(
      tap(_ => this.log(`update hero id=${hero.id}`)),
      catchError(this.handleError<any>('updateHero'))
    );
  }

  addNewHero(newHero: IHero): Observable<IHero> {
    return this.http.post<IHero>(this.heroesUrl, newHero, this.httpOptions).pipe(
      tap((newHero: IHero) => this.log(`added hero w/id=${newHero.id}`)),
      catchError(this.handleError<IHero>('addNewHero'))
    )
  }

  deleteHero(id: number): Observable<IHero> {
    const url = `${this.heroesUrl}/${id}`;

    return this.http.delete<IHero>(url, this.httpOptions)
      .pipe(
        tap(_ => this.log(`deleted hero id=${id}`)),
        catchError(this.handleError<IHero>('deleteHero'))
      );
  }

  searchHeroes(term: string): Observable<IHero[]> {
    if (!term.trim()) {
      return of([]);
    }
    return this.http.get<IHero[]>(`${this.heroesUrl}/?name=${term}`)
      .pipe(
        tap(x => { x.length ? this.log(`found heroes matching "${term}"`) : this.log(`no heroes matching "${term}"`) }),
        catchError(this.handleError<IHero[]>('searchHeroes', []))
      );
  }

}