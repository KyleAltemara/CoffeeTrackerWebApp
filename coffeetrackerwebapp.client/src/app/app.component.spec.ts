import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppComponent } from './app.component';
import { CoffeeRecord } from './CoffeeRecord';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AppComponent],
      imports: [HttpClientTestingModule]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it('should retrieve weather forecasts from the server', () => {
    const mockRecords = [
      { id: 1, description: 'test1', date: '2024-01-01', ounces: 8, notes: 'test1', rating: 5 },
      { id: 2, description: 'test2', date: '2024-01-02', ounces: 16, notes: 'test2', rating: 5 },
      { id: 3, description: 'test3', date: '2024-01-03', ounces: 8, notes: 'test3', rating: 5 }
    ];

    component.ngOnInit();

    const req = httpMock.expectOne('/api/Records');
    expect(req.request.method).toEqual('GET');
    req.flush(mockRecords);

    expect(component.coffeeRecords).toEqual(mockRecords);
  });
});
