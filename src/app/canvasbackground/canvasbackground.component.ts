import { Component, ViewChild, ElementRef, AfterViewInit  } from '@angular/core';

@Component({
  selector: 'app-canvasbackground',
  templateUrl: './canvasbackground.component.html',
  styleUrls: ['./canvasbackground.component.css']
})
export class CanvasbackgroundComponent implements AfterViewInit {

  // its important myCanvas matches the variable name in the template
  //@ViewChild('myCanvas', {static: false}) myCanvas: ElementRef;
  @ViewChild('myCanvas')
  myCanvas: ElementRef<HTMLCanvasElement>;
  public context: CanvasRenderingContext2D;

  ngAfterViewInit(): void {
    this.context = this.myCanvas.nativeElement.getContext('2d');
  }
  
}
