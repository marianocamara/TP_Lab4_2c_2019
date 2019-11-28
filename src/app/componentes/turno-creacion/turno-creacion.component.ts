import { Component, OnInit } from '@angular/core';
import { FormControl, Validators, FormGroup, FormBuilder } from '@angular/forms';
import { UsuarioInterface, Perfil } from 'src/app/clases/Usuario';
import { DataApiService } from 'src/app/servicios/DataApi.service';
import { TurnoInterface, EstadoTurno } from 'src/app/clases/Turno';
import { UsuarioService } from 'src/app/servicios/Usuario.service';
import { NotificationsService } from 'angular2-notifications';
import Swal from "sweetalert2";
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-turno-creacion',
  templateUrl: './turno-creacion.component.html',
  styleUrls: ['./turno-creacion.component.scss']
})
export class TurnoCreacionComponent implements OnInit {

  minDate = new Date(Date.now());
  especialistas: UsuarioInterface[];
  clientes: UsuarioInterface[];
  mostrar = true;
  private perfil;
  private user;

  fechaForm = new FormControl('', [Validators.required]);
  especialistaForm = new FormControl('', Validators.required);
  clienteForm = new FormControl('', Validators.required);

  constructor(private fb: FormBuilder, private dataApi: DataApiService, private usuarioService: UsuarioService, private ns: NotificationsService) {
    this.perfil = this.usuarioService.usuario.Perfil;
    this.user = this.usuarioService.usuario;
  }

  ngOnInit() {
    this.especialistas = [];
    this.clientes = [];

    if (this.perfil == Perfil.Cliente) {
      this.clienteForm.setValue(this.user);
    }

    this.TraerClientes();
  }

  CrearTurno() {
    this.dataApi.TraerTodos('consultorios').pipe(take(1)).subscribe(consultorios => {
      console.log(consultorios);

      let consultorio = consultorios[Math.floor((Math.random() * 2))];
      let especialista = this.especialistaForm.value;
      let cliente = this.clienteForm.value;
      let creadoCliente = true;
      let UidRecepcionista = null;
      let NombreRecepcionista = null;

      if (this.perfil != Perfil.Cliente) {
        creadoCliente = false;
        UidRecepcionista = this.user.Uid;
        NombreRecepcionista = this.user.Nombre;
      }

      let turno: TurnoInterface = {
        UidCliente: cliente.Uid,
        NombreCliente: cliente.Nombre,
        UidEspecialista: especialista.Uid,
        NombreEspecialista: especialista.Nombre,
        Especialidad: especialista.Especialidad,
        Fecha: this.fechaForm.value,
        Estado: EstadoTurno.Pendiente,
        Encuesta: null,
        ObservacionesEspecialista: "",
        Consultorio: consultorio.Codigo,
        ConsultorioId: consultorio.id,
        CreadoPorCliente: creadoCliente,
        UidRecepcionista: UidRecepcionista,
        NombreRecepcionista: NombreRecepcionista
      }

      this.dataApi.AgregarUno(turno, 'turnos');

      Swal.fire(
        'Se creó el turno con éxito!',
        `El turno será el día ${turno.Fecha.toLocaleDateString()} en el consultorio: ${turno.Consultorio}.`,
        'success'
      )

      this.TraerEspecialistasPorFecha();
      // this.fechaForm.setValue("");
      // this.especialistaForm.setValue("");
      // if (this.perfil == Perfil.Cliente) {
      //   this.clienteForm.setValue(this.user);
      // }
      // else {
      //   this.clienteForm.setValue("");
      // }
      // this.especialistas = [];
    });
  }

  TraerClientes() {
    this.dataApi.TraerTodos('usuarios').subscribe(usuarios => {
      this.clientes = usuarios.filter(x => x.Perfil == Perfil.Cliente && x.Activo);
    });
  }

  TraerEspecialistasPorFecha() {
    console.log("form antes: " + this.especialistaForm.value);
    console.log("especialistas antes: " + this.especialistas.length);
    this.especialistas = [];
    this.especialistaForm.setValue(null);
    console.log("especialistas despues: " + this.especialistas.length);
    console.log("form despues: " + this.especialistaForm.value);
    this.especialistaForm.reset();

    this.dataApi.TraerTodos('turnos').pipe(take(1))
      .subscribe(_turnos => {
        var turnos = [];
        var fechaSelected = this.fechaForm.value;
        turnos = _turnos.filter(x =>
          x.Fecha.toDate().getFullYear() == fechaSelected.getFullYear() &&
          x.Fecha.toDate().getMonth() == fechaSelected.getMonth() &&
          x.Fecha.toDate().getDate() == fechaSelected.getDate()
        );

        var especialistasAux = [];
        this.dataApi.TraerTodos('usuarios').pipe(take(1)).subscribe(usuarios => {
          especialistasAux = usuarios.filter(x => x.Perfil == Perfil.Especialista && x.Activo);
          especialistasAux.forEach(element => {
            if (turnos.filter(x => x.UidEspecialista == element.Uid).length < 3) {
              this.especialistas.push(element);
            }
          });
        });
      });
  }
}