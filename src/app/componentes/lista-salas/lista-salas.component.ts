import { Component, OnInit } from '@angular/core';
import { DataApiService } from 'src/app/servicios/DataApi.service';
import { MatTableDataSource } from '@angular/material';
import { ConsultorioInterface, EstadoConsultorio } from 'src/app/clases/Sala';

@Component({
  selector: 'app-lista-salas',
  templateUrl: './lista-salas.component.html',
  styleUrls: ['./lista-salas.component.scss']
})
export class ListaSalasComponent implements OnInit {

  displayedColumns: string[] = ['Codigo', 'Estado', 'Ocupar'];
  consultorios: ConsultorioInterface[];
  dataSource;

  constructor(private dataApi: DataApiService) { }

  ngOnInit() {
    this.dataApi.TraerTodos('consultorios')
      .subscribe(consultorios => {
        this.consultorios = consultorios;
        this.dataSource = new MatTableDataSource(this.consultorios);
      });
  }

  ocupar(id) {
    let consult = this.consultorios.filter(x => x.id == id)[0];

    if (consult) {
      consult.Estado = EstadoConsultorio.Ocupado;
      this.dataApi.ModificarUno(consult, 'consultorios');
      this.consultorios.find(x => x.id == id).Estado = EstadoConsultorio.Ocupado;
    }
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}