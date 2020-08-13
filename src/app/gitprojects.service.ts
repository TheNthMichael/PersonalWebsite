import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class GitprojectsService {

  constructor(private http: HttpClient) { }



  /*  async requestProjectInformation()
      - Requests the list of my repos,
          for each repo, request a list of all files
            filter for images
              select a random image to use
        return an array containing each project's information bundled by
        the class {{ ProjectData }}
  
  */
  async requestProjectInformation() {
    let projects = await (await this.requestProjectListAsync()).json();
    let names = []
    let listOfProjects = [];
    let name = "";
    let description = "";
    let url = "";
    let git = "";
    for(let proj of projects) {
      name = proj.name;
      description = proj.description;
      git = proj.html_url;
      let response = await this.getImageList(`https://api.github.com/repos/TheNthMichaelNickerson/${name}/contents/`);
      if(response.length == 0) {
        url = `../../assets/test.png`;
      }
      else {
        url = response[Math.floor(Math.random() * response.length)];  // pick a random image from repo
      }
      console.log(url);
      listOfProjects.push(new ProjectData(name, description, url, git));
    }
    return listOfProjects;
  }

  /*  requestProjectList()
      - non async version using http.get(url) -> this was what I was originally using
   */
  requestProjectList() {
    return this.http.get('https://api.github.com/users/thenthmichaelnickerson/starred?perpage=100|egrep');
  }

  /*  async requestProjectListAsync()
      - async version using await fetch(url) -> currently using
   */
  async requestProjectListAsync() {
    return await fetch('https://api.github.com/users/thenthmichaelnickerson/starred?perpage=100|egrep');
  }

  
  /*  async getImageList(url) 
      - requests files for a given repo, filter for images
  */
  async getImageList(url) {
    let images = await this.getRepoFiles(url);
    let subset;
    let names = [];
    for(let im of images) {
      if(im.name.length > 4) {
        subset = im.name.substr(im.name.length-4, im.name.length);
        if(subset.includes('.jpg') || subset.includes('.png')) {
          names.push(im.download_url);
        }
      }
    }
    return names;
  }


  /*  async getRepoFiles(url) 
      - requests files for a given repo
  */
  async getRepoFiles(url) {
    const response = await fetch(url);
    return response.json();
  }
}


/*  export class ProjectData
    - used to bundle repo information
*/
export class ProjectData {
  name: string;
  description: string;
  imageUrl: string;
  gitUrl: string;
  constructor(name: string, description: string, imageUrl: string, gitUrl: string) {
    this.name = name;
    this.description = description;
    this.imageUrl = imageUrl;
    this.gitUrl = gitUrl;
  }
}
