import { Component, ViewChild, ElementRef, AfterViewInit  } from '@angular/core';
import {Test, TESTS, TESTS2 } from './Tests'

@Component({
  selector: 'app-skills',
  templateUrl: './skills.component.html',
  styleUrls: ['./skills.component.css']
})



export class SkillsComponent implements AfterViewInit {

  /* Skills Data */
  TESTSC1 = TESTS;
  TESTSC2 = TESTS2;
  Arr = Array;

  /* Canvas Animation Data */
  @ViewChild('myCanvas2')
  myCanvas: ElementRef<HTMLCanvasElement>;
  canvas;
  public ctx: CanvasRenderingContext2D;
  speed: number;
  dt: number;

  //constructor() { }

  ngAfterViewInit(): void {
    this.ctx = this.myCanvas.nativeElement.getContext('2d');
    this.canvas = this.myCanvas.nativeElement;
    this.dt = 0;
    this.speed = 100;
    setInterval( ()=> {this.draw();}, 1000/30);
  }

  draw() {
    this.ctx.canvas.width  = window.innerWidth;
    this.ctx.canvas.height = window.innerHeight;
    this.ctx.fillStyle = 'darkslategray';
    this.ctx.beginPath();
    this.ctx.moveTo(0, this.canvas.height / 2);

    for(let i = 0; i < this.canvas.width; i+= 25) {
      let sum = this.sinSum(i / this.canvas.width);
      this.ctx.lineTo(i, this.canvas.height / 2 + 20 * sum);
    }
    this.ctx.lineTo(this.canvas.width + 10, this.canvas.height/2);
    this.ctx.lineTo(this.canvas.width, this.canvas.height);
    this.ctx.lineTo(0, this.canvas.height);
    this.ctx.lineTo(0,this.canvas.height / 2);
    this.ctx.fill();
    this.ctx.stroke();

    this.dt += this.speed / this.canvas.width;
    if(this.dt > 2 * Math.PI)
      this.dt = 0;
    
  }

  sinSum(x) {
    return 2*Math.sin(x * 0.1 + this.dt) + 2.5 * Math.sin(x * 10 + this.dt);
  }

}
