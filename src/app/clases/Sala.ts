export enum EstadoConsultorio {
    Libre = "Libre",
    Ocupado = "Ocupado",
}

export interface ConsultorioInterface {
    id: string;
    Codigo: string;
    Estado: EstadoConsultorio;
}