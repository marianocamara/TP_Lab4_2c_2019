import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { TurnoListaComponent } from '../turno-lista/turno-lista.component';
import { EncuestaInterface } from 'src/app/clases/Encuesta';
import { FormControl, Validators } from '@angular/forms';
// import { MateriaListaComponent } from '../materia-lista/materia-lista.component';
// import { MateriaInterface } from 'src/app/clases/Materia';

@Component({
  selector: 'app-modal-encuesta',
  templateUrl: './modal-encuesta.component.html',
  styleUrls: ['./modal-encuesta.component.scss']
})
export class ModalEncuestaComponent {

  private encuesta: EncuestaInterface;
  private puntuacionCtrol = new FormControl('', Validators.required);
  private puntuacionClinicaCtrol = new FormControl('', Validators.required);
  private opinionCtrol = new FormControl('', [Validators.required, Validators.maxLength(66)]);

  constructor(public dialogRef: MatDialogRef<TurnoListaComponent>
    , @Inject(MAT_DIALOG_DATA) public _Encuesta: EncuestaInterface) {
    this.encuesta = _Encuesta['encuesta'];
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  aceptar() {
    this.encuesta.PuntuacionClinica = this.puntuacionCtrol.value;
    this.encuesta.PuntuacionEspecialista = this.puntuacionClinicaCtrol.value;
    this.encuesta.Opinion = this.opinionCtrol.value;
    this.dialogRef.close(this.encuesta);
  }
}