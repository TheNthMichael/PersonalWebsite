import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class GitprojectsService {

  constructor(private http: HttpClient) { }
  requestProjectList() {
    return this.http.get('https://api.github.com/users/thenthmichaelnickerson/starred?perpage=100|egrep');
  }
}


class ProjectData {
  name: string;
  description: string;
  imageUrl: string;
  constructor(name: string, description: string, imageUrl: string) {
    this.name = name;
    this.description = description;
    this.imageUrl = imageUrl;
  }
}
