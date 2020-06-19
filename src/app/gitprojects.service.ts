import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class GitprojectsService {

  constructor(private http: HttpClient) { }
  requestProjectList() {
    return this.http.get('https://api.github.com/users/thenthmichaelnickerson/repos');
  }
}
