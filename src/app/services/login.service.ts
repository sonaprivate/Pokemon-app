import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, of, switchMap, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { StorageKeys } from '../enums/storage-keys.enum';
import { Trainer } from '../models/trainer.model';
import { StorageUtil } from '../utils/storage.util';

const { apiTrainers } = environment;

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private readonly http: HttpClient) { }

  public login(username: string): Observable<Trainer> {
    return this.checkUsername(username)
      .pipe(
        switchMap((trainer: Trainer | undefined) => {
          if (trainer === undefined) {
            return this.createTrainer(username);
          }
          return of(trainer);
        }),
        tap((trainer: Trainer) => {
          StorageUtil.storageSave<Trainer>(StorageKeys.Trainer, trainer);
        })
      )
  }

// Check if user exits
  private checkUsername(username: string): Observable<Trainer | undefined> {
    return this.http.get<Trainer[]>(`${apiTrainers}?username=${username}`)
      .pipe(
        map((response: Trainer[]) => response.pop())
      )
  }

  // Create user/trainer
  private createTrainer(username: string): Observable<Trainer> {
    const trainer = {
      username,
      favourites: []
    };

    const headers = new HttpHeaders({
      "Content-Type": "application/json",
      "x-api-key": "NnVsdwJd7UieOVAU3dKPQA=="
    });

    return this.http.post<Trainer>(apiTrainers, trainer, {
      headers
    })
  }

  
}
