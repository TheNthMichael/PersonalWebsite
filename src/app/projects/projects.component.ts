import { Component, OnInit } from '@angular/core';
import { GitprojectsService, ProjectData } from './../gitprojects.service';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.css']
})
export class ProjectsComponent implements OnInit {

  projects_storage;
  projects_load;
  tempProj;
  listOfImages;
  projectsPerLoad;
  projectIndex;
  temp;

  constructor(private projectservice: GitprojectsService) { }

  ngOnInit(): void {
    //curl https://api.github.com/users/mirynw/repos returns an array of objects with attributes that we will want to display
      // example consuming code
    //this.projects = this.projectservice.requestProjectList();
    this.projectsPerLoad = 3;
    this.projectIndex = 0;
    this.temp = [];
    this.projects_load = this.getProjectSubset();
    
    console.log(this.projects_storage);
  }

  async getProjectSubset() {
    this.projects_storage = await this.projectservice.requestProjectInformation();
    //let temp = [];
    let min_value = (this.projectsPerLoad < await this.projects_storage.length)? this.projectsPerLoad : await this.projects_storage.length;
    for(let i = 0; i < min_value; i++) {
      this.temp.push(this.projects_storage[i]);
    }
    this.projectIndex = await min_value;
    return this.temp;
  }

  loadMoreProjects() {
    this.projects_load = this.requestMoreProjects();
  }

  async requestMoreProjects() {
    let min_value = (this.projectsPerLoad + this.projectIndex < await this.projects_storage.length - this.projectIndex)? this.projectsPerLoad : await this.projects_storage.length-this.projectIndex;
    for(let i = this.projectIndex; i < this.projectIndex + min_value; i++) {
      this.temp.push(this.projects_storage[i]);
    }
    this.projectIndex += await min_value;
    return this.temp;
  }

}
