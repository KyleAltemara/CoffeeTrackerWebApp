import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

export interface CoffeeRecord {
  id: number;
  description: string;
  date: string;
  ounces: number;
  notes: string;
  rating: number;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  public coffeeRecords: CoffeeRecord[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.getRecordss();
  }

  getRecordss() {
    this.http.get<CoffeeRecord[]>('https://localhost:7273/api/Record').subscribe(
      (result) => {
        this.coffeeRecords = result;
      },
      (error) => {
        console.error(error);
      }
    );
  }

  title = 'coffeetrackerwebapp.client';
}
