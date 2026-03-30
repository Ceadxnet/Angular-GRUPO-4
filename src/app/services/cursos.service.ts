import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { Curso, CursoPayload } from '../models/curso.model';

@Injectable({
  providedIn: 'root'
})
export class CursosService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl;

  getAll(): Observable<Curso[]> {
    return this.http
      .get<Curso[]>(this.apiUrl)
      .pipe(catchError((error) => this.handleError(error, 'No se pudo cargar la lista de cursos.')));
  }

  create(payload: CursoPayload): Observable<Curso> {
    return this.http
      .post<Curso>(this.apiUrl, payload)
      .pipe(catchError((error) => this.handleError(error, 'No se pudo registrar el curso.')));
  }

  update(id: number, payload: CursoPayload): Observable<Curso> {
    return this.http
      .put<Curso>(`${this.apiUrl}/${id}`, payload)
      .pipe(catchError((error) => this.handleError(error, 'No se pudo actualizar el curso.')));
  }

  delete(id: number): Observable<void> {
    return this.http
      .delete<void>(`${this.apiUrl}/${id}`)
      .pipe(catchError((error) => this.handleError(error, 'No se pudo eliminar el curso.')));
  }

  private handleError(error: unknown, fallbackMessage: string) {
    const message =
      typeof error === 'object' && error !== null && 'error' in error
        ? this.resolveServerMessage((error as { error?: unknown }).error, fallbackMessage)
        : fallbackMessage;

    return throwError(() => new Error(message));
  }

  private resolveServerMessage(serverError: unknown, fallbackMessage: string): string {
    if (typeof serverError === 'string' && serverError.trim()) {
      return serverError;
    }

    if (
      typeof serverError === 'object' &&
      serverError !== null &&
      'message' in serverError &&
      typeof (serverError as { message?: unknown }).message === 'string'
    ) {
      return (serverError as { message: string }).message;
    }

    return fallbackMessage;
  }
}
