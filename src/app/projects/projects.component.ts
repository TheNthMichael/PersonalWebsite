import { Component, OnInit } from '@angular/core';
import { GitprojectsService, ProjectData } from './../gitprojects.service';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.css']
})
export class ProjectsComponent implements OnInit {

  projects;
  tempProj;
  listOfImages;

  constructor(private projectservice: GitprojectsService) { }

  ngOnInit(): void {
    //curl https://api.github.com/users/mirynw/repos returns an array of objects with attributes that we will want to display
      // example consuming code
    //this.projects = this.projectservice.requestProjectList();
    this.projects = this.projectservice.requestProjectInformation();
    console.log(this.projects);
  }

}
