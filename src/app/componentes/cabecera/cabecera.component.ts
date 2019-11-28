import { Component, OnInit } from '@angular/core';
import { UsuarioService } from 'src/app/servicios/Usuario.service';
import { DataApiService } from 'src/app/servicios/DataApi.service';
import { take } from 'rxjs/operators';
import { Perfil } from 'src/app/clases/Usuario';
import { google } from '@agm/core/services/google-maps-types';
import { HttpClient } from '@angular/common/http';
import { LocationResponse, LocationSave } from 'src/app/clases/LocationResponse';
import { NotificationsService } from 'angular2-notifications';

@Component({
  selector: 'app-cabecera',
  templateUrl: './cabecera.component.html',
  styleUrls: ['./cabecera.component.scss']
})
export class CabeceraComponent implements OnInit {

  public estaLogeado: boolean;
  administrador = false;
  recepcionista = false;
  cliente = false;
  especialista = false;

  imagenUrl = "";
  nombre = "";
  perfil: Perfil;

  constructor(private usuarioService: UsuarioService, private dataApi: DataApiService, private http: HttpClient, private ns: NotificationsService) { }

  ngOnInit() {
    this.TraerUsuarioActual();
  }

  TraerUsuarioActual() {
    this.usuarioService.EstaLogeado().subscribe(user => {
      if (user) {
        this.dataApi.TraerUno(user.uid, 'usuarios').pipe(take(1)).subscribe(userx => {

          if (userx) {
            if (userx.Activo) {
              this.usuarioService.usuario = userx;

              this.imagenUrl = userx.ImagenUrl;
              this.nombre = userx.Nombre;
              this.perfil = userx.Perfil;
              this.estaLogeado = true;
            }
            else {
              this.imagenUrl = "";
              this.nombre = "";
              this.estaLogeado = false;
              this.perfil = null;
            }
          }

        });
      }
      else {
        this.imagenUrl = "";
        this.nombre = "";
        this.estaLogeado = false;
        this.perfil = null;
      }
    });
  }

  Deslogearse() {
    this.imagenUrl = "";
    this.nombre = "";
    this.usuarioService.DeslogearUsuario();
    this.perfil = null;
  }

  emergencia() {
    navigator.geolocation.getCurrentPosition((position) => {
      var lat = position.coords.latitude;
      var lng = position.coords.longitude;
      var url = ``;

      this.http.get(url).subscribe((location: LocationResponse) => {
        debugger;
        if (location.status == "OK") {

          let adress: LocationSave = {
            address_plus: location.plus_code.compound_code,
            firstResult: location.results[0]
          }

          this.dataApi.AgregarUno(adress, "localizacion");
          this.ns.success(`Ya se envió la ambulancia a su ubicación ${adress}, aguarde 20 minutos.`);
        }
        else {
          console.log(location);
          this.ns.error("Error", "Sucedió un error al conectarse con el servidor.");
        }
      });
    });
  }
}
