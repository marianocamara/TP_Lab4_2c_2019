import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { DataApiService } from 'src/app/servicios/DataApi.service';
import { UsuarioInterface } from 'src/app/clases/Usuario';
import { MatTableDataSource } from '@angular/material';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UsuarioService } from 'src/app/servicios/Usuario.service';
import { Observable, empty } from 'rxjs';
import { AngularFireStorage } from '@angular/fire/storage';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-lista-usuarios',
  templateUrl: './lista-usuarios.component.html',
  styleUrls: ['./lista-usuarios.component.scss']
})
export class ListaUsuariosComponent implements OnInit {

  @ViewChild("imgUsuario", { static: false }) InputImagenUser: ElementRef;
  
  private displayedColumns: string[] = ['Imágen', 'Nombre', 'Email', 'Perfil', 'Activo'];
  private usuarios: UsuarioInterface[];
  private dataSource;
  usuario: UsuarioInterface;
  isLinear = false;
  nombre: FormGroup;
  email: FormGroup;
  contrasena: FormGroup;
  perfil: FormGroup;
  especialidad: FormGroup;
  imagen: FormGroup;

  urlImagen: Observable<string>;
  imgName: string;
  noCargando = true;
  porcentajeUpload: Observable<number>;
  
  
  
  constructor(private dataApi: DataApiService, private _formBuilder: FormBuilder,private usuarioService: UsuarioService, private storage: AngularFireStorage) { 
    this.usuario = this.usuarioService.UsuarioVacio();
    this.imgName = "Seleccionar imágen..";

  }
  
  ngOnInit() {
    
    this.dataApi.TraerTodos('usuarios')
    .subscribe(users => {
      this.usuarios = users;
      this.dataSource = new MatTableDataSource(this.usuarios);
    });
    
    
    
    this.nombre = this._formBuilder.group({
      nombre: ['', Validators.required]
    });
    this.email = this._formBuilder.group({
      email: ['', Validators.required]
    });
    this.contrasena = this._formBuilder.group({
      contrasena: ['', Validators.required]
    });
    this.perfil = this._formBuilder.group({
      perfil  : ['', Validators.required]
    });
    this.especialidad = this._formBuilder.group({
      especialidad  : ['', Validators.required]
    });
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


  activarDesactivar(uid: string) {
    
    let usuario = this.usuarios.filter(x => x.Uid == uid)[0];
    
    if (usuario) {
      usuario.Activo = usuario.Activo ? false : true;
      
      this.dataApi.ModificarUno(usuario, 'usuarios');
      this.usuarios.find(x => x.Uid == uid).Activo = usuario.Activo;
    }
  }
  
  altaUsuario(){
    console.log(this.nombre.value.nombre);
    console.log(this.perfil.value.perfil);
    this.usuario.Email = this.email.value.email;
    this.usuario.Nombre = this.nombre.value.nombre;
    this.usuario.Password = this.contrasena.value.contrasena;
    this.usuario.Perfil = this.perfil.value.perfil;
    if (this.usuario.Perfil == 'Especialista') {
      this.usuario.Especialidad = this.especialidad.value.especialidad;
    }
    this.usuario.ImagenUrl = this.InputImagenUser.nativeElement.value;
    if (!this.usuario.ImagenUrl) {
      this.usuario.ImagenUrl = "assets/img/default-user.png";
    }

    this.usuarioService.RegistrarUsuarioAdmin(this.usuario);
  }
  
  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
