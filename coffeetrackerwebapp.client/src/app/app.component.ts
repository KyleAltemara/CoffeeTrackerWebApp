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
  public date: Date | null = null;
  public description: string = defaultDescription;
  public ounces: number = 0;
  public notes: string = defaultNotes;
  public rating: number = 0;
  public showAddForm: boolean = true;
  public showEditForm: boolean = false;
  private editRecordId: number | null = null;

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
    if (this.date === null ||
      this.description === defaultDescription ||
      this.ounces === 0 ||
      this.rating === 0) {
      return;
    }

    if (this.notes === defaultNotes) {
      this.notes = '';
    }

    const newRecord: CoffeeRecord = {
      id: 0,
      date: this.date!,
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

    this.resetFormInputs();
  }

  deleteRecord(coffeeRecord: CoffeeRecord) {
    this.http.delete(`${environment.apiUrl}/${coffeeRecord.id}`).pipe(
      catchError((error) => {
        console.error(error);
        return of({});
      })
    ).subscribe(() => {
      this.getRecords();
    });
  }

  setupEditForm(coffeeRecord: CoffeeRecord) {
    this.date = coffeeRecord.date;
    this.description = coffeeRecord.description;
    this.ounces = coffeeRecord.ounces;
    this.notes = coffeeRecord.notes;
    this.rating = coffeeRecord.rating;
    this.editRecordId = coffeeRecord.id;
    this.showEditForm = true;
    this.showAddForm = false;
  }

  editRecord() {
    if (this.description === defaultDescription ||
      this.ounces === 0 ||
      this.rating === 0) {
      return;
    }

    const updatedRecord: CoffeeRecord = {
      id: this.editRecordId!,
      date: this.date!,
      description: this.description,
      ounces: this.ounces,
      notes: this.notes,
      rating: this.rating
    };

    this.http.put(`${environment.apiUrl}/${updatedRecord.id}`, updatedRecord).pipe(
      catchError((error) => {
        console.error(error);
        return of({});
      })
    ).subscribe(() => {
      this.getRecords();
    });

    this.resetFormInputs();
    this.showEditForm = false;
    this.showAddForm = true;
    this.editRecordId = null;
  }

  cancelEdit() {
    this.resetFormInputs();
    this.showEditForm = false;
    this.showAddForm = true;
    this.editRecordId = null;
  }

  resetFormInputs() {
    this.date = null;
    this.description = defaultDescription;
    this.ounces = 0;
    this.notes = defaultNotes;
    this.rating = 0;
  }
}
