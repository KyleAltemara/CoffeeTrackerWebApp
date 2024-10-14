import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';

import { environment } from '../../environment.js';
import { CoffeeRecord } from './CoffeeRecord.js';

const defaultDescription = 'What coffee did you have?';
const defaultNotes = 'Any notes?';

interface Filters {
  dateFrom: string;
  dateTo: string;
  description: string;
  ouncesFrom: string;
  ouncesTo: string;
  notes: string;
  rating: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {
  public coffeeRecords: CoffeeRecord[] = [];
  public filteredRecords: CoffeeRecord[] = [];

  public date: Date | null = null;
  public description: string = defaultDescription;
  public ounces: number = 0;
  public notes: string = defaultNotes;
  public rating: number = 0;

  public showAddForm: boolean = true;
  public showEditForm: boolean = false;

  public currentSortProperty: string = 'date';
  public sortDescending: boolean = true;

  public showDateFilter = false;
  public showDescriptionFilter = false;
  public showOuncesFilter = false;
  public showNotesFilter = false;
  public showRatingFilter = false;

  public filters: Filters = {
    dateFrom: '',
    dateTo: '',
    description: '',
    ouncesFrom: '',
    ouncesTo: '',
    notes: '',
    rating: '',
  };

  public ratingOptions = [1, 2, 3, 4, 5];

  private editRecordId: number | null = null;

  constructor(private http: HttpClient) {
    if (!http) {
      throw new Error('HttpClient not provided');
    }
  }

  ngOnInit() {
    this.getRecords();
    this.applyFilters();
  }

  getRecords() {
    this.http.get<CoffeeRecord[]>(environment.apiUrl).pipe(
      catchError((error) => {
        console.error(error);
        return of([]);
      })
    ).subscribe((result) => {
      this.coffeeRecords = result;
      this.applyFilters();
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
    const confirmed = confirm(`Are you sure you want to delete the record for ${coffeeRecord.description}?`);
    if (!confirmed) {
      return;
    }

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

  sortRecords(property: string) {
    if (this.currentSortProperty === property) {
      this.sortDescending = !this.sortDescending;
    } else {
      this.currentSortProperty = property;
      this.sortDescending = true;
    }

    this.applySort();
  }

  applySort() {
    const direction = this.sortDescending ? 1 : -1;
    this.filteredRecords.sort((a, b) => {
      switch (this.currentSortProperty) {
        case 'date':
          return a.date === b.date ? 0 :
            (direction * (a.date < b.date ? 1 : -1));
        case 'description':
          return a.description === b.description ? 0 :
            (direction * (a.description < b.description ? 1 : -1));
        case 'ounces':
          return a.ounces === b.ounces ? 0 :
            (direction * (a.ounces < b.ounces ? 1 : -1));
        case 'notes':
          return a.notes === b.notes ? 0 :
            (direction * (a.notes < b.notes ? 1 : -1));
        case 'rating':
          return a.rating === b.rating ? 0 :
            (direction * (a.rating < b.rating ? 1 : -1));
        default:
          console.error(`Invalid sort parameter ${this.currentSortProperty}`);
          return 0;
      }
    });
  }

  applyFilters() {
    let dateFrom = this.filters.dateFrom ? new Date(this.filters.dateFrom + 'T00:00:00') : null;
    let dateTo = this.filters.dateTo ? new Date(this.filters.dateTo + 'T23:59:59') : null;
    let ouncesFrom = this.filters.ouncesFrom ? +this.filters.ouncesFrom : null;
    let ouncesTo = this.filters.ouncesTo ? +this.filters.ouncesTo : null;
    const rating = this.filters.rating ? +this.filters.rating : null;

    this.filteredRecords = this.coffeeRecords.filter(record => {
      const recordDate = new Date(record.date);
      const isDateFromValid = !dateFrom || recordDate >= dateFrom;
      const isDateToValid = !dateTo || recordDate <= dateTo;
      const isDescriptionValid = !this.filters.description ||
        record.description.toLowerCase().includes(this.filters.description.toLowerCase());
      const isOuncesFromValid = !ouncesFrom || record.ounces >= ouncesFrom;
      const isOuncesToValid = !ouncesTo || record.ounces <= ouncesTo;
      const isNotesValid = !this.filters.notes ||
        record.notes.toLowerCase().includes(this.filters.notes.toLowerCase());
      const isRatingValid = !rating || record.rating >= rating;

      return isDateFromValid &&
        isDateToValid &&
        isDescriptionValid &&
        isOuncesFromValid &&
        isOuncesToValid &&
        isNotesValid &&
        isRatingValid;

    });

    this.applySort();
  }

  clearFilter(filter: keyof Filters) {
    switch (filter) {
      case 'dateFrom':
      case 'dateTo':
        this.showDateFilter = false;
        this.filters.dateFrom = '';
        this.filters.dateTo = '';
        break;
      case 'description':
        this.showDescriptionFilter = false;
        this.filters.description = '';
        break;
      case 'ouncesFrom':
      case 'ouncesTo':
        this.showOuncesFilter = false;
        this.filters.ouncesFrom = '';
        this.filters.ouncesTo = '';
        break;
      case 'notes':
        this.showNotesFilter = false;
        this.filters.notes = '';
        break;
      case 'rating':
        this.showRatingFilter = false;
        this.filters.rating = '';
        break;
      default:
        console.error(`Invalid filter parameter ${filter}`);
    }

    this.applyFilters();
  }
}
