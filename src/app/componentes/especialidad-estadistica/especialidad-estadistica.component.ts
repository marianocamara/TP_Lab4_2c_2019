import { Component, OnInit } from '@angular/core';
import { NotificationsService } from 'angular2-notifications';
import { DataApiService } from 'src/app/servicios/DataApi.service';
import { Especialidad } from 'src/app/clases/Usuario';
import { EstadoTurno } from 'src/app/clases/Turno';

@Component({
  selector: 'app-especialidad-estadistica',
  templateUrl: './especialidad-estadistica.component.html',
  styleUrls: ['./especialidad-estadistica.component.scss']
})
export class EspecialidadEstadisticaComponent implements OnInit {

  panelOpenState = false;
  turnos;
  usuarios;
  mejoresComentarios;
  peoresComentarios;
  masUsada;
  menosUsada;
  mejorComentario;
  peorComentario;

  constructor(private ns: NotificationsService, private dataApi: DataApiService) { }

  ngOnInit() {
    this.dataApi.TraerTodos("turnos").subscribe(turnos => {
      if (turnos) {
        this.turnos = turnos;
        this.cargarEspecialidades();
        this.cargarComentarios();
      }
    });

    this.dataApi.TraerTodos("usuarios").subscribe(usuarios => {
      if (usuarios) {
        this.usuarios = usuarios;
      }
    });
  }

  cargarEspecialidades() {
    var countDen = this.turnos.filter(x => x.Especialidad == Especialidad.Odontologia).length;
    console.log(countDen);
    var countDer = this.turnos.filter(x => x.Especialidad == Especialidad.Endodoncia).length;
    console.log(countDer);
    var countPsi = this.turnos.filter(x => x.Especialidad == Especialidad.Ortodoncia).length;
    console.log(countPsi);
    var countOnc = this.turnos.filter(x => x.Especialidad == Especialidad.Radiologia).length;
    console.log(countOnc);

    var especialidadMasUsada = Math.max(countDen, countDer, countOnc, countPsi);

    switch (especialidadMasUsada) {
      case countDer:
        this.masUsada = Especialidad.Endodoncia;
        break;
      case countPsi:
        this.masUsada = Especialidad.Ortodoncia;
        break;
      case countDen:
        this.masUsada = Especialidad.Odontologia;
        break;
      case countOnc:
        this.masUsada = Especialidad.Radiologia;
        break;
    }

    var especialidadMenosUsada = Math.min(countDen, countDer, countOnc, countPsi);

    switch (especialidadMenosUsada) {
      case countDer:
        this.menosUsada = Especialidad.Endodoncia;
        break;
      case countPsi:
        this.menosUsada = Especialidad.Ortodoncia;
        break;
      case countDen:
        this.menosUsada = Especialidad.Odontologia;
        break;
      case countOnc:
        this.menosUsada = Especialidad.Radiologia;
        break;
    }
  }

  cargarComentarios() {
    this.mejoresComentarios = [];
    this.peoresComentarios = [];

    var turnosEncuestados = this.turnos.filter(x => x.Estado == EstadoTurno.Finalizado && x.Encuesta != null);

    if (turnosEncuestados.length > 0) {
      var puntuacionesEsp = turnosEncuestados.map((obj) => {
        return Number.parseInt(obj.Encuesta.PuntuacionEspecialista);
      });

      var maxValue = Math.max(...puntuacionesEsp);
      var minValue = Math.min(...puntuacionesEsp);
      console.log(maxValue);
      console.log(minValue);

      turnosEncuestados.forEach(element => {
        let comentario = {
          NombreCliente: "",
          Comentario: "",
          Especialista:"",
          PuntuacionClinica:"",
          PuntuacionEspecialista:"",
        };

        if (Number.parseInt(element.Encuesta.PuntuacionEspecialista) == maxValue) {
          comentario.Comentario = element.Encuesta.Opinion;
          comentario.NombreCliente = element.NombreCliente;
          comentario.PuntuacionEspecialista = element.Encuesta.PuntuacionEspecialista;
          comentario.PuntuacionClinica = element.Encuesta.PuntuacionClinica;
          comentario.Especialista = element.Encuesta.NombreEspecialista;
          this.mejoresComentarios.push(comentario);
          this.mejorComentario = comentario;
        }
        else if (Number.parseInt(element.Encuesta.PuntuacionEspecialista) == minValue) {
          comentario.Comentario = element.Encuesta.Opinion;
          comentario.NombreCliente = element.NombreCliente;
          comentario.PuntuacionEspecialista = element.Encuesta.PuntuacionEspecialista;
          comentario.PuntuacionClinica = element.Encuesta.PuntuacionClinica;
          comentario.Especialista = element.Encuesta.NombreEspecialista;
          this.peoresComentarios.push(comentario);
          this.peorComentario = comentario;
        }
      });
    }
  }
}
