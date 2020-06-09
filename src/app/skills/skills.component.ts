import { Component, OnInit } from '@angular/core';
import {Test, TESTS } from './Tests'

@Component({
  selector: 'app-skills',
  templateUrl: './skills.component.html',
  styleUrls: ['./skills.component.css']
})



export class SkillsComponent implements OnInit {

  TESTS2 = TESTS;
  Arr = Array;

  constructor() { }

  ngOnInit(): void {
    
  }

}
