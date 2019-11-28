import { Component, OnInit } from '@angular/core';
import { UsuarioService } from 'src/app/servicios/Usuario.service';

@Component({
  selector: 'app-turno',
  templateUrl: './turno.component.html',
  styleUrls: ['./turno.component.scss']
})
export class TurnoComponent implements OnInit {

  private perfil;

  constructor(private usuarioService: UsuarioService) {
    this.perfil = this.usuarioService.usuario.Perfil;
  }

  ngOnInit() {
  }

}
