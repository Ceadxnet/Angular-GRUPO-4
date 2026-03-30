export interface Curso {
  id: number;
  nombre: string;
  docente: string;
  creditos: number;
}

export interface CursoPayload {
  nombre: string;
  docente: string;
  creditos: number;
}
