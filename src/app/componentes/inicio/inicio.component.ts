import { Component, OnInit } from '@angular/core';
import { UsuarioInterface } from 'src/app/clases/Usuario';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { ListaUsuariosComponent } from '../lista-usuarios/lista-usuarios.component';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.scss']
})
export class InicioComponent implements OnInit {

  coleccionTipadaFirebase:AngularFirestoreCollection<any>;
  ListadoDeUsuarios:Observable<any[]>;
  
  especialistas: Array<any> = [];
  lista: Array<any> = [];

  constructor(private db: AngularFirestore) { 
   
  }

  ngOnInit() {
    this.coleccionTipadaFirebase= this.db.collection<any>("usuarios", ref => ref.where("Perfil", "==", "Especialista")); 
    //para el filtrado mirar la documentación https://firebase.google.com/docs/firestore/query-data/queries?authuser=0
    this.ListadoDeUsuarios=this.coleccionTipadaFirebase.valueChanges();
    this.ListadoDeUsuarios.subscribe(x => {
        this.especialistas = x
        
    });       
  }

 
}
