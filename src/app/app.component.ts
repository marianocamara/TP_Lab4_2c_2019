import { Component } from '@angular/core';
import { UsuarioService } from './servicios/Usuario.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent {
  constructor(private us:UsuarioService){
    this.us.EstadoLogeo();
  }
}
