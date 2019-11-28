import { Component, OnInit, ViewChild } from '@angular/core';
import { DataApiService } from 'src/app/servicios/DataApi.service';
import { TurnoInterface, EstadoTurno } from 'src/app/clases/Turno';
import { MatTableDataSource, MatDialog } from '@angular/material';
import { UsuarioService } from 'src/app/servicios/Usuario.service';
import { map, take } from 'rxjs/operators';
import { Perfil } from 'src/app/clases/Usuario';
import { ModalEncuestaComponent } from '../modal-encuesta/modal-encuesta.component';
import { EncuestaInterface } from 'src/app/clases/Encuesta';
import { NotificationsService } from 'angular2-notifications';
import { ModalObservacionesComponent } from '../modal-observaciones/modal-observaciones.component';
import { EstadoConsultorio } from 'src/app/clases/Sala';
import {MatSort, Sort} from '@angular/material/sort';

@Component({
  selector: 'app-turno-lista',
  templateUrl: './turno-lista.component.html',
  styleUrls: ['./turno-lista.component.scss']
})
export class TurnoListaComponent implements OnInit {

  
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  columsCliente: string[] = ['NombreEspecialista', 'Especialidad', 'Fecha', 'Estado', 'Encuesta', 'Consultorio'];
  columsRecepcionista: string[] = ['NombreEspecialista', 'Especialidad', 'NombreCliente', 'Fecha', 'Estado', 'Consultorio', 'CancelarTurno'];
  columsEspecialista: string[] = ['NombreCliente', 'Fecha', 'Estado', 'Consultorio', 'FinalizarTurno'];

  perfil;
  turnos: TurnoInterface[];
  dataSource = new MatTableDataSource(this.turnos);
  noData = this.dataSource.connect().pipe(map((data: any[]) => data.length === 0));

  constructor(private dataApi: DataApiService, private usuarioService: UsuarioService, private dialog: MatDialog, private ns: NotificationsService) {
    this.perfil = this.usuarioService.usuario.Perfil;
  }

  ngOnInit() {
    this.dataApi.TraerTodos('turnos')
      .subscribe(turnos => {
        if (this.perfil == Perfil.Cliente)
          this.turnos = turnos.filter(x => x.UidCliente == this.usuarioService.usuario.Uid);
        else if (this.perfil == Perfil.Recepcionista) {
          this.turnos = turnos;
        }
        else if (this.perfil == Perfil.Especialista)
          this.turnos = turnos.filter(x => x.UidEspecialista == this.usuarioService.usuario.Uid);;

        this.dataSource = new MatTableDataSource(this.turnos);
        this.noData = this.dataSource.connect().pipe(map((data: any[]) => data.length === 0));
        this.dataSource.sort = this.sort; 
      
const sortState: Sort = {active: 'Fecha', direction: 'desc'};
this.sort.active = sortState.active;
this.sort.direction = sortState.direction;
this.sort.sortChange.emit(sortState)
      });

      
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  cancelarTurno(turno) {
    turno.Estado = EstadoTurno.Cancelado;
    console.log(turno.id);
    this.dataApi.ModificarUno(turno, 'turnos');
  }

  realizarEncuesta(turno) {
    var encuesta: EncuestaInterface = {
      NombreCliente: turno.NombreCliente,
      NombreEspecialista: turno.NombreEspecialista,
      UidCliente: turno.UidCliente,
      UidEspecialista: turno.UidEspecialista,
      PuntuacionClinica: 0,
      PuntuacionEspecialista: 0,
      Opinion: ""
    }

    const dialogRef = this.dialog.open(ModalEncuestaComponent, {
      data: { encuesta: encuesta }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result != undefined) {
        turno.Encuesta = result;
        this.dataApi.ModificarUno(turno, 'turnos');
        this.ns.success("Se envió la encuesta exitosamente");
      }
    });
  }

  finalizarTurno(turno) {
    const dialogRef = this.dialog.open(ModalObservacionesComponent, {
      height: '275px',
      width: '700px',
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result != undefined) {

        this.dataApi.TraerUno(turno.ConsultorioId, 'consultorios').pipe(take(1)).subscribe(consultorio => {
          consultorio.Estado = EstadoConsultorio.Libre;
          this.dataApi.ModificarUno(consultorio, "consultorios");
        });

        turno.Estado = EstadoTurno.Finalizado;
        turno.ObservacionesEspecialista = result;
        this.dataApi.ModificarUno(turno, 'turnos');
        this.ns.success("Se envió la observación exitosamente");
      }
    });
  }
}
