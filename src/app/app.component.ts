import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { finalize } from 'rxjs';
import { CursosService } from './services/cursos.service';
import { Curso, CursoPayload } from './models/curso.model';

interface CursoFormModel {
  nombre: string;
  docente: string;
  creditos: number | null;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  private readonly cursosService = inject(CursosService);

  readonly integrantes = [
    'Alcivar Dominguez Christian Eduardo',
    'Zambrano Bravo Ivan Eduardo'
  ];

  readonly cursos = signal<Curso[]>([]);
  readonly isLoading = signal(false);
  readonly isSubmitting = signal(false);
  readonly searchTerm = signal('');
  readonly feedbackMessage = signal('');
  readonly feedbackTone = signal<'success' | 'error' | 'info'>('info');
  readonly editingId = signal<number | null>(null);

  readonly form: CursoFormModel = this.createEmptyForm();

  readonly totalCursos = computed(() => this.cursos().length);
  readonly totalCreditos = computed(() =>
    this.cursos().reduce((accumulator, curso) => accumulator + Number(curso.creditos || 0), 0)
  );
  readonly filteredCursos = computed(() => {
    const term = this.searchTerm().trim().toLowerCase();

    if (!term) {
      return this.cursos();
    }

    return this.cursos().filter((curso) =>
      [curso.nombre, curso.docente, String(curso.creditos), String(curso.id)]
        .join(' ')
        .toLowerCase()
        .includes(term)
    );
  });

  constructor() {
    this.loadCursos();
  }

  loadCursos(): void {
    this.isLoading.set(true);

    this.cursosService
      .getAll()
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: (response) => {
          this.cursos.set([...response].sort((a, b) => a.id - b.id));
        },
        error: (error: Error) => {
          this.showFeedback(error.message, 'error');
        }
      });
  }

  submitForm(): void {
    if (!this.isFormValid()) {
      this.showFeedback('Completa correctamente todos los campos antes de guardar.', 'error');
      return;
    }

    const payload = this.buildPayload();
    const request$ = this.editingId()
      ? this.cursosService.update(this.editingId() as number, payload)
      : this.cursosService.create(payload);

    this.isSubmitting.set(true);

    request$
      .pipe(finalize(() => this.isSubmitting.set(false)))
      .subscribe({
        next: () => {
          const message = this.editingId()
            ? 'Curso actualizado correctamente.'
            : 'Curso registrado correctamente.';

          this.resetForm();
          this.loadCursos();
          this.showFeedback(message, 'success');
        },
        error: (error: Error) => {
          this.showFeedback(error.message, 'error');
        }
      });
  }

  startEdit(curso: Curso): void {
    this.editingId.set(curso.id);
    this.form.nombre = curso.nombre;
    this.form.docente = curso.docente;
    this.form.creditos = curso.creditos;
    this.showFeedback(`Editando el curso '${curso.nombre}'.`, 'info');
  }

  removeCurso(curso: Curso): void {
    const confirmed = window.confirm(`¿Deseas eliminar el curso '${curso.nombre}'?`);

    if (!confirmed) {
      return;
    }

    this.cursosService.delete(curso.id).subscribe({
      next: () => {
        this.loadCursos();
        if (this.editingId() === curso.id) {
          this.resetForm();
        }
        this.showFeedback('Curso eliminado correctamente.', 'success');
      },
      error: (error: Error) => {
        this.showFeedback(error.message, 'error');
      }
    });
  }

  cancelEdit(): void {
    this.resetForm();
    this.showFeedback('Edición cancelada.', 'info');
  }

  clearSearch(): void {
    this.searchTerm.set('');
  }

  trackByCursoId(_: number, curso: Curso): number {
    return curso.id;
  }

  private createEmptyForm(): CursoFormModel {
    return {
      nombre: '',
      docente: '',
      creditos: null
    };
  }

  private resetForm(): void {
    this.editingId.set(null);
    this.form.nombre = '';
    this.form.docente = '';
    this.form.creditos = null;
  }

  private isFormValid(): boolean {
    return (
      this.form.nombre.trim().length >= 3 &&
      this.form.docente.trim().length >= 3 &&
      this.form.creditos !== null &&
      Number(this.form.creditos) > 0
    );
  }

  private buildPayload(): CursoPayload {
    return {
      nombre: this.form.nombre.trim(),
      docente: this.form.docente.trim(),
      creditos: Number(this.form.creditos)
    };
  }

  private showFeedback(message: string, tone: 'success' | 'error' | 'info'): void {
    this.feedbackMessage.set(message);
    this.feedbackTone.set(tone);
  }
}
