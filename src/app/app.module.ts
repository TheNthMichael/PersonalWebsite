import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NavbarComponent } from './navbar/navbar.component';
import { CanvasbackgroundComponent } from './canvasbackground/canvasbackground.component';
import { ProfileComponent } from './profile/profile.component';
import { ProfileEducationComponent } from './profile-education/profile-education.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    CanvasbackgroundComponent,
    ProfileComponent,
    ProfileEducationComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
