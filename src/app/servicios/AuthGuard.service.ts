import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { UsuarioService } from './Usuario.service';
import { Perfil } from '../clases/Usuario';

@Injectable()
export class AuthGuardService implements CanActivate {

  constructor(private usuarioService: UsuarioService, private router: Router) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    let url: string = state.url;

    let logeado: boolean = this.usuarioService.isUserLoggedIn();

    if (url == '/logearse' || url == '/registrarse') {
      if (!logeado)
        return true;
      else
        return false;
    }

    if (logeado) {
      if (url == '/administracion' || url.includes('estadisticas')) {
        if (this.usuarioService.usuario.Perfil == Perfil.Administrador) {
          return true;
        }
      }

      if (url == '/turnos') {
        if (this.usuarioService.usuario.Perfil != Perfil.Administrador) {
          return true;
        }
      }

      if (url == '/saladeespera') {
        if (this.usuarioService.usuario.Perfil == Perfil.Recepcionista) {
          return true;
        }
      }
    }

    this.router.navigate([this.usuarioService.getInicioUrl()]);
    return false;
  }
}