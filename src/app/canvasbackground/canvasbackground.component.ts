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
  offset: number;
  amplitude;
  frequency;
  waveLength;
  range;
  speed;

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
    
    this.offset = 0;
    this.speed = -150;
    this.frequency = [];
    this.amplitude = [];
    this.waveLength = [];
    for(let i = 0; i < 10; i++) {
        this.frequency.push(2*i);
        this.amplitude.push(i/10);
        this.waveLength.push(3*i);
    }

    this.range = this.amplitude.reduce( (a,b)=> { return a + b; });
    

    // Fourier

    /*for(let i = 0; i < 1920; i++) {
      this.path.push(new Vector2d(i, 2 * i/6 * Math.cos(i * 0.05) + i/15 * Math.cos(i * 0.02) + 300));
    }*/
    this.path = PATHS;
    
    this.path.reverse();

    // prep
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

    for(let i = 0; i < this.path.length; i++) {
      this.path[i].Re = this.map(this.path[i].Re, xmin, xmax, 0, window.innerWidth);
      this.path[i].Im = this.map(this.path[i].Im, ymin, ymax, 0, window.innerHeight - (window.innerHeight / 2));
    }

    this.complexFourier = this.dft(this.path);

    this.complexFourier.sort((a,b) => b.Amp - a.Amp);

    this.dt = 4 * Math.PI / this.complexFourier.length;
    this.time = 0;

    console.log(this.complexFourier);

    setInterval( ()=> {this.draw();}, 1000/144);

    // Painter
    this.mouseDownId = -1;


  }

  draw() {
    this.ctx.canvas.width  = window.innerWidth;
    this.ctx.canvas.height = window.innerHeight;
    

    let point = this.epicycles(0,200, 0, this.complexFourier);

    this.fPath.push(point);

 
    this.ctx.strokeStyle = 'rgba(50,200,200,1)';
    this.ctx.lineWidth = 1;
    this.ctx.lineCap = "round";
    
    this.ctx.beginPath();
    this.ctx.moveTo(this.fPath[0].Re, this.fPath[0].Im);
    for(let i = 0; i < this.fPath.length; i++) {
      this.ctx.lineTo(this.fPath[i].Re, this.fPath[i].Im);
    }
    this.ctx.fillStyle = 'rgba(50,50,100,1)';
    this.ctx.fill();
    this.ctx.stroke();
    this.time += this.dt;
    
    if(this.time > 2 * Math.PI) {
      this.time = 2 * this.dt;
      this.fPath = [];
    }

    
    /*this.ctx.beginPath();
    this.ctx.moveTo(0, this.canvas.height / 2);

    for(let i = 0; i <= this.canvas.width; i+=10) {
      let sum = this.sinSum(i / this.canvas.width);
      let r = this.map(sum, -1*this.range, 1*this.range, 0, 255);
      let g = 255-r;
      this.ctx.lineTo(i, this.canvas.height / 2 + sum * 500);
      this.ctx.strokeStyle = this.rgbToHex(r,g,160);
      this.ctx.lineTo(i, this.canvas.height);
      this.ctx.lineTo(i, this.canvas.height / 2 + sum * 500);
    }
    this.ctx.stroke();
    this.offset += (this.speed / this.canvas.width);
  */


  }

  sinSum(x: number) {
    let sum = 0;
    for(let i = 0; i < this.frequency.length; i++) {
      sum += this.amplitude[i] * Math.sin(2 * Math.PI * this.frequency[i] * x + this.offset + this.waveLength[i]);
    }
    return sum / (this.frequency.length-1);
    //return Math.sin(x + this.offset) / (x + this.offset);
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

    this.ctx.strokeStyle = 'rgba(50,168,125,1)';
    for(let i = 0; i < complexFourier.length; i++) {
      if(i != 0) {
        let prevX = x;
        let prevY = y;
        headlen = complexFourier[i].Amp / 20;
        this.ctx.beginPath();
        this.ctx.moveTo(x,y);
        x += complexFourier[i].Amp * Math.cos(complexFourier[i].Freq * this.time + complexFourier[i].Phase + angle);
        y += complexFourier[i].Amp * Math.sin(complexFourier[i].Freq * this.time + complexFourier[i].Phase + angle);
        theta = Math.atan2(y - prevY, x - prevX);
        // may want to draw epicycle vectors here
        this.ctx.lineTo(x,y);
        this.ctx.stroke();
        this.canvas_arrow(this.ctx, prevX, prevY, x, y, headlen);

      }
      else {
        let prevX = x;
        let prevY = y;
        x += complexFourier[i].Amp * Math.cos(complexFourier[i].Freq * this.time + complexFourier[i].Phase + angle);
        y += complexFourier[i].Amp * Math.sin(complexFourier[i].Freq * this.time + complexFourier[i].Phase + angle);

      }
      
    }
    this.ctx.stroke();
    return new Vector2d(x,y);
  }

  /*  epicycles(x,y,angle, complexFourier)
    Input type:
    complexFourier: {Re: vevtor.Re, Im: vevtor.Im, Freq: k, Amp: Math.sqrt(vevtor.Re * vevtor.Re + vevtor.Im * vevtor.Im), Phase: Math.atan2(vevtor.Im, vevtor.Re)}
    Return type:
    {X, Y}
  */
 epicycles_derivative(x: number,y: number,angle, complexFourier) {
  // Setup
  let theta = 0;

  let headlen = 10;

  this.ctx.strokeStyle = 'rgba(50,168,125,1)';
  for(let i = 0; i < complexFourier.length; i++) {
    if(i != 0) {
      let prevX = x;
      let prevY = y;
      headlen = complexFourier[i].Amp / 20;
      this.ctx.beginPath();
      this.ctx.moveTo(x,y);
      x += complexFourier[i].Freq * complexFourier[i].Amp * -1 * Math.sin(complexFourier[i].Freq * this.time + complexFourier[i].Phase + angle);
      y += complexFourier[i].Freq * complexFourier[i].Amp * Math.cos(complexFourier[i].Freq * this.time + complexFourier[i].Phase + angle);
      theta = Math.atan2(y - prevY, x - prevX);
      // may want to draw epicycle vectors here
      this.ctx.lineTo(x,y);
      this.ctx.stroke();
      this.canvas_arrow(this.ctx, prevX, prevY, x, y, headlen);

    }
    else {
      let prevX = x;
      let prevY = y;
      x += complexFourier[i].Amp * Math.cos(complexFourier[i].Freq * this.time + complexFourier[i].Phase + angle);
      y += complexFourier[i].Amp * Math.sin(complexFourier[i].Freq * this.time + complexFourier[i].Phase + angle);

    }
    
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


class Vector2d {
  Re;
  Im;
  constructor(x,y) {
    this.Re = x;
    this.Im = y;
  }
}

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