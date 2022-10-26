import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HomeComponent } from '../home/home.component';
@Injectable({
  providedIn: 'root'
})
export class ResultsService {
  url='https://demo.credy.in/api/v1/maya/movies/'
  constructor(private http: HttpClient) { }
  
  // getdataFromAPI():Observable<any>{
  //   return this.http.get(this.url +'?q=satana')
  // }
  
}
