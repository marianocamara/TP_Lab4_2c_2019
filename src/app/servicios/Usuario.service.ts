import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { map, take } from 'rxjs/operators';
import { Router } from '@angular/router';
import { UsuarioInterface, Perfil } from '../clases/Usuario';
import { AngularFirestore } from '@angular/fire/firestore';
import { NotificationsService } from 'angular2-notifications';
import { DataApiService } from './DataApi.service';

@Injectable({
    providedIn: 'root'
})
export class UsuarioService {

    usuario: UsuarioInterface;
    estaLogeado: boolean;
    private redirectUrl: string = '/';
    private loginUrl: string = '/logearse';
    private incioUrl: string = '';

    constructor(private afsAuth: AngularFireAuth, private db: AngularFirestore, private router: Router, private ns: NotificationsService, private dataApi: DataApiService) {
        this.usuario = this.UsuarioVacio();
    }

    RegistrarUsuario(usuario: UsuarioInterface) {
        return new Promise(() => {
            this.afsAuth.auth.createUserWithEmailAndPassword(usuario.Email, usuario.Password)
                .then(
                    (userData) => {
                        return userData.user.updateProfile({
                            displayName: usuario.Nombre,
                            photoURL: usuario.ImagenUrl
                        });
                    },
                    (err) => {
                        console.log(err);
                        this.UsuarioVacio();
                        this.ns.error("Error al registrarse", "Sucedió un error al registrarse, intente nuevamente.");
                    }
                )
                .then(
                    () => {
                        this.EstaLogeado().pipe(take(1)).subscribe(
                            (userData) => {
                                if (userData) {
                                    usuario.Password = '';
                                    usuario.Uid = userData.uid;
                                    usuario.Email = userData.email;
                                    usuario.ImagenUrl = userData.photoURL;
                                    usuario.Nombre = userData.displayName;
                                    usuario.Perfil = usuario.Perfil;
                                    usuario.Activo = false;
                                    this.ns.success("Registro exitoso");
                                    this.router.navigate(['']);
                                    this.db.collection('usuarios').doc(userData.uid).set(usuario).then(() => {
                                        this.DeslogearUsuario();
                                    });
                                }
                                else {
                                    this.UsuarioVacio();
                                }
                            },
                            (err) => {
                                console.log(err);
                                this.UsuarioVacio();
                                this.ns.error("Error inesperado", "Sucedió un error inesperado.");
                            });
                    });
        });
    }


    RegistrarUsuarioAdmin(usuario: UsuarioInterface) {
        return new Promise(() => {
            this.afsAuth.auth.createUserWithEmailAndPassword(usuario.Email, usuario.Password)
                .then(
                    (userData) => {
                        return userData.user.updateProfile({
                            displayName: usuario.Nombre,
                            photoURL: usuario.ImagenUrl
                        });
                    },
                    (err) => {
                        console.log(err);
                        this.UsuarioVacio();
                        this.ns.error("Error al registrar", "Sucedió un error al registrar el usuario, intente nuevamente.");
                    }
                )
                .then(
                    () => {
                        this.EstaLogeado().pipe(take(1)).subscribe(
                            (userData) => {
                                if (userData) {
                                    usuario.Password = '';
                                    usuario.Uid = userData.uid;
                                    usuario.Email = userData.email;
                                    usuario.ImagenUrl = userData.photoURL;
                                    usuario.Nombre = userData.displayName;
                                    usuario.Perfil = usuario.Perfil;
                                    usuario.Activo = false;
                                    this.ns.success("Registro de usuario exitoso");
                                    this.db.collection('usuarios').doc(userData.uid).set(usuario).then(() => {
                                    });
                                }
                                else {
                                    this.UsuarioVacio();
                                }
                            },
                            (err) => {
                                console.log(err);
                                this.UsuarioVacio();
                                this.ns.error("Error inesperado", "Sucedió un error inesperado.");
                            });
                    });
        });
    }


    LogearUsuario(email: string, password: string) {
        return new Promise(() => {
            this.afsAuth.auth.signInWithEmailAndPassword(email, password)
                .then(
                    (userData) => {
                        if (userData) {
                            this.dataApi.TraerUno(userData.user.uid, 'usuarios').pipe(take(1)).subscribe(userx => {
                                if (!userx.Activo) {
                                    this.ns.warn("Solicite la activacion del administrador");
                                    this.DeslogearUsuario();
                                }
                                else {

                                    if (userx.Perfil == Perfil.Especialista || userx.Perfil == Perfil.Recepcionista) {
                                        console.log("entro a logs");
                                        var today = new Date();
                                        var date = today.getDate() + '/' + (today.getMonth() + 1) + '/' + today.getFullYear();

                                        var today = new Date();
                                        var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();

                                        var estEmpl = {
                                            Empleado: userx.Nombre,
                                            Dia: date,
                                            Horario: time,
                                            datetime: Date.now(),
                                            perfil: userx.Perfil
                                        }

                                        this.dataApi.AgregarUno(estEmpl, 'logs');
                                    }

                                    this.usuario.Uid = userx.Uid;
                                    this.usuario.Email = userx.Email;
                                    this.usuario.ImagenUrl = userx.ImagenUrl;
                                    this.usuario.Nombre = userx.Nombre;
                                    this.usuario.Perfil = userx.Perfil;
                                    this.ns.success("Logeo exitoso!");
                                    this.router.navigate(['']);
                                }
                            });
                        }
                        else {
                            this.usuario = this.UsuarioVacio();
                        }
                    },
                    (err) => {
                        console.log(err);
                        this.usuario = this.UsuarioVacio();
                        this.ns.error("Error al logearse", "Esta cuenta no existe");
                    });
        });
    }


    DeslogearUsuario() {
        this.usuario = this.UsuarioVacio();
        this.afsAuth.auth.signOut();
        this.router.navigate(['']);
    }

    EstaLogeado() {
        return this.afsAuth.authState.pipe(map(auth => auth));
    }

    UsuarioVacio() {
        return {
            Uid: '',
            Nombre: '',
            Email: '',
            Password: '',
            ImagenUrl: "",
            Activo: false,
            Perfil: Perfil.Cliente
        }
    }

    isUserLoggedIn(): boolean {
        return this.estaLogeado;
    }
    setRedirectUrl(url: string): void {
        this.redirectUrl = url;
    }
    getLoginUrl(): string {
        return this.loginUrl;
    }
    getInicioUrl(): string {
        return this.incioUrl;
    }

    EstadoLogeo() {

        this.afsAuth.auth.onAuthStateChanged(
            (user) => {
                if (user) {
                    this.dataApi.TraerUno(user.uid, 'usuarios').pipe(take(1)).subscribe(userx => {
                        this.usuario = userx;
                    });

                    this.estaLogeado = true;
                }
                else
                    this.estaLogeado = false;
            },
            () => {
                this.estaLogeado = false;
            }
        );
    }
}