import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { DataApiService } from 'src/app/servicios/DataApi.service';
import { MatTableDataSource } from '@angular/material';
import * as XLSX from 'xlsx';
import * as jsPDF from 'jspdf';
import {MatSort, Sort} from '@angular/material/sort';
import { AngularFirestoreCollection, AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-empleados-estadistica',
  templateUrl: './empleados-estadistica.component.html',
  styleUrls: ['./empleados-estadistica.component.scss']
})
export class EmpleadosEstadisticaComponent implements OnInit {

  constructor(private dataApi: DataApiService) { }

  displayedColumns: string[] = ['Empleado', 'Dia', 'Horario'];
  columnsToDisplay: string[] = this.displayedColumns.slice();
  @ViewChild('TABLE', { static: false }) table: ElementRef;
  data;

  ngOnInit() {
    this.dataApi.TraerTodos('logs')
      .subscribe(logs => {
        this.data = new MatTableDataSource(logs);
      });
  }

  exportExcel() {
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(this.table.nativeElement);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Hoja 1');

    XLSX.writeFile(wb, 'LogsEmpleados.xlsx');
  }

  exportPdf() {
    let doc = new jsPDF();
    let specialElementHandlers = {
      '#editor': function (element, renderer) {
        return true;
      }
    };

    let table = this.table.nativeElement;

    doc.fromHTML(table.innerHTML, 15, 15, {
      'widht': 190,
      'elementHandlers': specialElementHandlers
    });

    doc.save('LogsEmpleados.pdf');
  }
}

