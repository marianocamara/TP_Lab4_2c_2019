import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import { UsuarioService } from 'src/app/servicios/Usuario.service';
import { finalize } from 'rxjs/operators';
import { Observable, empty } from 'rxjs';
import { Perfil, UsuarioInterface, Especialidad } from 'src/app/clases/Usuario';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.scss']
})
export class RegistroComponent implements OnInit {

  @ViewChild("imgUsuario", { static: false }) InputImagenUser: ElementRef;

  perfil;
  imgName: string;
  nombreModel: string;
  emailModel: string;
  passwordModel: string;
  usuario: UsuarioInterface;
  captchaVerificado: boolean;
  accepted: boolean;
  porcentajeUpload: Observable<number>;
  urlImagen: Observable<string>;
  noCargando = true;
  Cliente; Recepcionista; AdministrAdor; Especialista;

  constructor(private usuarioService: UsuarioService, private storage: AngularFireStorage, private elRef: ElementRef) {
    this.imgName = "Seleccionar imágen..";
    this.usuario = this.usuarioService.UsuarioVacio();
    this.captchaVerificado = false;
  }

  ngOnInit() { }

  Registrarse() {
    this.usuario.Perfil = Perfil[(<HTMLInputElement>document.getElementById("perfil")).value];

    if (this.usuario.Perfil == Perfil.Especialista) {
      this.usuario.Especialidad = Especialidad[(<HTMLInputElement>document.getElementById("especialidad")).value];
    }

    this.usuario.Email = this.emailModel;
    this.usuario.Nombre = this.nombreModel;
    this.usuario.Password = this.passwordModel;
    this.usuario.ImagenUrl = this.InputImagenUser.nativeElement.value;

    if (!this.usuario.ImagenUrl) {
      this.usuario.ImagenUrl = "assets/img/default-user.png";
    }

    this.usuarioService.RegistrarUsuario(this.usuario);
  }

  ImagenCargada(e) {
    this.noCargando = false;
    const img = e.target.files[0];

    if (img != undefined) {
      this.imgName = img.name;
      const nombreImg = img.name.substr(0, img.name.lastIndexOf('.'));
      const ext = img.name.substr(img.name.lastIndexOf('.') + 1);
      const filePath = "imagenes/usuarios/" + nombreImg + "-" + Date.now() + "." + ext;
      const ref = this.storage.ref(filePath);
      const task = this.storage.upload(filePath, img);
      this.porcentajeUpload = task.percentageChanges();
      task.snapshotChanges().pipe(finalize(() => this.urlImagen = ref.getDownloadURL())).subscribe();
    }
    else {
      this.imgName = "Seleccionar imágen..";
      this.urlImagen = empty();
      this.noCargando = true;
    }
  }

  resolved(captchaResponse: string) {
    this.captchaVerificado = true;
  }

  changePerfil(perfil) {
    this.perfil = perfil;
  }
}
