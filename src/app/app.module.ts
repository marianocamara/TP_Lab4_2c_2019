import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { AngularFontAwesomeModule } from 'angular-font-awesome';

import { AngularFireModule } from "@angular/fire";
import { AngularFireAuthModule } from "@angular/fire/auth";
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { environment } from '../environments/environment';
import { AuthService } from './services/auth.service';
import { DashboardComponent } from './components/dashboard/dashboard.component';


var firebase = {
  apiKey: "AIzaSyAC4t4yhrWOZUsaeKGLsksVbdM0CnTz6K8",
  authDomain: "tp-2-comanda.firebaseapp.com",
  databaseURL: "https://tp-2-comanda.firebaseio.com",
  projectId: "tp-2-comanda",
  storageBucket: "tp-2-comanda.appspot.com",
  messagingSenderId: "1042369693807",
  appId: "1:1042369693807:web:66ee92bd9520c686d0659a"
};

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    DashboardComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    AngularFontAwesomeModule,
    AngularFireModule.initializeApp(firebase),
    AngularFireAuthModule,
    AngularFirestoreModule,
  ],
  providers: [AuthService],
  bootstrap: [AppComponent]
})
export class AppModule { }
