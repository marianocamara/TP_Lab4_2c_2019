import { Component } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material';
import { TurnoListaComponent } from '../turno-lista/turno-lista.component';

@Component({
  selector: 'app-modal-observaciones',
  templateUrl: './modal-observaciones.component.html',
  styleUrls: ['./modal-observaciones.component.scss']
})
export class ModalObservacionesComponent {

  private observacionCtrol = new FormControl('', Validators.required);

  constructor(public dialogRef: MatDialogRef<TurnoListaComponent>) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

  aceptar() {
    this.dialogRef.close(this.observacionCtrol.value);
  }
}
