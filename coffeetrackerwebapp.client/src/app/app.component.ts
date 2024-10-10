import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';

import { environment } from '../../environment.js';
import { CoffeeRecord } from './CoffeeRecord.js';

const defaultDescription = 'What coffee did you have?';
const defaultNotes = 'Any notes?';

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
  description: string = defaultDescription
  ounces: number = 0;
  notes: string = 'Any notes?';
  rating: number = 0;

  constructor(private http: HttpClient) {
    // Ensure HttpClient is injected correctly
    if (!http) {
      throw new Error('HttpClient not provided');
    }
  }

  ngOnInit() {
    this.getRecords();
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
    if (this.description === defaultDescription ||
      this.ounces === 0 ||
      this.rating === 0) {
      return;
    }

    if (this.notes === defaultNotes) {
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
    this.description = defaultDescription;
    this.ounces = 0;
    this.notes = defaultNotes;
    this.rating = 0;
  }
}
