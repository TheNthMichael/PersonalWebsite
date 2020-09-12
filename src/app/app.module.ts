import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NavbarComponent } from './navbar/navbar.component';
import { CanvasbackgroundComponent } from './canvasbackground/canvasbackground.component';
import { ProfileComponent } from './profile/profile.component';
import { ProfileEducationComponent } from './profile-education/profile-education.component';
import { SkillsComponent } from './skills/skills.component';
import { ProjectsComponent } from './projects/projects.component';
import { WhiteSmokeSpacerComponent } from './white-smoke-spacer/white-smoke-spacer.component';
import { HttpClientModule } from '@angular/common/http';
import { FooterComponent } from './footer/footer.component';


@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    CanvasbackgroundComponent,
    ProfileComponent,
    ProfileEducationComponent,
    SkillsComponent,
    ProjectsComponent,
    WhiteSmokeSpacerComponent,
    FooterComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
