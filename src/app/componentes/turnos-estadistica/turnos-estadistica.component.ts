import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { NotificationsService } from 'angular2-notifications';
import { DataApiService } from 'src/app/servicios/DataApi.service';
import { EstadoTurno } from 'src/app/clases/Turno';
import { Especialidad, Perfil } from 'src/app/clases/Usuario';
import { TurnosClientesInterface } from 'src/app/clases/TurnosClientes';

@Component({
  selector: 'app-turnos-estadistica',
  templateUrl: './turnos-estadistica.component.html',
  styleUrls: ['./turnos-estadistica.component.scss']
})
export class TurnosEstadisticaComponent implements OnInit {

  turnos;
  usuarios;
  turnosClientes: TurnosClientesInterface[];
  turnosRecepcionistas: TurnosClientesInterface[];
  panelOpenState = false;
  fechaDesdeForm = new FormControl('', [Validators.required]);
  fechaHastaForm = new FormControl('', [Validators.required]);
  resultTurnosCount = "Ingrese dos fechas";

  countOdontologia = 0;
  countEndodoncia = 0;
  countOrtodoncia = 0;
  countRadiologia = 0;
  countOdontologiaCancel = 0;
  countEndodonciaCancel = 0;
  countOrtodonciaCancel = 0;
  countRadiologiaCancel = 0;

  constructor(private ns: NotificationsService, private dataApi: DataApiService) { }

  ngOnInit() {
    this.dataApi.TraerTodos("turnos").subscribe(turnos => {
      if (turnos) {
        this.turnos = turnos;
        this.cargarTurnosLists();
      }
    });

    this.dataApi.TraerTodos("usuarios").subscribe(usuarios => {
      if (usuarios) {
        this.usuarios = usuarios;
        this.cargarClientesLists();
        this.cargarRecepcionistasLists();
      }
    });
  }

  buscarTurnos() {
    var fechaDesde = this.fechaDesdeForm.value;
    var fechaHasta = this.fechaHastaForm.value;

    if (fechaDesde > fechaHasta) {
      this.ns.alert("Fecha desde no puede ser mayor que fecha hasta");
      return;
    }

    var turnosList;
    turnosList = this.turnos.filter(x => x.Fecha.toDate() >= fechaDesde && x.Fecha.toDate() <= fechaHasta);
    this.resultTurnosCount = "Cantidad de turnos entre las fechas dadas: " + turnosList.length;
  }

  cargarTurnosLists() {
    this.countOdontologia = this.turnos.filter(x => x.Especialidad == Especialidad.Odontologia).length;
    this.countEndodoncia = this.turnos.filter(x => x.Especialidad == Especialidad.Endodoncia).length;
    this.countOrtodoncia = this.turnos.filter(x => x.Especialidad == Especialidad.Ortodoncia).length;
    this.countRadiologia = this.turnos.filter(x => x.Especialidad == Especialidad.Radiologia).length;

    this.countOdontologiaCancel = this.turnos.filter(x => x.Especialidad == Especialidad.Odontologia && x.Estado == EstadoTurno.Cancelado).length;
    this.countEndodonciaCancel = this.turnos.filter(x => x.Especialidad == Especialidad.Endodoncia && x.Estado == EstadoTurno.Cancelado).length;
    this.countOrtodonciaCancel = this.turnos.filter(x => x.Especialidad == Especialidad.Ortodoncia && x.Estado == EstadoTurno.Cancelado).length;
    this.countRadiologiaCancel = this.turnos.filter(x => x.Especialidad == Especialidad.Radiologia && x.Estado == EstadoTurno.Cancelado).length;
  }

  cargarClientesLists() {
    this.turnosClientes = [];

    this.usuarios.forEach(element => {
      if (element.Perfil == Perfil.Cliente) {
        let turnosCount = this.turnos.filter(x => x.CreadoPorCliente && x.NombreCliente == element.Nombre).length;
        let turno = {
          Nombre: element.Nombre,
          CountTurnos: turnosCount
        }
        this.turnosClientes.push(turno);
      }
    });
  }

  cargarRecepcionistasLists() {
    this.turnosRecepcionistas = [];

    this.usuarios.forEach(element => {
      if (element.Perfil == Perfil.Recepcionista) {
        let turnosCount = this.turnos.filter(x => !x.CreadoPorCliente && x.NombreRecepcionista == element.Nombre).length;
        let turno = {
          Nombre: element.Nombre,
          CountTurnos: turnosCount
        }
        this.turnosRecepcionistas.push(turno);
        console.log(this.turnosRecepcionistas);
      }
    });
  }
}
