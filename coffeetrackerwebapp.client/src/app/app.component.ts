import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';

import { environment } from '../../environment.js';
import { CoffeeRecord } from './CoffeeRecord.js';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})

export class AppComponent implements OnInit {
  public coffeeRecords: CoffeeRecord[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.getRecords();
  }

  getRecords() {
    this.http.get<CoffeeRecord[]>(environment.apiUrl + environment.getRecords).pipe(
      catchError((error) => {
        console.error(error);
        return of([]);
      })
    ).subscribe((result) => {
      this.coffeeRecords = result;
    });
  }

  title = 'coffeetrackerwebapp.client';
}
