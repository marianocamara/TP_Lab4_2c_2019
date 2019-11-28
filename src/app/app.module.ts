import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';

import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireModule } from '@angular/fire';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { AngularFirestoreModule } from '@angular/fire/firestore';

import { AppComponent } from './app.component';
import { PrincipalComponent } from './componentes/principal/principal.component';
import { CabeceraComponent } from './componentes/cabecera/cabecera.component';
import { PieComponent } from './componentes/pie/pie.component';
import { LoginComponent } from './componentes/login/login.component';
import { InicioComponent } from './componentes/inicio/inicio.component';
import { Error404Component } from './componentes/error404/error404.component';
import { RegistroComponent } from './componentes/registro/registro.component';
import { ChatComponent } from './componentes/chat/chat.component';
import { MaterialModule } from './material/material.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AuthGuardService } from './servicios/AuthGuard.service';
import { SimpleNotificationsModule } from 'angular2-notifications';
import { ListaUsuariosComponent } from './componentes/lista-usuarios/lista-usuarios.component';
import { TurnoCreacionComponent } from './componentes/turno-creacion/turno-creacion.component';
import { TurnoListaComponent } from './componentes/turno-lista/turno-lista.component';
import { TurnoComponent } from './componentes/turno/turno.component';
import { ModalEncuestaComponent } from './componentes/modal-encuesta/modal-encuesta.component';

import { RecaptchaModule } from 'ng-recaptcha';
import { ModalObservacionesComponent } from './componentes/modal-observaciones/modal-observaciones.component';
import { ListaSalasComponent } from './componentes/lista-salas/lista-salas.component';
import { EstadisticasComponent } from './componentes/estadisticas/estadisticas.component';
import { EmpleadosEstadisticaComponent } from './componentes/empleados-estadistica/empleados-estadistica.component';
import { TurnosEstadisticaComponent } from './componentes/turnos-estadistica/turnos-estadistica.component';
import { EspecialidadEstadisticaComponent } from './componentes/especialidad-estadistica/especialidad-estadistica.component';
import { HttpClientModule } from '@angular/common/http';
import { AgmCoreModule} from '@agm/core';
import { BotonSeleccionadoDirective } from './directivas/boton-seleccionado.directiva';
import { TituloComponent } from './componentes/titulo/titulo.component';




    const firebaseConfig = {
      apiKey: "AIzaSyD3_vgqIw9xLKpb2kDVZrclAaiMnRIk4ZU",
    authDomain: "bs-tp2.firebaseapp.com",
    databaseURL: "https://bs-tp2.firebaseio.com",
    projectId: "bs-tp2",
    storageBucket: "bs-tp2.appspot.com",
    messagingSenderId: "572693718201",
    appId: "1:572693718201:web:3f508ad14d731aba216768"
    };

@NgModule({
  declarations: [
    AppComponent,
    PrincipalComponent,
    CabeceraComponent,
    PieComponent,
    LoginComponent,
    InicioComponent,
    Error404Component,
    RegistroComponent,
    ChatComponent,
    ListaUsuariosComponent,
    TurnoCreacionComponent,
    TurnoListaComponent,
    TurnoComponent,
    ModalEncuestaComponent,
    ModalObservacionesComponent,
    ListaSalasComponent,
    EstadisticasComponent,
    EmpleadosEstadisticaComponent,
    TurnosEstadisticaComponent,
    BotonSeleccionadoDirective,
    EspecialidadEstadisticaComponent,
    TituloComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    AngularFireStorageModule,
    AngularFirestoreModule,
    MaterialModule,
    BrowserAnimationsModule,
    SimpleNotificationsModule.forRoot({
      position: ['top', 'right'],
      timeOut: 4000,
      showProgressBar: true,
      pauseOnHover: true,
      clickToClose: true
    }),
    RecaptchaModule,
    HttpClientModule,
  ],
  exports: [
    MaterialModule,
    SimpleNotificationsModule
  ],
  entryComponents: [
    ModalEncuestaComponent,
    ModalObservacionesComponent
  ],
  providers: [AuthGuardService],
  bootstrap: [AppComponent]
})
export class AppModule { }
