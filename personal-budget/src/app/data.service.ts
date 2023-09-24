import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class DataService {
  private data: any = null;
  private dataSubject = new BehaviorSubject<any>(null);

  constructor(private http: HttpClient) { }

  fetchDataIfNeeded(): void {
    if (!this.data) {
      this.http.get('http://localhost:3000/budget').subscribe((res: any) => {
        this.data = res.myBudget;
        this.dataSubject.next(this.data);
      });
    }
  }

  getData(): Observable<any> {
    return this.dataSubject.asObservable();
  }
}
