import { Component, OnInit } from '@angular/core';
import {http} from './fetch'

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.css']
})
export class ProjectsComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    //curl https://api.github.com/users/mirynw/repos returns an array of objects with attributes that we will want to display
      // example consuming code
    const data =  http("https://api.github.com/users/mirynw/repos");
  }


}
