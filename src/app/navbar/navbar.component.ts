import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  toHome() {
    window.scrollTo({top:0, behavior:"smooth"});
  }

  toProjects() {
    document.getElementById('projects').scrollIntoView({behavior:"smooth"});
  }

  toAbout() {
    document.getElementById('about').scrollIntoView({behavior:"smooth"});
  }

}
