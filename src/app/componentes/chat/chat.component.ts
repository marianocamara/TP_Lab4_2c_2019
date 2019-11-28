import { OnInit, Component } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Observable } from 'rxjs';
import { UsuarioService } from 'src/app/servicios/Usuario.service';
import { Mensaje } from 'src/app/clases/Mensaje';
import { map } from 'rxjs/operators';
import { NotificationsService } from 'angular2-notifications';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {

  private mensajesCollection: AngularFirestoreCollection<Mensaje>;
  mensajes: Observable<Mensaje[]>;
  mensaje: Mensaje;

  constructor(private afs: AngularFirestore, private usuarioService: UsuarioService, private ns: NotificationsService) {
    this.mensaje = new Mensaje();
    this.mensajesCollection = afs.collection<Mensaje>('mensajes');
    this.mensajes = this.mensajesCollection.valueChanges().pipe(
      map(lessons => lessons.sort((a, b) => new Date(a.Fecha).getTime() - new Date(b.Fecha).getTime()))
    );

    this.EnterPresionado = this.EnterPresionado.bind(this);
    document.addEventListener('keypress', this.EnterPresionado);
  }

  ngOnInit() {
  }

  NuevoMensaje() {

    if (this.mensaje.Mensaje == undefined || this.mensaje.Mensaje.trim() == '') {
      return;
    }

    this.mensaje.UserUid = this.usuarioService.usuario.Uid;
    this.mensaje.UrlImagen = this.usuarioService.usuario.ImagenUrl;
    this.mensaje.Nombre = this.usuarioService.usuario.Nombre;
    this.mensaje.Fecha = Date.now();
    this.mensajesCollection.add({ 'Mensaje': this.mensaje.Mensaje, 'Fecha': this.mensaje.Fecha, 'UserUid': this.mensaje.UserUid, 'UrlImagen': this.mensaje.UrlImagen, 'Nombre': this.mensaje.Nombre }); //new Mensaje(msj, Date.now(), this.usuarioService.usuario.Uid));
    this.mensaje = new Mensaje();
  }

  EnterPresionado(event: any) {
    if (event.which === 13) {
      this.NuevoMensaje();
    }
  }
}