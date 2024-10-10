import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';

import { environment } from '../../environment.js';
import { CoffeeRecord } from './CoffeeRecord.js';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {

  title = 'coffeetrackerwebapp.client';
  public coffeeRecords: CoffeeRecord[] = [];

  // Define properties for form inputs
  date: string = new Date().toISOString().split('T')[0];
  description: string = 'What coffee did have?'
  ounces: number = 0;
  notes: string = 'Any notes?';
  rating: number = 0;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    //this.getRecords();
    this.coffeeRecords = []; // Simulate an empty response for testing
  }

  getRecords() {
    this.http.get<CoffeeRecord[]>(environment.apiUrl).pipe(
      catchError((error) => {
        console.error(error);
        return of([]);
      })
    ).subscribe((result) => {
      this.coffeeRecords = result;
    });
  }

  addRecord() {
    if (this.description === 'What coffee did you have?' ||
      this.ounces === 0 ||
      this.rating === 0) {
      return;
    }

    if (this.notes === 'Any notes?') {
      this.notes = '';
    }

    const newRecord: CoffeeRecord = {
      id: 0,
      date: this.date,
      description: this.description,
      ounces: this.ounces,
      notes: this.notes,
      rating: this.rating
    };

    this.http.post(environment.apiUrl, newRecord).pipe(
      catchError((error) => {
        console.error(error);
        return of({});
      })
    ).subscribe(() => {
      this.getRecords();
    });

    // Reset form inputs
    this.date = new Date().toISOString().split('T')[0];
    this.description = 'What coffee you did have?';
    this.ounces = 0;
    this.notes = 'Any notes?';
    this.rating = 0;
  }
}
