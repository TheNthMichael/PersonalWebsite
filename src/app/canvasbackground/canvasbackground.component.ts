import { Component, ViewChild, ElementRef, AfterViewInit  } from '@angular/core';
import {PATHS } from './mypaths';

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
  canvas;
  public ctx: CanvasRenderingContext2D;
  

  // Fourier Drawing Stuff
  prevX;
  prevY;
  dt;
  time;
  path;

  fPath = [];

  complexFourier;

  // Painter
  mouseDownId;

  ngAfterViewInit(): void {
    this.ctx = this.myCanvas.nativeElement.getContext('2d');
    this.canvas = this.myCanvas.nativeElement;
    

    // Fourier

    /*for(let i = 0; i < 1920; i++) {
      this.path.push(new Vector2d(i, 2 * i/6 * Math.cos(i * 0.05) + i/15 * Math.cos(i * 0.02) + 300));
    }*/
    this.path = PATHS;
    
    // data used was in reverse :/
    this.path.reverse();

    // Find minimum/maximum x/y values and if the points are ever larger/smaller than these values, I think something went wrong with generating the path...
    let xmax = -99999999999;
    let xmin = 99999999999;
    let ymax = -99999999999;
    let ymin = 99999999999;
    for(let i = 0; i < this.path.length; i++) {
      if(this.path[i].Re < xmin) {
        xmin = this.path[i].Re;
      }
      if(this.path[i].Re > xmax) {
        xmax = this.path[i].Re;
      }
      if(this.path[i].Im < ymin) {
        ymin = this.path[i].Im;
      }
      if(this.path[i].Im > ymax) {
        ymax = this.path[i].Im;
      }
    }

    // if there is extra space, map the x-coordinates xmargin equal to space/2
    let newMinX = (window.innerWidth - (xmax - xmin)) / 2;
    let newMaxX = window.innerWidth - newMinX;
    if(newMinX < 0) {
      newMinX = 0;
      newMaxX = window.innerWidth;
    }

    // linear map the coordinates from the paths original range(min, max) => range(newMin, newMax)
    for(let i = 0; i < this.path.length; i++) {
      this.path[i].Re = this.map(this.path[i].Re, xmin, xmax, newMinX, newMaxX);
      this.path[i].Im = this.map(this.path[i].Im, ymin, ymax, 0, window.innerHeight - (window.innerHeight / 2));
    }

    // Calculate the paths in the frequency domain
    this.complexFourier = this.dft(this.path);

    // sort by decreasing amplitude
    this.complexFourier.sort((a,b) => b.Amp - a.Amp);

    // dt can be 2^n * PI / num_freq_bins
    this.dt = 4 * Math.PI / this.complexFourier.length;
    this.time = 0;

    //console.log(this.complexFourier);

    // How often we draw the next point on the path
    setInterval( ()=> {this.draw();}, 1000/144);




  }

  draw() {
    // resize to window
    this.ctx.canvas.width  = window.innerWidth;
    this.ctx.canvas.height = window.innerHeight;
    

    let point = this.epicycles(0,200, 0, this.complexFourier);

    this.fPath.push(point);

 
    this.ctx.strokeStyle = '#000000';
    this.ctx.lineWidth = 1;
    this.ctx.lineCap = "round";
    
    this.ctx.beginPath();
    this.ctx.moveTo(this.fPath[0].Re, this.fPath[0].Im);
    for(let i = 0; i < this.fPath.length; i++) {
      this.ctx.lineTo(this.fPath[i].Re, this.fPath[i].Im);
    }
    this.ctx.fillStyle = '#243b35';
    this.ctx.fill();
    this.ctx.stroke();
    this.time += this.dt;
    
    if(this.time > 2 * Math.PI) {
      this.time = 2 * this.dt;
      this.fPath = [];
    }

  }

  
  map(x, in_min, in_max, out_min, out_max)
  {
    return (x - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
  }

  // Made by random person on stack overflow
  rgbToHex(r, g, b) {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
  }

// General clamp function
  clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
  }

  /*  dft(complexArray)
    complexArray = [{Re: x, Im: y}]
    complex multiplication: 
    (x + yi)(u + vi) = (xu - yv) + (xv + yu)i

    Return type:
    {Re: vevtor.Re, Im: vevtor.Im, Freq: k, Amp: Math.sqrt(vevtor.Re * vevtor.Re + vevtor.Im * vevtor.Im), Phase: Math.atan2(vevtor.Im, vevtor.Re)}

  */
  dft(complexArray) {
    let complexFourier = [];
    const N = complexArray.length;
    let vevtor = new Vector2d(0,0);
    let euler = new Vector2d(0,0);
    let omega = 0;
    for(let k = 0; k < N; k++) {
      vevtor.Re = 0;
      vevtor.Im = 0;
      for(let n = 0; n < N; n++) {
        omega = (-2.0 * Math.PI * k * n) / N;
        euler.Re = Math.cos(omega);
        euler.Im = -1 * Math.sin(omega);
        vevtor.Re += complexArray[n].Re  * euler.Re - complexArray[n].Im * euler.Im;
        vevtor.Im += complexArray[n].Re  * euler.Im + complexArray[n].Im * euler.Re;
      }
      // Normalize veVtor
      vevtor.Re /= N;
      vevtor.Im /= N;
      complexFourier.push(new FourierInfo(vevtor.Re, vevtor.Im, k, Math.sqrt(vevtor.Re * vevtor.Re + vevtor.Im * vevtor.Im), Math.atan2(vevtor.Im, vevtor.Re)));
    }
    return complexFourier;
  }


  /*  epicycles(x,y,angle, complexFourier)
    Input type:
    complexFourier: {Re: vevtor.Re, Im: vevtor.Im, Freq: k, Amp: Math.sqrt(vevtor.Re * vevtor.Re + vevtor.Im * vevtor.Im), Phase: Math.atan2(vevtor.Im, vevtor.Re)}
    Return type:
    {X, Y}
  */
  epicycles(x: number,y: number,angle, complexFourier) {
    // Setup
    let theta = 0;
    let headlen = 10;

    this.ctx.strokeStyle = 'whitesmoke';
    // avoid conditional every iteration
    if(complexFourier.length > 1) {
      theta = complexFourier[0].Freq * this.time + complexFourier[0].Phase + angle
      let prevX = x;
      let prevY = y;
      x += complexFourier[0].Amp * Math.cos(theta);
      y += complexFourier[0].Amp * Math.sin(theta);
    }
    for(let i = 1; i < complexFourier.length; i++) {
      // store previous coordinates
      let prevX = x;
      let prevY = y;
      
      // Sum up x and y components of epicycle
      this.ctx.beginPath();
      this.ctx.moveTo(x,y);
      theta = complexFourier[i].Freq * this.time + complexFourier[i].Phase + angle
      x += complexFourier[i].Amp * Math.cos(theta);
      y += complexFourier[i].Amp * Math.sin(theta);

      // Draw Epicycle Arrows
      this.ctx.lineTo(x,y);
      this.ctx.stroke();
      headlen = complexFourier[i].Amp / 20;
      this.canvas_arrow(this.ctx, prevX, prevY, x, y, headlen);
    }
    this.ctx.stroke();
    return new Vector2d(x,y);
  }



  canvas_arrow(context, fromx, fromy, tox, toy, r){
    var x_center = tox;
    var y_center = toy;

    var angle;
    var x;
    var y;
    this.ctx.strokeStyle = 'whitesmoke';
    this.ctx.fillStyle = 'whitesmoke';
    context.beginPath();

    angle = Math.atan2(toy-fromy,tox-fromx)
    x = r*Math.cos(angle) + x_center;
    y = r*Math.sin(angle) + y_center;

    context.moveTo(x, y);

    angle += (1/3)*(2*Math.PI)
    x = r*Math.cos(angle) + x_center;
    y = r*Math.sin(angle) + y_center;

    context.lineTo(x, y);

    angle += (1/3)*(2*Math.PI)
    x = r*Math.cos(angle) + x_center;
    y = r*Math.sin(angle) + y_center;

    context.lineTo(x, y);

    context.closePath();

    context.fill();
}

}

// data structure used for points
class Vector2d {
  Re;
  Im;
  constructor(x,y) {
    this.Re = x;
    this.Im = y;
  }
}

// data structure used to store the results of the discrete fourier transform
class FourierInfo {
  Re;
  Im;
  Amp;
  Freq;
  Phase;
  constructor(Re, Im, Freq, Amp, Phase) {
    this.Amp = Amp;
    this.Freq = Freq;
    this.Phase = Phase;
    this.Re = Re;
    this.Im = Im;
  }
}