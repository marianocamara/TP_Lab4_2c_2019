export enum Perfil {
    Cliente = 'Cliente',
    Recepcionista = 'Recepcionista',
    Especialista = 'Especialista',
    Administrador = 'Administrador'
}

export enum Especialidad {
    Odontologia = 'Odontologia',
    Endodoncia = 'Endodoncia',
    Ortodoncia = 'Ortodoncia',
    Radiologia = 'Radiologia'
}

export interface UsuarioInterface {
    Uid: string;
    Nombre: string;
    Email: string;
    Password: string;
    ImagenUrl?: string;
    Perfil?: Perfil;
    Especialidad?: string;
    Activo?: boolean;
}
