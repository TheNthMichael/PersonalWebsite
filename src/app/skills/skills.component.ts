import { Component, OnInit } from '@angular/core';
import {Test, TESTS, TESTS2 } from './Tests'

@Component({
  selector: 'app-skills',
  templateUrl: './skills.component.html',
  styleUrls: ['./skills.component.css']
})



export class SkillsComponent implements OnInit {

  TESTSC1 = TESTS;
  TESTSC2 = TESTS2;

  Arr = Array;

  constructor() { }

  ngOnInit(): void {
    
  }

}
